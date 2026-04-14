"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Loader2, Check, ChevronLeft, ChevronRight, User, Briefcase, FileText, CheckCircle2, Mail, Phone, MapPin, Calendar, Building2, Contact, Info } from 'lucide-react';

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Schemas & Types
import {
	CreateManagerSchema,
	UpdateManagerSchema,
	CreateManagerFormData,
	UpdateManagerFormData,
} from '../schemas/managerSchemas';
import { ManagerWithUser, EmploymentType } from '@/types';
import { DatePicker } from '@/components/shared/DatePicker';
import { formatDate } from '@/lib/dateUtils';

// --- Configuration des Étapes ---
const STEPS = [
	{ id: 1, name: 'Identité', icon: User, description: 'Informations personnelles' },
	{ id: 2, name: 'Professionnel', icon: Briefcase, description: 'Poste et coordonnées' },
	{ id: 3, name: 'Documents', icon: FileText, description: 'Identité et urgence' },
	{ id: 4, name: 'Confirmation', icon: CheckCircle2, description: 'Vérification' },
];

const CIVILITY_OPTIONS = [
	{ value: 'M.', label: 'M.' },
	{ value: 'Mme', label: 'Mme' },
	{ value: 'Mlle', label: 'Mlle' }
];

const CONTRACT_TYPE_OPTIONS = [
	{ value: EmploymentType.CDI, label: 'CDI' },
	{ value: EmploymentType.CDD, label: 'CDD' },
	{ value: EmploymentType.OTHER, label: 'Freelance' },
	{ value: EmploymentType.INTERIM, label: 'Stage' },
];

const ID_DOC_TYPES = [
	{ value: 'CIN', label: 'Carte d\'Identité Nationale' },
	{ value: 'PASSPORT', label: 'Passeport' },
	{ value: 'RESIDENCE_PERMIT', label: 'Carte de Séjour' },
];

interface ManagerFormProps {
	initialData?: ManagerWithUser | null;
	onSubmit: (data: CreateManagerFormData | UpdateManagerFormData) => Promise<void>;
	isLoading?: boolean;
	submitButtonText?: string;
}


// Fonction helper pour gérer les dates (convertit Date ou String en string pour le form)
const formatDateForForm = (date: Date | string | null | undefined) => {
	if (!date) return null;
	if (typeof date === 'string') return date;
	return date.toISOString(); // Si c'est un objet Date, on le convertit
};

export function ManagerForm({
	initialData,
	onSubmit,
	isLoading = false,
	submitButtonText = initialData ? "Enregistrer" : "Créer Gestionnaire",
}: ManagerFormProps) {
	const [currentStep, setCurrentStep] = useState(0);
	const isEditMode = !!initialData;

	const form = useForm<CreateManagerFormData | UpdateManagerFormData>({
		resolver: zodResolver(isEditMode ? UpdateManagerSchema : CreateManagerSchema),
		mode: 'onChange',
		// Values par défaut peuplées depuis initialData (mode édition)
		defaultValues: isEditMode && initialData ? {
			// Champs User
			firstName: initialData.user.firstName ?? '',
			lastName: initialData.user.lastName ?? '',
			phoneNumber: initialData.user.phoneNumber ?? '',
			address: initialData.user.address ?? '',
			civility: initialData.user.civility ?? undefined,
			dateOfBirth: formatDateForForm(initialData.user.dateOfBirth), 
			workPlace: initialData.user.workPlace ?? '',
			occupation: initialData.user.occupation ?? '',
			pictureUrl: initialData.user.pictureUrl ?? '',
			identityDocumentNumber: initialData.user.identityDocumentNumber ?? '',
			identityDocumentType: initialData.user.identityDocumentType ?? '',
			identityDeliveryCity: initialData.user.identityDeliveryCity ?? '',
			identityDeliveryDate: formatDateForForm(initialData.user.identityDeliveryDate), 
			identityExpiryDate: formatDateForForm(initialData.user.identityExpiryDate),
			pacLastName: initialData.user.pacLastName ?? '',
			pacFirstName: initialData.user.pacFirstName ?? '',
			pacPhoneNumber: initialData.user.pacPhoneNumber ?? '',
			// Champs Manager
			position: initialData.position ?? '',
			employmentType: initialData.employmentType ?? undefined,
			hireDate:formatDateForForm(initialData.hireDate)  ,
			terminationDate:formatDateForForm(initialData.hireDate)  ,
		} : {
			// Valeurs vides pour création
			email: '',
			password: '',
			firstName: '',
			lastName: '',
			civility: '',
			dateOfBirth: null,
			workPlace: '',
			occupation: '',
			pictureUrl: '',
			identityDocumentNumber: '',
			identityDocumentType: '',
			identityDeliveryCity: '',
			identityDeliveryDate: null,
			identityExpiryDate: null,
			pacLastName: '',
			pacFirstName: '',
			pacPhoneNumber: '',
			position: '',
			employmentType: undefined,
			hireDate: null,
			terminationDate: null,
		},
	});

	// Fonction pour passer à l'étape suivante
	const handleNext = async () => {
		// Valider seulement les champs de l'étape actuelle
		let fieldsToValidate: string[] = [];

		if (currentStep === 0) {
			fieldsToValidate = isEditMode
				? ['firstName', 'lastName', 'civility']
				: ['email', 'password', 'firstName', 'lastName', 'civility'];
		} else if (currentStep === 1) {
			fieldsToValidate = ['position', 'employmentType', 'phoneNumber', 'address'];
		} else if (currentStep === 2) {
			fieldsToValidate = ['identityDocumentNumber', 'pacLastName'];
		}

		const isValid = await form.trigger(fieldsToValidate as any);
		if (isValid) {
			setCurrentStep((prev) => prev + 1);
		}
	};

	const handlePrev = () => setCurrentStep((prev) => prev - 1);

	const handleSubmitForm = async (data: any) => {
		await onSubmit(data);
	};

	// Calcul de la progression
	const progressValue = ((currentStep + 1) / STEPS.length) * 100;

	return (
		<div className="max-w-4xl mx-auto space-y-6">
			{/* Progress Header */}
			<Card className="border-none shadow-lg">
				<CardHeader className="space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="text-2xl">
								{isEditMode ? "Modifier Gestionnaire" : "Nouveau Gestionnaire"}
							</CardTitle>
							<CardDescription className="text-base mt-1">
								{STEPS[currentStep].description}
							</CardDescription>
						</div>
						<Badge variant="outline" className="text-sm px-3 py-1">
							Étape {currentStep + 1} / {STEPS.length}
						</Badge>
					</div>

					{/* Step Indicators */}
					<div className="space-y-3">
						<div className="flex justify-between gap-2">
							{STEPS.map((step, index) => (
								<div key={step.id} className="flex flex-col items-center flex-1 relative">
									{/* Ligne de connexion */}
									{index < STEPS.length - 1 && (
										<div className={`absolute top-5 left-1/2 w-full h-0.5 -z-10 transition-colors duration-300 ${index < currentStep ? 'bg-primary' : 'bg-muted'}`} />
									)}

									{/* Step Circle */}
									<div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${index === currentStep ? 'bg-primary border-primary text-primary-foreground scale-110 shadow-lg' : index < currentStep ? 'bg-primary border-primary text-primary-foreground' : 'bg-background border-border text-muted-foreground'}`}>
										{index < currentStep ? <Check className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
									</div>

									{/* Step Name */}
									<span className={`text-xs mt-2 font-medium hidden sm:block ${index <= currentStep ? 'text-foreground' : 'text-muted-foreground'}`}>
										{step.name}
									</span>
								</div>
							))}
						</div>
						<Progress value={progressValue} className="h-2" />
					</div>
				</CardHeader>
			</Card>

			{/* Form Content */}
			<Card className="shadow-lg">
				<CardContent className="pt-6">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-8">

							{/* --- ÉTAPE 1: IDENTITÉ & COMPTE --- */}
							{currentStep === 0 && (
								<div className="space-y-6 animate-in fade-in-0 slide-in-from-right-4 duration-300">
									{!isEditMode && (
										<div className="space-y-4 p-4 rounded-lg bg-muted/50 border">
											<div className="flex items-center gap-2 text-sm font-medium text-foreground">
												<Mail className="h-4 w-4 text-primary" />
												<span>Compte Utilisateur</span>
											</div>
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<FormField control={form.control} name="email" render={({ field }) => (
													<FormItem>
														<FormLabel>Email <span className="text-destructive">*</span></FormLabel>
														<FormControl><Input type="email" placeholder="email@exemple.com" {...field} /></FormControl>
														<FormMessage />
													</FormItem>
												)} />
												<FormField control={form.control} name="password" render={({ field }) => (
													<FormItem>
														<FormLabel>Mot de passe <span className="text-destructive">*</span></FormLabel>
														<FormControl><Input type="password" placeholder="Min 8 caractères" {...field} /></FormControl>
														<FormMessage />
													</FormItem>
												)} />
											</div>
										</div>
									)}

									<div className="space-y-4 p-4 rounded-lg bg-muted/50 border">
										<div className="flex items-center gap-2 text-sm font-medium text-foreground">
											<User className="h-4 w-4 text-primary" />
											<span>Informations Personnelles</span>
										</div>
										<div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
											<FormField control={form.control} name="civility" render={({ field }) => (
												<FormItem>
													<FormLabel>Civilité</FormLabel>
													<Select onValueChange={field.onChange}
														value={field.value ?? undefined} >
														<FormControl><SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger></FormControl>
														<SelectContent>
															{CIVILITY_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)} />
											<FormField control={form.control} name="lastName" render={({ field }) => (
												<FormItem>
													<FormLabel>Nom <span className="text-destructive">*</span></FormLabel>
													<FormControl><Input placeholder="Nom de famille" {...field} /></FormControl>
													<FormMessage />
												</FormItem>
											)} />
											<FormField control={form.control} name="firstName" render={({ field }) => (
												<FormItem>
													<FormLabel>Prénom <span className="text-destructive">*</span></FormLabel>
													<FormControl><Input placeholder="Prénom" {...field} /></FormControl>
													<FormMessage />
												</FormItem>
											)} />
										</div>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<FormField control={form.control} name="dateOfBirth" render={({ field }) => (
												<FormItem>
													<FormLabel>Date de naissance</FormLabel>
													<DatePicker
														field={{
															...field,
															value: field.value ?? null,
															onChange: (val) => field.onChange(val) 
														}}
													/>
													<FormMessage />
												</FormItem>
											)} />
											<FormField control={form.control} name="phoneNumber" render={({ field }) => (
												<FormItem>
													<FormLabel>Téléphone</FormLabel>
													<FormControl><Input placeholder="+228 90 00 00 00" {...field} value={field.value ?? ''} /></FormControl>
													<FormMessage />
												</FormItem>
											)} />
										</div>
									</div>
								</div>
							)}

							{/* --- ÉTAPE 2: PROFESSIONNEL --- */}
							{currentStep === 1 && (
								<div className="space-y-6 animate-in fade-in-0 slide-in-from-right-4 duration-300">
									<div className="space-y-4 p-4 rounded-lg bg-muted/50 border">
										<div className="flex items-center gap-2 text-sm font-medium text-foreground">
											<Briefcase className="h-4 w-4 text-primary" />
											<span>Poste et Contrat</span>
										</div>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
											<FormField control={form.control} name="position" render={({ field }) => (
												<FormItem>
													<FormLabel>Poste <span className="text-destructive">*</span></FormLabel>
													<FormControl><Input placeholder="Ex: Gestionnaire Immobilier" {...field} /></FormControl>
													<FormMessage />
												</FormItem>
											)} />
											<FormField control={form.control} name="employmentType" render={({ field }) => (
												<FormItem>
													<FormLabel>Type de contrat</FormLabel>
													<Select onValueChange={field.onChange} value={field.value}>
														<FormControl><SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger></FormControl>
														<SelectContent>
															{CONTRACT_TYPE_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)} />
										</div>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<FormField control={form.control} name="hireDate" render={({ field }) => (
												<FormItem>
													<FormLabel>Date d'embauche</FormLabel>
													<DatePicker
														field={{
															...field,
															value: field.value ?? null,
															onChange: (val) => field.onChange(val)
														}}
													/>
													<FormMessage />
												</FormItem>
											)} />
											<FormField control={form.control} name="workPlace" render={({ field }) => (
												<FormItem>
													<FormLabel>Lieu de travail</FormLabel>
													<FormControl><Input placeholder="Ex: Siège Social" {...field} value={field.value ?? ''} /></FormControl>
													<FormMessage />
												</FormItem>
											)} />
										</div>
									</div>

									<div className="space-y-4 p-4 rounded-lg bg-muted/50 border">
										<div className="flex items-center gap-2 text-sm font-medium text-foreground">
											<MapPin className="h-4 w-4 text-primary" />
											<span>Coordonnées</span>
										</div>
										<div className="grid grid-cols-1 gap-4 pt-2">
											<FormField control={form.control} name="address" render={({ field }) => (
												<FormItem>
													<FormLabel>Adresse complète</FormLabel>
													<FormControl><Input placeholder="Adresse, Ville, Pays" {...field} value={field.value ?? ''} /></FormControl>
													<FormMessage />
												</FormItem>
											)} />
											<FormField control={form.control} name="phoneNumber" render={({ field }) => (
												<FormItem>
													<FormLabel>Téléphone professionnel <span className="text-destructive">*</span></FormLabel>
													<FormControl><Input placeholder="+228 90 00 00 00" {...field} value={field.value ?? ''} /></FormControl>
													<FormMessage />
												</FormItem>
											)} />
										</div>
									</div>
								</div>
							)}

							{/* --- ÉTAPE 3: DOCUMENTS & URGENCE --- */}
							{currentStep === 2 && (
								<div className="space-y-6 animate-in fade-in-0 slide-in-from-right-4 duration-300">
									<div className="space-y-4 p-4 rounded-lg bg-muted/50 border">
										<div className="flex items-center gap-2 text-sm font-medium text-foreground">
											<FileText className="h-4 w-4 text-primary" />
											<span>Pièce d'Identité</span>
										</div>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
											<FormField
												control={form.control}
												name="identityDocumentType"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Type de document</FormLabel>
														<Select onValueChange={field.onChange}
															value={field.value ?? undefined} >
															<FormControl><SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger></FormControl>
															<SelectContent>
																{ID_DOC_TYPES.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
															</SelectContent>
														</Select>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField control={form.control} name="identityDocumentNumber" render={({ field }) => (
												<FormItem>
													<FormLabel>Numéro de document <span className="text-destructive">*</span></FormLabel>
													<FormControl><Input placeholder="Numéro sur le document" {...field} value={field.value ?? ''} /></FormControl>
													<FormMessage />
												</FormItem>
											)} />
										</div>
										<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
											<FormField control={form.control} name="identityDeliveryCity" render={({ field }) => (
												<FormItem>
													<FormLabel>Lieu de délivrance</FormLabel>
													<FormControl><Input placeholder="Ville" {...field} value={field.value ?? ''} /></FormControl>
													<FormMessage />
												</FormItem>
											)} />
											<FormField control={form.control} name="identityDeliveryDate" render={({ field }) => (
												<FormItem>
													<FormLabel>Date de délivrance</FormLabel>
												<DatePicker
														field={{
															...field,
															value: field.value ?? null,
															onChange: (val) => field.onChange(val)
														}}
													/>
													<FormMessage />
												</FormItem>
											)} />
											<FormField control={form.control} name="identityExpiryDate" render={({ field }) => (
												<FormItem>
													<FormLabel>Date d'expiration</FormLabel>
												<DatePicker
														field={{
															...field,
															value: field.value ?? null,
															onChange: (val) => field.onChange(val)
														}}
													/>
													<FormMessage />
												</FormItem>
											)} />
										</div>
									</div>

									<div className="space-y-4 p-4 rounded-lg bg-muted/50 border">
										<div className="flex items-center gap-2 text-sm font-medium text-foreground">
											<Contact className="h-4 w-4 text-primary" />
											<span>Personne à Contacter (Urgence)</span>
										</div>
										<div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
											<FormField control={form.control} name="pacLastName" render={({ field }) => (
												<FormItem>
													<FormLabel>Nom <span className="text-destructive">*</span></FormLabel>
													<FormControl><Input placeholder="Nom de famille"{...field} value={field.value ?? ''}/></FormControl>
													<FormMessage />
												</FormItem>
											)} />
											<FormField control={form.control} name="pacFirstName" render={({ field }) => (
												<FormItem>
													<FormLabel>Prénom</FormLabel>
													<FormControl><Input placeholder="Prénom"{...field} value={field.value ?? ''}/></FormControl>
													<FormMessage />
												</FormItem>
											)} />
											<FormField control={form.control} name="pacPhoneNumber" render={({ field }) => (
												<FormItem>
													<FormLabel>Téléphone</FormLabel>
													<FormControl><Input placeholder="+228 90 00 00 00"{...field} value={field.value ?? ''}/></FormControl>
													<FormMessage />
												</FormItem>
											)} />
										</div>
									</div>
								</div>
							)}

							{/* --- ÉTAPE 4: RÉCAPITULATIF --- */}
							{currentStep === 3 && (
								<div className="space-y-6 animate-in fade-in-0 slide-in-from-right-4 duration-300">
									<Alert className="border-primary/50 bg-primary/5">
										<Info className="h-4 w-4 text-primary" />
										<AlertDescription className="text-sm">
											Vérifiez que toutes les informations sont correctes avant de valider la création du compte gestionnaire.
										</AlertDescription>
									</Alert>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										{/* Identité */}
										<div className="space-y-3 p-4 rounded-lg border bg-card">
											<div className="flex items-center gap-2 font-semibold text-sm">
												<User className="h-4 w-4 text-primary" />
												<span>Identité</span>
											</div>
											<div className="space-y-2 text-sm">
												<div className="flex justify-between">
													<span className="text-muted-foreground">Nom complet:</span>
													<span className="font-medium">{form.getValues('civility')} {form.getValues('firstName')} {form.getValues('lastName')}</span>
												</div>
												{form.getValues('dateOfBirth') && (
													<div className="flex justify-between">
														<span className="text-muted-foreground">Date de naissance:</span>
														<span className="font-medium">{formatDate(form.getValues('dateOfBirth')) || '-'}</span>
													</div>
												)}
												{form.getValues('phoneNumber') && (
													<div className="flex justify-between">
														<span className="text-muted-foreground">Téléphone:</span>
														<span className="font-medium">{form.getValues('phoneNumber')}</span>
													</div>
												)}
												{!isEditMode && (
													<div className="flex justify-between">
														<span className="text-muted-foreground">Email:</span>
														<span className="font-medium">{form.getValues('email')}</span>
													</div>
												)}
												{isEditMode && initialData && (
													<div className="flex justify-between">
														<span className="text-muted-foreground">Email:</span>
														<span className="font-medium">{initialData.user.email}</span>
													</div>
												)}
											</div>
										</div>

										{/* Professionnel */}
										<div className="space-y-3 p-4 rounded-lg border bg-card">
											<div className="flex items-center gap-2 font-semibold text-sm">
												<Briefcase className="h-4 w-4 text-primary" />
												<span>Professionnel</span>
											</div>
											<div className="space-y-2 text-sm">
												<div className="flex justify-between">
													<span className="text-muted-foreground">Poste:</span>
													<span className="font-medium">{form.getValues('position') || '-'}</span>
												</div>
												{form.getValues('employmentType') && (
													<div className="flex justify-between">
														<span className="text-muted-foreground">Type de contrat:</span>
														<span className="font-medium">{CONTRACT_TYPE_OPTIONS.find(o => o.value === form.getValues('employmentType'))?.label || '-'}</span>
													</div>
												)}
												{form.getValues('hireDate') && (
													<div className="flex justify-between">
														<span className="text-muted-foreground">Date d'embauche:</span>
														<span className="font-medium">{formatDate(form.getValues('hireDate')) || '-'}</span>
													</div>
												)}
												{form.getValues('address') && (
													<div className="flex justify-between">
														<span className="text-muted-foreground">Adresse:</span>
														<span className="font-medium text-right">{form.getValues('address')}</span>
													</div>
												)}
											</div>
										</div>

										{/* Documents */}
										<div className="space-y-3 p-4 rounded-lg border bg-card">
											<div className="flex items-center gap-2 font-semibold text-sm">
												<FileText className="h-4 w-4 text-primary" />
												<span>Documents</span>
											</div>
											<div className="space-y-2 text-sm">
												{form.getValues('identityDocumentType') && (
													<div className="flex justify-between">
														<span className="text-muted-foreground">Type:</span>
														<span className="font-medium">{form.getValues('identityDocumentType')}</span>
													</div>
												)}
												<div className="flex justify-between">
													<span className="text-muted-foreground">Numéro:</span>
													<span className="font-medium">{form.getValues('identityDocumentNumber') || '-'}</span>
												</div>
											</div>
										</div>

										{/* Contact Urgence */}
										<div className="space-y-3 p-4 rounded-lg border bg-card">
											<div className="flex items-center gap-2 font-semibold text-sm">
												<Contact className="h-4 w-4 text-primary" />
												<span>Contact Urgence</span>
											</div>
											<div className="space-y-2 text-sm">
												<div className="flex justify-between">
													<span className="text-muted-foreground">Nom:</span>
													<span className="font-medium">{form.getValues('pacLastName') || '-'} {form.getValues('pacFirstName') || ''}</span>
												</div>
												{form.getValues('pacPhoneNumber') && (
													<div className="flex justify-between">
														<span className="text-muted-foreground">Téléphone:</span>
														<span className="font-medium">{form.getValues('pacPhoneNumber')}</span>
													</div>
												)}
											</div>
										</div>
									</div>
								</div>
							)}

							{/* Navigation Buttons */}
							<div className="flex justify-between items-center pt-6 mt-6 border-t">
								{currentStep > 0 ? (
									<Button type="button" variant="outline" onClick={handlePrev} disabled={isLoading} size="lg">
										<ChevronLeft className="mr-2 h-4 w-4" />
										Précédent
									</Button>
								) : (
									<div />
								)}

								{currentStep < STEPS.length - 1 ? (
									<Button type="button" onClick={handleNext} disabled={isLoading} size="lg" className="min-w-[140px]">
										Suivant
										<ChevronRight className="ml-2 h-4 w-4" />
									</Button>
								) : (
									<Button type="submit" disabled={isLoading} size="lg" className="min-w-[140px] shadow-lg">
										{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
										{submitButtonText}
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
