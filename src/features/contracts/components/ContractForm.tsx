"use client";

import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Contract } from "@/types";
import { ContractStatus, LeaseType, RentalStatus } from "@/types/enums";
import {
	contractCreateSchema,
	ContractFormData,
	ContractUpdateFormData,
	contractUpdateSchema,
} from "../schemas/contractSchemas";
import { DatePicker } from "@/components/shared/DatePicker";
import { formatDateForForm } from "@/lib";
import { useSearchParams } from "next/navigation";
import { useTenants } from "@/features/tenants/hooks/useTenants.hooks";
import { ComboboxTenants } from "@/components/shared/ComboboxTenants";
import { usePropertiesWithRelations } from "@/features/properties/hooks/useProperties.hooks";
import { Combobox } from "@/components/shared/Combobox";

type ContractFormProps =
	| {
		mode: "create";
		initialData?: null;
		onSubmit: (data: ContractFormData) => Promise<void>;
		isLoading?: boolean;
		submitButtonText?: string;
	}
	| {
		mode: "edit";
		initialData: Contract;
		onSubmit: (data: ContractUpdateFormData) => Promise<void>;
		isLoading?: boolean;
		submitButtonText?: string;
	};

const LEASE_TYPE = [
	{ value: "RESIDENTIAL_LEASE", label: "Bail d'habitation" },
	{ value: "COMMERCIAL_LEASE", label: "Bail commercial" },
	{ value: "OTHER", label: "Autre" },
];

type ContractFormValues = ContractFormData | ContractUpdateFormData;

function parsePositiveInt(value: string | null): number | null {
	if (!value) return null;
	const parsed = Number(value);
	return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function getContractDefaultValues(
	mode: ContractFormProps["mode"],
	initialData?: Contract | null
): Partial<ContractFormData> {
	if (mode === "edit" && initialData) {
		return {
			propertyId: (initialData.propertyId ?? undefined) as number | undefined,
			rentalId: (initialData.rentalId ?? undefined) as number | undefined,
			tenantId: initialData.tenant?.user?.id ?? undefined,
			managerId: initialData.managerId ?? null,
			rentDeposit: initialData.rentDeposit ?? undefined,
			rentAdvance: initialData.rentAdvance ?? undefined,
			chargesAmount: initialData.chargesAmount ?? undefined,
			rentAmount: initialData.rentAmount ?? undefined,
			startDate: initialData.startDate ? formatDateForForm(initialData.startDate) ?? "" : "",
			endDate: initialData.endDate ? formatDateForForm(initialData.endDate) ?? null : null,
			dayAddToPaymentDay: initialData.dayAddToPaymentDay ?? 0,
			paymentStartAfter: initialData.paymentStartAfter ?? 1,
			leaseType: initialData.leaseType ?? undefined,
			status: initialData.status ?? ContractStatus.PENDING,
			pdfUrl: initialData.pdfUrl ?? undefined,
		};
	}
	return {
		propertyId: undefined,
		rentalId: undefined,
		tenantId: undefined,
		managerId: null,
		rentDeposit: 3,
		rentAdvance: undefined,
		rentAmount: undefined,
		chargesAmount: undefined,
		startDate: "",
		endDate: null,
		dayAddToPaymentDay: 5,
		paymentStartAfter: undefined,
		leaseType: LeaseType.RESIDENTIAL_LEASE,
		status: ContractStatus.PENDING,
		pdfUrl: undefined,
	};
}

export function ContractForm(props: ContractFormProps) {
	const { mode, initialData, isLoading = false, submitButtonText } = props;
	const isEditMode = mode === "edit";

	const searchParams = useSearchParams();
	const urlTenantId = parsePositiveInt(searchParams.get("tenantId"));
	const tenantProfileId = parsePositiveInt(searchParams.get("tenantProfileId"));
	const legacyLocataireId = parsePositiveInt(searchParams.get("locataireId"));

	const { data: tenantsList } = useTenants();
	const hasAppliedUrlTenant = useRef(false);

	const form = useForm<ContractFormValues>({
		resolver: zodResolver(isEditMode ? contractUpdateSchema : contractCreateSchema),
		mode: "onChange",
		defaultValues: getContractDefaultValues(mode, initialData),
	});

	useEffect(() => {
		if (isEditMode || hasAppliedUrlTenant.current) return;

		const legacyTenantUserId = tenantProfileId
			? tenantsList?.find((tenant) => tenant.tenantProfile?.id === tenantProfileId)?.id
			: undefined;
		const initialTenantUserId = urlTenantId ?? legacyLocataireId ?? legacyTenantUserId;

		if (initialTenantUserId) {
			form.setValue("tenantId", initialTenantUserId, {
				shouldValidate: true,
				shouldDirty: false,
			});
			hasAppliedUrlTenant.current = true;
		}
	}, [isEditMode, urlTenantId, tenantProfileId, legacyLocataireId, tenantsList, form]);

	const handleSubmit = async (data: ContractFormValues) => {
		if (props.mode === "create") {
			const createData = { ...(data as ContractFormData) };
			if (!createData.tenantId) {
				form.setError("tenantId", {
					type: "manual",
					message: "Locataire invalide. Veuillez sélectionner un locataire valide.",
				});
				return;
			}
			await props.onSubmit(createData);
			return;
		}
		const updateData = { ...(data as ContractUpdateFormData) };
		delete updateData.tenantId;
		await props.onSubmit(updateData);
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSubmit)}
				className="w-full flex justify-center"
			>
				<Card className="w-full max-w-5xl mx-auto mt-8 shadow-lg border-primary/10">
					<CardContent className="flex flex-col gap-8">
						{/* <h2 className="text-xl font-bold">Informations du contrat</h2> */}

						{/* Section Locataire */}
						<div className="space-y-4">
							{/* <h3 className="text-base font-semibold">Locataire</h3> */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="tenantId"
									rules={{
										validate: (value) =>
											isEditMode ||
											typeof value === "number" && value > 0
												? true
												: "Veuillez sélectionner un locataire.",
									}}
									render={({ field }) => (
										<FormItem className="md:col-span-2">
											<FormLabel>Locataire</FormLabel>
											<FormControl>
												<ComboboxTenants
													tenants={tenantsList ?? []}
													value={field.value ?? undefined}
													onChange={(tenantUserId) => field.onChange(tenantUserId)}
													placeholder="Sélectionner un locataire..."
													searchPlaceholder="Rechercher un locataire..."
													emptyResultText="Aucun locataire trouvé."
													disabled={isLoading || isEditMode}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>

						{/* Infos principales du contrat */}
					
						{/* Section Type et montants */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="leaseType"
								rules={{
									required: "Champs requis"
								}}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Type de bail <span className="text-destructive">*</span></FormLabel>
										<Select
											onValueChange={field.onChange}
											value={field.value ?? undefined}
										>
											<FormControl className="w-full">
												<SelectTrigger>
													<SelectValue placeholder="Choisir un type de bail" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{LEASE_TYPE.map((option) => (
													<SelectItem key={option.value} value={option.value}>
														{option.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="rentAmount"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Loyer <span className="text-destructive">*</span></FormLabel>
										<FormControl>
											<Input
												type="number"
												min={0}
												placeholder="Montant"
												{...field}
												value={field.value ?? ""}
												onChange={(e) =>
													field.onChange(
														e.target.value === "" ? undefined : Number(e.target.value)
													)
												}
												disabled={isLoading}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="chargesAmount"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Charges <span className="text-destructive">*</span></FormLabel>
										<FormControl>
											<Input
												type="number"
												min={0}
												placeholder="Montant"
												{...field}
												value={field.value ?? ""}
												onChange={(e) =>
													field.onChange(
														e.target.value === ""
															? undefined
															: Number(e.target.value)
													)
												}
												disabled={isLoading}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Section avances/cautions */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="rentDeposit"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Caution (mois) <span className="text-destructive">*</span></FormLabel>
										<FormControl>
											<Input
												type="number"
												max={3}
												min={1}
												placeholder="Ex : 2"
												{...field}
												value={field.value ?? ""}
												onChange={(e) =>
													field.onChange(
														e.target.value === ""
															? undefined
															: Number(e.target.value)
													)
												}
												disabled={isLoading}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="rentAdvance"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Avance (mois) <span className="text-destructive">*</span></FormLabel>
										<FormControl>
											<Input
												type="number"
												max={3}
												placeholder="Ex : 1"
												{...field}
												value={field.value ?? ""}
												onChange={(e) =>
													field.onChange(
														e.target.value === ""
															? undefined
															: Number(e.target.value)
													)
												}
												disabled={isLoading}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="dayAddToPaymentDay"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Jour d’échéance <span className="text-destructive">*</span></FormLabel>
										<FormControl>
											<Input
												type="number"
												min={0}
												placeholder="Ex : 5"
												{...field}
												value={field.value ?? ""}
												onChange={(e) =>
													field.onChange(
														e.target.value === ""
															? undefined
															: Number(e.target.value)
													)
												}
												disabled={isLoading}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="paymentStartAfter"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Débuter le paiement après (mois) <span className="text-destructive">*</span></FormLabel>
										<FormControl>
											<Input
												type="number"
												placeholder="Ex : 1"
												{...field}
												value={field.value ?? ""}
												onChange={(e) =>
													field.onChange(
														e.target.value === ""
															? undefined
															: Number(e.target.value)
													)
												}
												disabled={isLoading}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Section Dates */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="startDate"
								render={({ field }) => (
									<FormItem className="*:w-full">
										<FormLabel>Date de début <span className="text-destructive">*</span></FormLabel>
										<DatePicker
											field={{
												...field,
												value: field.value ?? null,
												onChange: (value) => field.onChange(value),
											}}
										/>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="endDate"
								render={({ field }) => (
									<FormItem className="*:w-full">
										<FormLabel>Date de fin</FormLabel>
										<DatePicker
											field={{
												...field,
												value: field.value ?? null,
												onChange: (value) => field.onChange(value),
											}}
										/>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Statut & Actions */}
						<div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8 border-t pt-6">
							<FormField
								control={form.control}
								name="status"
								render={({ field }) => {
									const isTerminated = field.value === ContractStatus.TERMINATED;
									return (
										<FormItem className="flex items-center space-x-3">
											<FormControl>
												<Switch
													id="activerContrat"
													checked={field.value === ContractStatus.ACTIVE}
													onCheckedChange={(checked) =>
														field.onChange(checked ? ContractStatus.ACTIVE : ContractStatus.PENDING)
													}
													disabled={isLoading || isTerminated}
													className="mr-2"
												/>
											</FormControl>
											<Label htmlFor="activerContrat" className="text-sm font-medium">
												{isTerminated
													? "Contrat terminé"
													: "Activer le contrat"}
											</Label>
											{isTerminated && (
												<span className="ml-2 text-xs text-destructive font-semibold">
													Statut: terminé
												</span>
											)}
											<FormMessage />
										</FormItem>
									);
								}}
							/>

							<div className="flex items-center gap-2">
								<Button type="submit" disabled={isLoading}>
									{isLoading && <Loader2 size={18} className="mr-2 animate-spin" />}
									{submitButtonText ?? (isEditMode ? "Mettre à jour" : "Créer le contrat")}
								</Button>
								<Button
									type="button"
									variant="secondary"
									onClick={() => form.reset()}
									disabled={isLoading}
								>
									<span className="sr-only">Réinitialiser le formulaire</span>
									<RotateCcw />
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</form>
		</Form>
	);
}
