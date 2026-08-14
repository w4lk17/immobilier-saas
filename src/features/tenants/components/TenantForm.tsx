"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	ArrowLeft,
	ArrowRight,
	Briefcase,
	Check,
	CheckCircle2,
	FileText,
	Loader2,
	MapPin,
	ShieldCheck,
	User,
} from "lucide-react";

import {
	tenantCreateSchema,
	TenantFormData,
	TenantUpdateFormData,
	tenantUpdateSchema,
} from "../schemas/tenantSchemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { FrontendTenant } from "@/types";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/shared/DatePicker";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatDate, formatDateForForm, formatOptionalDate, } from "@/lib/dateUtils";
import { formatPhone } from "@/lib/utils";

type TenantFormProps =
	| {
		mode: "create";
		initialData?: null;
		onSubmit: (data: TenantFormData) => Promise<void>;
		isLoading?: boolean;
		submitButtonText?: string;
	}
	| {
		mode: "edit";
		initialData: FrontendTenant;
		onSubmit: (data: TenantUpdateFormData) => Promise<void>;
		isLoading?: boolean;
		submitButtonText?: string;
	};

const CIVILITY_OPTIONS = [
	{ value: "M.", label: "M." },
	{ value: "Mme", label: "Mme" },
	{ value: "Mlle", label: "Mlle" },
];

const IDENTITY_DOC = [
	{ value: "CNI", label: "Carte Nationale d'Identité (CNI)" },
	{ value: "passport", label: "PASSPORT" },
	{ value: "AUTRE", label: "Autre" },
];

const STEP_CONFIG = [
	{
		id: 0,
		title: "Identité",
		description: "Informations personnelles et contact principal",
		icon: User,
		fieldsCreate: ["civility", "email", "firstName", "lastName", "phoneNumber"] as const,
		fieldsEdit: ["firstName", "lastName", "phoneNumber"] as const,
	},
	{
		id: 1,
		title: "Adresse",
		description: "Coordonnées et situation professionnelle",
		icon: MapPin,
		fieldsCreate: ["address", "occupation", "workPlace", "oldAddress"] as const,
		fieldsEdit: ["address", "occupation", "workPlace", "oldAddress"] as const,
	},
	{
		id: 2,
		title: "Documents",
		description: "Pièce d'identité et contact d'urgence",
		icon: FileText,
		fieldsCreate: [
			"identityDocumentType",
			"identityDocumentNumber",
			"pacLastName",
			"pacFirstName",
			"pacPhoneNumber",
		] as const,
		fieldsEdit: [
			"identityDocumentType",
			"identityDocumentNumber",
			"pacLastName",
			"pacFirstName",
			"pacPhoneNumber",
		] as const,
	},
	{
		id: 3,
		title: "Confirmation",
		description: "Vérification finale avant enregistrement",
		icon: CheckCircle2,
		fieldsCreate: [] as const,
		fieldsEdit: [] as const,
	},
];

const LAST_STEP_INDEX = STEP_CONFIG.length - 1;

const getDefaultValues = (
	mode: TenantFormProps["mode"],
	initialData?: FrontendTenant | null
) => {
	if (mode === "edit" && initialData) {
		return {
			firstName: initialData.firstName ?? "",
			lastName: initialData.lastName ?? "",
			phoneNumber: initialData.phoneNumber ?? "",
			civility: initialData.civility ?? undefined,
			dateOfBirth: formatDateForForm(initialData.dateOfBirth),
			address: initialData.address ?? "",
			workPlace: initialData.workPlace ?? "",
			occupation: initialData.occupation ?? "",
			pictureUrl: initialData.pictureUrl ?? null,
			identityDocumentNumber: initialData.identityDocumentNumber ?? "",
			identityDocumentType: initialData.identityDocumentType ?? "",
			identityDeliveryCity: initialData.identityDeliveryCity ?? "",
			identityDeliveryDate: formatDateForForm(initialData.identityDeliveryDate),
			identityExpiryDate: formatDateForForm(initialData.identityExpiryDate),
			pacLastName: initialData.pacLastName ?? "",
			pacFirstName: initialData.pacFirstName ?? "",
			pacPhoneNumber: initialData.pacPhoneNumber ?? "",
			oldAddress: initialData.tenantProfile?.oldAddress ?? "",
		};
	}

	return {
		email: "",
		firstName: "",
		lastName: "",
		phoneNumber: "",
		civility: "",
		dateOfBirth: null,
		address: "",
		workPlace: "",
		occupation: "",
		pictureUrl: null,
		identityDocumentNumber: "",
		identityDocumentType: "",
		identityDeliveryCity: "",
		identityDeliveryDate: null,
		identityExpiryDate: null,
		pacLastName: "",
		pacFirstName: "",
		pacPhoneNumber: "",
		oldAddress: "",
	};
};

export function TenantForm({
	mode,
	initialData,
	onSubmit,
	isLoading = false,
	submitButtonText,
}: TenantFormProps) {
	const isEditMode = mode === "edit";
	const [currentStep, setCurrentStep] = React.useState(0);
	const currentStepConfig = STEP_CONFIG[currentStep];

	const form = useForm<TenantFormData | TenantUpdateFormData>({
		resolver: zodResolver(isEditMode ? tenantUpdateSchema : tenantCreateSchema),
		mode: "onChange",
		defaultValues: getDefaultValues(mode, initialData),
	});

	const goToNextStep = async () => {
		const fieldsToValidate = isEditMode
			? currentStepConfig.fieldsEdit
			: currentStepConfig.fieldsCreate;
		const isValid = fieldsToValidate.length === 0
			? true
			: await form.trigger(fieldsToValidate as never, { shouldFocus: true });

		if (isValid) {
			setCurrentStep((prev) => Math.min(prev + 1, LAST_STEP_INDEX));
		}
	};

	const goToPrevStep = () => {
		setCurrentStep((prev) => Math.max(prev - 1, 0));
	};

	const handleFormKeyDown = (
		event: React.KeyboardEvent<HTMLFormElement>
	) => {
		if (event.key !== "Enter") return;

		const target = event.target as HTMLElement | null;
		if (!target) return;

		const tagName = target.tagName.toLowerCase();
		if (tagName === "textarea") return;

		if (currentStep < LAST_STEP_INDEX) {
			event.preventDefault();
			return;
		}

		event.preventDefault();
		void form.handleSubmit(handleSubmit)();
	};

	const handleSubmit = async (data: TenantFormData | TenantUpdateFormData) => {
		if (currentStep !== LAST_STEP_INDEX) {
			return;
		}

		if (mode === "edit") {
			await onSubmit(data as TenantUpdateFormData);
			return;
		}

		await onSubmit(data as TenantFormData);
	};

	const progress = ((currentStep + 1) / STEP_CONFIG.length) * 100;

	return (
		<div className="w-full max-w-5xl space-y-4 sm:space-y-6">
			<Card className="shadow-sm">
				{/* Steps progressbar - nouveau style simple, horizontal et non cliquable */}
				<div className="relative mb-2 w-full">
					<div className="flex items-center justify-between gap-2 px-1">
						{STEP_CONFIG.map((step, index) => {
							const Icon = step.icon;
							const isDone = index < currentStep;
							const isActive = index === currentStep;
							return (
								<div key={step.id} className="flex flex-col items-center flex-1 min-w-0">
									<div
										className={[
											"flex items-center justify-center h-9 w-9 rounded-full border-2 text-sm transition-colors mb-1",
											isDone
												? "border-primary bg-primary text-primary-foreground"
												: isActive
													? "border-primary bg-background text-primary"
													: "border-muted-foreground/20 bg-muted text-muted-foreground"
										].join(" ")}
									>
										{isDone ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
									</div>
									<span className={`block text-xs font-medium truncate text-center ${isActive ? "text-primary" : "text-muted-foreground"}`}>
										{step.title}
									</span>
								</div>
							);
						})}
					</div>
					{/* Barre horizontale de progression */}
					<div className="absolute left-0 top-1/2 w-full h-1 -z-10 bg-muted/50 rounded-full">
						<div
							className="h-full bg-primary rounded-full transition-all duration-300"
							style={{ width: `${progress}%` }}
						/>
					</div>
				</div>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={(event) => event.preventDefault()}
							onKeyDown={handleFormKeyDown}
							className="space-y-8"
						>
							{currentStep === 0 && (
								<div className="space-y-6">
									<div className="rounded-xl border bg-muted/30 p-5">
										<div className="mb-4 flex items-center gap-2 text-sm font-medium">
											<User className="h-4 w-4 text-primary" />
											<span>Identité et contact</span>
										</div>
										<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
											<FormField
												control={form.control}
												name="civility"
												render={({ field }) => (
													<FormItem>
														<FormLabel>
															Civilité <span className="text-destructive">*</span>
														</FormLabel>
														<Select
															onValueChange={field.onChange}
															value={field.value ?? undefined}
														>
															<FormControl className="w-full">
																<SelectTrigger>
																	<SelectValue placeholder="Choisir" />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																{CIVILITY_OPTIONS.map((option) => (
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

											{!isEditMode ? (
												<FormField
													control={form.control}
													name="email"
													render={({ field }) => (
														<FormItem>
															<FormLabel>
																Adresse e-mail <span className="text-destructive">*</span>
															</FormLabel>
															<FormControl>
																<Input
																	type="email"
																	placeholder="email@exemple.com"
																	{...field}
																	value={field.value ?? ""}
																/>
															</FormControl>
															<FormDescription>
																Le locataire recevra son accès par e-mail après création.
															</FormDescription>
															<FormMessage />
														</FormItem>
													)}
												/>
											) : (
												<FormItem className="lg:col-span-1">
													<FormLabel>Adresse e-mail</FormLabel>
													<FormControl>
														<Input
															type="email"
															value={initialData.email ?? ""}
															readOnly
															aria-readonly="true"
															className="bg-muted/60 text-muted-foreground"
														/>
													</FormControl>
													{/* <FormDescription>
														L&apos;e-mail ne peut pas être modifié après création.
													</FormDescription> */}
												</FormItem>
											)}

											<FormField
												control={form.control}
												name="lastName"
												render={({ field }) => (
													<FormItem>
														<FormLabel>
															Nom <span className="text-destructive">*</span>
														</FormLabel>
														<FormControl>
															<Input placeholder="Nom du locataire" {...field} value={field.value ?? ""} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="firstName"
												render={({ field }) => (
													<FormItem>
														<FormLabel>
															Prénom <span className="text-destructive">*</span>
														</FormLabel>
														<FormControl>
															<Input placeholder="Prénom du locataire" {...field} value={field.value ?? ""} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="phoneNumber"
												render={({ field }) => (
													<FormItem>
														<FormLabel>
															Téléphone <span className="text-destructive">*</span>
														</FormLabel>
														<FormControl>
															<Input placeholder="+228 90 00 00 00" {...field} value={field.value ?? ""} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="dateOfBirth"
												render={({ field }) => (
													<FormItem className="*:w-full">
														<FormLabel>Date de naissance</FormLabel>
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
									</div>
								</div>
							)}

							{currentStep === 1 && (
								<div className="space-y-6">
									<div className="rounded-xl border bg-muted/30 p-5">
										<div className="mb-4 flex items-center gap-2 text-sm font-medium">
											<MapPin className="h-4 w-4 text-primary" />
											<span>Adresse</span>
										</div>
										<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
											<FormField
												control={form.control}
												name="address"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Adresse actuelle</FormLabel>
														<FormControl>
															<Input
																placeholder="Quartier, ville, maison"
																{...field}
																value={field.value ?? ""}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="oldAddress"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Ancienne adresse</FormLabel>
														<FormControl>
															<Input placeholder="Ancienne adresse si pertinente" {...field} value={field.value ?? ""} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									</div>

									<div className="rounded-xl border bg-muted/30 p-5">
										<div className="mb-4 flex items-center gap-2 text-sm font-medium">
											<Briefcase className="h-4 w-4 text-primary" />
											<span>Situation professionnelle</span>
										</div>
										<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
											<FormField
												control={form.control}
												name="occupation"
												render={({ field }) => (
													<FormItem>
														<FormLabel>
															Profession <span className="text-destructive">*</span>
														</FormLabel>
														<FormControl>
															<Input placeholder="Ex : Comptable, commerçant..." {...field} value={field.value ?? ""} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="workPlace"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Lieu de travail</FormLabel>
														<FormControl>
															<Input placeholder="Entreprise ou lieu d'activité" {...field} value={field.value ?? ""} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									</div>
								</div>
							)}

							{currentStep === 2 && (
								<div className="space-y-6">
									<div className="rounded-xl border bg-muted/30 p-5">
										<div className="mb-4 flex items-center gap-2 text-sm font-medium">
											<FileText className="h-4 w-4 text-primary" />
											<span>Pièce d'identité</span>
										</div>
										<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
											<FormField
												control={form.control}
												name="identityDocumentType"
												render={({ field }) => (
													<FormItem>
														<FormLabel>
															Type de pièce <span className="text-destructive">*</span>
														</FormLabel>
														<Select
															onValueChange={field.onChange}
															value={field.value ?? undefined}
														>
															<FormControl className="w-full">
																<SelectTrigger>
																	<SelectValue placeholder="Choisir" />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																{IDENTITY_DOC.map((option) => (
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
												name="identityDocumentNumber"
												render={({ field }) => (
													<FormItem>
														<FormLabel>
															Numéro de pièce <span className="text-destructive">*</span>
														</FormLabel>
														<FormControl>
															<Input placeholder="Numéro inscrit sur la pièce" {...field} value={field.value ?? ""} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
										<div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
											<FormField
												control={form.control}
												name="identityDeliveryCity"
												render={({ field }) => (
													<FormItem>
														<FormLabel>
															Lieu de délivrance <span className="text-destructive">*</span>
														</FormLabel>
														<FormControl>
															<Input placeholder="Ville de délivrance" {...field} value={field.value ?? ""} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="identityDeliveryDate"
												render={({ field }) => (
													<FormItem className="*:w-full">
														<FormLabel>Date de délivrance</FormLabel>
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
												name="identityExpiryDate"
												render={({ field }) => (
													<FormItem className="*:w-full">
														<FormLabel>Date d'expiration</FormLabel>
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
									</div>

									<div className="rounded-xl border bg-muted/30 p-5">
										<div className="mb-4 flex items-center gap-2 text-sm font-medium">
											<ShieldCheck className="h-4 w-4 text-primary" />
											<span>Contact d'urgence</span>
										</div>
										<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
											<FormField
												control={form.control}
												name="pacLastName"
												render={({ field }) => (
													<FormItem>
														<FormLabel>
															Nom <span className="text-destructive">*</span>
														</FormLabel>
														<FormControl>
															<Input placeholder="Nom de famille" {...field} value={field.value ?? ""} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="pacFirstName"
												render={({ field }) => (
													<FormItem>
														<FormLabel>
															Prénom <span className="text-destructive">*</span>
														</FormLabel>
														<FormControl>
															<Input placeholder="Prénom" {...field} value={field.value ?? ""} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="pacPhoneNumber"
												render={({ field }) => (
													<FormItem>
														<FormLabel>
															Téléphone <span className="text-destructive">*</span>
														</FormLabel>
														<FormControl>
															<Input placeholder="+228 90 00 00 00" {...field} value={field.value ?? ""} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									</div>
								</div>
							)}

							{currentStep === 3 && (
								<div className="space-y-6">
									<Alert className="border-primary/40 bg-primary/5">
										<CheckCircle2 className="h-4 w-4 text-primary" />
										<AlertDescription>
											Veuillez relire les informations ci-dessous. Le locataire ne sera créé qu&apos;après avoir cliqué sur le bouton final.
										</AlertDescription>
									</Alert>

									<div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
										<Card className="shadow-none gap-3">
											<CardHeader className="pb-3">
												<CardTitle className="text-base">Identité</CardTitle>
											</CardHeader>
											<CardContent className="space-y-2 text-sm">
												<p><span className="text-muted-foreground">Nom complet&nbsp;:</span> {form.getValues("civility") || ""} {form.getValues("firstName") || "-"} {form.getValues("lastName") || ""}</p>
												<p><span className="text-muted-foreground">Téléphone&nbsp;:</span> {formatPhone(form.getValues("phoneNumber") || "") || "-"}</p>
												<p><span className="text-muted-foreground">E-mail&nbsp;:</span> {isEditMode ? initialData.email : form.getValues("email") || "-"}</p>
												<p><span className="text-muted-foreground">Date de naissance&nbsp;:</span> {formatDate(form.getValues("dateOfBirth")) || "-"}</p>
											</CardContent>
										</Card>

										<Card className="shadow-none gap-3">
											<CardHeader className="pb-3">
												<CardTitle className="text-base">Adresse et profession</CardTitle>
											</CardHeader>
											<CardContent className="space-y-2 text-sm">
												<p><span className="text-muted-foreground">Adresse actuelle&nbsp;:</span> {form.getValues("address") || "-"}</p>
												<p><span className="text-muted-foreground">Ancienne adresse&nbsp;:</span> {form.getValues("oldAddress") || "-"}</p>
												<p><span className="text-muted-foreground">Profession&nbsp;:</span> {form.getValues("occupation") || "-"}</p>
												<p><span className="text-muted-foreground">Lieu de travail&nbsp;:</span> {form.getValues("workPlace") || "-"}</p>
											</CardContent>
										</Card>

										<Card className="shadow-none gap-3">
											<CardHeader className="pb-3">
												<CardTitle className="text-base">Documents</CardTitle>
											</CardHeader>
											<CardContent className="space-y-2 text-sm">
												<p><span className="text-muted-foreground">Type de pièce&nbsp;:</span> {form.getValues("identityDocumentType") || "-"}</p>
												<p><span className="text-muted-foreground">Numéro&nbsp;:</span> {form.getValues("identityDocumentNumber") || "-"}</p>
												<p><span className="text-muted-foreground">Lieu de délivrance&nbsp;:</span> {form.getValues("identityDeliveryCity") || "-"}</p>
												<p><span className="text-muted-foreground">Date de délivrance&nbsp;:</span> {formatOptionalDate(form.getValues("identityDeliveryDate")) || "-"}</p>
												<p><span className="text-muted-foreground">Expiration&nbsp;:</span> {formatOptionalDate(form.getValues("identityExpiryDate")) || "-"}</p>
											</CardContent>
										</Card>

										<Card className="shadow-none gap-3">
											<CardHeader className="pb-3">
												<CardTitle className="text-base">Contact d&apos;urgence</CardTitle>
											</CardHeader>
											<CardContent className="space-y-2 text-sm">
												<p><span className="text-muted-foreground">Nom complet&nbsp;:</span> {form.getValues("pacLastName") || "-"} {form.getValues("pacFirstName") || ""}</p>
												<p><span className="text-muted-foreground">Téléphone&nbsp;:</span> {formatPhone(form.getValues("pacPhoneNumber") || "") || "-"}</p>
											</CardContent>
										</Card>
									</div>
								</div>
							)}

							<div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
								{currentStep > 0 ? (
									<Button
										type="button"
										variant="outline"
										onClick={goToPrevStep}
										disabled={isLoading}
									>
										<ArrowLeft className="mr-2 h-4 w-4" />
										Précédent
									</Button>
								) : (
									<div />
								)}

								{currentStep < LAST_STEP_INDEX ? (
									<Button
										type="button"
										onClick={goToNextStep}
										disabled={isLoading}
										className="w-full sm:min-w-[160px] sm:w-auto"
									>
										Suivant
										<ArrowRight className="ml-2 h-4 w-4" />
									</Button>
								) : (
									<Button
										type="button"
										onClick={() => void form.handleSubmit(handleSubmit)()}
										disabled={isLoading}
										className="w-full sm:min-w-[200px] sm:w-auto"
									>
										{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
										{submitButtonText ?? (isEditMode ? "Mettre à jour" : "Créer le locataire")}
									</Button>
								)}

							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
