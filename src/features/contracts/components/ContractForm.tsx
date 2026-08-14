"use client";

import React, { useEffect, useMemo, useRef } from "react";
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
import { Contract, PropertyWithRelations, Rental } from "@/types";
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

function toNumberValue(value: string | number | undefined): number | undefined {
	if (typeof value === "number") return value;
	if (!value) return undefined;
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : undefined;
}

function getPropertyLabel(property: PropertyWithRelations) {
	const name = property.name ? `${property.name} - ` : "";
	return `${name}${property.city}, ${property.neighborhood}`;
}

function getRentalLabel(rental: Rental) {
	return `${rental.name} - ${rental.rentalValue} / charges ${rental.charges}`;
}

function getContractDefaultValues(
	mode: ContractFormProps["mode"],
	initialData?: Contract | null
): Partial<ContractFormData> {
	if (mode === "edit" && initialData) {
		return {
			ownerId: initialData.ownerId ?? undefined,
			propertyId: initialData.propertyId ?? undefined,
			rentalId: initialData.rentalId ?? undefined,
			tenantId: initialData.tenant?.user?.id ?? undefined,
			managerId: initialData.managerId ?? null,
			rentDeposit: initialData.rentDeposit ?? undefined,
			rentAdvance: initialData.rentAdvance ?? undefined,
			chargesAmount: initialData.chargesAmount ?? undefined,
			rentAmount: initialData.rentAmount ?? undefined,
			startDate: initialData.startDate ? formatDateForForm(initialData.startDate) ?? "" : "",
			endDate: initialData.endDate ? formatDateForForm(initialData.endDate) ?? null : null,
			dayAddToPaymentDay: initialData.dayAddToPaymentDay ?? 5,
			paymentStartAfter: initialData.rentAdvance ?? 1,
			leaseType: initialData.leaseType ?? undefined,
			status: initialData.status ?? ContractStatus.PENDING,
			pdfUrl: initialData.pdfUrl ?? undefined,
			depositAmount: initialData.depositAmount ?? null,
			advanceAmount: initialData.advanceAmount ?? null,
		};
	}
	return {
		ownerId: undefined,
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
		dayAddToPaymentDay: undefined,
		paymentStartAfter: 3,
		leaseType: LeaseType.RESIDENTIAL_LEASE,
		status: ContractStatus.PENDING,
		pdfUrl: undefined,
		depositAmount: null,
		advanceAmount: null,
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
	const { data: propertiesList = [], isLoading: isPropertiesLoading } = usePropertiesWithRelations();
	const hasAppliedUrlTenant = useRef(false);

	const form = useForm<ContractFormValues>({
		resolver: zodResolver(isEditMode ? contractUpdateSchema : contractCreateSchema),
		mode: "onChange",
		defaultValues: getContractDefaultValues(mode, initialData),
	});

	const selectedPropertyId = form.watch("propertyId");
	const selectedRentalId = form.watch("rentalId");

	const selectedProperty = useMemo(
		() => propertiesList.find((property) => property.id === selectedPropertyId),
		[propertiesList, selectedPropertyId]
	);

	const propertyRentals = useMemo(
		() => selectedProperty?.rentals ?? [],
		[selectedProperty]
	);

	const rentalOptions = useMemo(
		() =>
			propertyRentals.filter(
				(rental) =>
					rental.status === RentalStatus.AVAILABLE ||
					(isEditMode && rental.id === initialData?.rentalId)
			),
		[propertyRentals, isEditMode, initialData]
	);

	const selectedRental = useMemo(
		() => propertyRentals.find((rental) => rental.id === selectedRentalId),
		[propertyRentals, selectedRentalId]
	);

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

	useEffect(() => {
		if (!selectedPropertyId && !selectedProperty) {
			form.setValue("ownerId", undefined, { shouldValidate: true, shouldDirty: true });
			form.setValue("managerId", null, { shouldValidate: true, shouldDirty: true });
			return;
		}

		if (selectedPropertyId && !selectedProperty && propertiesList.length === 0) return;

		if (!selectedProperty) {
			form.setValue("ownerId", undefined, { shouldValidate: true, shouldDirty: true });
			form.setValue("managerId", null, { shouldValidate: true, shouldDirty: true });
			form.setValue("rentalId", undefined, { shouldValidate: true, shouldDirty: true });
			form.setValue("rentAmount", undefined, { shouldValidate: true, shouldDirty: true });
			form.setValue("chargesAmount", undefined, { shouldValidate: true, shouldDirty: true });
			return;
		}

		form.setValue("ownerId", selectedProperty.ownerId, {
			shouldValidate: true,
			shouldDirty: false,
		});
		form.setValue("managerId", selectedProperty.managerId ?? null, {
			shouldValidate: true,
			shouldDirty: false,
		});

		if (
			selectedRentalId &&
			!selectedProperty.rentals?.some((rental) => rental.id === selectedRentalId)
		) {
			form.setValue("rentalId", undefined, { shouldValidate: true, shouldDirty: true });
			form.setValue("rentAmount", undefined, { shouldValidate: true, shouldDirty: true });
			form.setValue("chargesAmount", undefined, { shouldValidate: true, shouldDirty: true });
		}
	}, [form, propertiesList.length, selectedProperty, selectedPropertyId, selectedRentalId]);

	useEffect(() => {
		if (!selectedRentalId) return;
		if (propertyRentals.length === 0 && isPropertiesLoading) return;

		const isSelectableRental = rentalOptions.some((rental) => rental.id === selectedRentalId);
		if (!selectedRental || !isSelectableRental) {
			form.setValue("rentalId", undefined, { shouldValidate: true, shouldDirty: true });
			form.setValue("rentAmount", undefined, { shouldValidate: true, shouldDirty: true });
			form.setValue("chargesAmount", undefined, { shouldValidate: true, shouldDirty: true });
		}
	}, [form, isPropertiesLoading, propertyRentals.length, rentalOptions, selectedRental, selectedRentalId]);

	useEffect(() => {
		const rentAdvance = form.watch("rentAdvance");
		if (rentAdvance !== undefined) {
			form.setValue("paymentStartAfter", rentAdvance);
		}
	}, [form.watch("rentAdvance")]);

	const handleSubmit = async (data: ContractFormValues) => {
		if (props.mode === "create") {
			const createData = { ...(data as ContractFormData) };
			console.log('test submit data', createData);
			if (!createData.tenantId) {
				form.setError("tenantId", {
					type: "manual",
					message: "Locataire invalide. Veuillez selectionner un locataire valide.",
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
						<div className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="tenantId"
									rules={{
										validate: (value) =>
											isEditMode ||
												typeof value === "number" && value > 0
												? true
												: "Veuillez selectionner un locataire.",
									}}
									render={({ field }) => (
										<FormItem className="md:col-span-2">
											<FormLabel>Locataire</FormLabel>
											<FormControl>
												<ComboboxTenants
													tenants={tenantsList ?? []}
													value={field.value ?? undefined}
													onChange={(tenantUserId) => field.onChange(tenantUserId)}
													placeholder="Selectionner un locataire..."
													searchPlaceholder="Rechercher un locataire..."
													emptyResultText="Aucun locataire trouve."
													disabled={isLoading || isEditMode}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="propertyId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Propriete <span className="text-destructive">*</span></FormLabel>
										<FormControl>
											<Combobox
												items={propertiesList}
												value={field.value ?? undefined}
												onChange={(value) => field.onChange(toNumberValue(value))}
												valueAccessor={(property) => property.id}
												displayAccessor={getPropertyLabel}
												placeholder="Selectionner une propriete..."
												searchPlaceholder="Rechercher une propriete..."
												emptyResultText="Aucune propriete trouvee."
												disabled={isLoading || isPropertiesLoading}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="rentalId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Local <span className="text-destructive">*</span></FormLabel>
										<FormControl>
											<Combobox
												items={rentalOptions}
												value={field.value ?? undefined}
												onChange={(value) => {
													const rentalId = toNumberValue(value);
													field.onChange(rentalId);
													const rental = rentalOptions.find((item) => item.id === rentalId);

													form.setValue("rentAmount", rental?.rentalValue, {
														shouldValidate: true,
														shouldDirty: true,
													});
													form.setValue("chargesAmount", rental?.charges, {
														shouldValidate: true,
														shouldDirty: true,
													});
												}}
												valueAccessor={(rental) => rental.id}
												displayAccessor={getRentalLabel}
												placeholder={selectedPropertyId ? "Selectionner un local..." : "Selectionner la propriete avant le local"}
												searchPlaceholder="Rechercher un local..."
												emptyResultText={selectedPropertyId ? "Aucun local disponible pour cette propriete." : "Selectionner la propriete avant le local."}
												disabled={isLoading || isPropertiesLoading || !selectedPropertyId}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

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
											disabled={isLoading}
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
									<FormItem className="md:col-span-2" >
										<FormLabel>Charges <span className="text-destructive">*</span></FormLabel>
										<FormControl >
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
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{/* <FormField
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
														e.target.value === "" ? undefined : Number(e.target.value)
													)
												}
												disabled={isLoading}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/> */}
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
												min={1}
												placeholder="Ex : 1"
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
								name="dayAddToPaymentDay"
								render={({ field }) => (
									<FormItem>
										<FormLabel> Jour d'échéance<span className="text-destructive">*</span></FormLabel>
										<FormControl>
											<Input
												type="number"
												min={0}
												placeholder="Ex : 5"
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
							{/* <FormField
								control={form.control}
								name="paymentStartAfter"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Debuter le paiement apres (mois) <span className="text-destructive">*</span></FormLabel>
										<FormControl>
											<Input
												type="number"
												placeholder="Ex : 1"
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
							/> */}
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="startDate"
								render={({ field }) => (
									<FormItem className="*:w-full">
										<FormLabel>Date de debut <span className="text-destructive">*</span></FormLabel>
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
												{isTerminated ? "Contrat termine" : "Activer le contrat"}
											</Label>
											{isTerminated && (
												<span className="ml-2 text-xs text-destructive font-semibold">
													Statut: termine
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
									{submitButtonText ?? (isEditMode ? "Mettre a jour" : "Creer le contrat")}
								</Button>
								<Button
									type="button"
									variant="secondary"
									onClick={() => form.reset()}
									disabled={isLoading}
								>
									<span className="sr-only">Reinitialiser le formulaire</span>
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
