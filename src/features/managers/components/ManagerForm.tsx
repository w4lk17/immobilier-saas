"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';

import {
	ManagerCreateSchema,
	ManagerFormData,
	ManagerUpdateSchema,
	ManagerUpdateFormData
} from '../schemas/managerSchemas';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Manager, FrontendUserSnippet } from '@/types';
import { EmploymentType, UserRole } from '@/types/enums';

// ComboBox pour sélectionner l'utilisateur
import { ComboboxUsers } from '@/components/shared/ComboboxUsers';
import { ImageDropzone } from '@/components/shared/ImageDropzone';
import { DatePicker } from '@/components/shared/DatePicker';
import { Spinner } from '@/components/ui/spinner';

interface ManagerFormProps {
	initialData?: Manager | null;
	onSubmit: (data: ManagerFormData | ManagerUpdateFormData) => Promise<void>;
	isLoading?: boolean;
	submitButtonText?: string;
	usersForSelection?: FrontendUserSnippet[];
}

const CONTRACT_TYPE_OPTIONS = [
	{ value: EmploymentType.CDI, label: 'CDI' },
	{ value: EmploymentType.CDD, label: 'CDD' },
	{ value: EmploymentType.STAGE, label: 'Stage' },
	{ value: EmploymentType.INTERIM, label: 'Interimaire' },
	{ value: EmploymentType.OTHER, label: 'Autre' },
];

const CIVILITY_OPTIONS = [
	{ value: 'M.', label: 'M.' },
	{ value: 'Mme', label: 'Mme' },
	{ value: 'Mlle', label: 'Mlle' },
];

export function ManagerForm({
	initialData,
	onSubmit,
	isLoading = false,
	submitButtonText = initialData ? "Mettre à jour" : "Créer le gestionnaire",
	usersForSelection = []
}: ManagerFormProps) {

	const isEditMode = !!initialData;


	// Filter users to only show those with role "USER"
	const usersWithUserRole = useMemo(() => {
		return usersForSelection.filter(user => user.role === UserRole.USER);
	}, [usersForSelection]);

	// Utiliser le schéma approprié basé sur le mode
	const form = useForm<ManagerFormData | ManagerUpdateFormData>({
		resolver: zodResolver(isEditMode ? ManagerUpdateSchema : ManagerCreateSchema),
		defaultValues: isEditMode && initialData ? {
			position: initialData.position || '',
			phoneNumber: initialData.phoneNumber || '',
			civility: initialData.civility || '',
			dateOfBirth: initialData.dateOfBirth || '',
			address: initialData.address || '',
			identityDocumentNumber: initialData.identityDocumentNumber || '',
			identityDocumentType: initialData.identityDocumentType || '',
			identityDeliveryCity: initialData.identityDeliveryCity || '',
			identityDeliveryDate: initialData.identityDeliveryDate || '',
			identityExpiryDate: initialData.identityExpiryDate || '',
			pacLastName: initialData.pacLastName || '',
			pacFirstName: initialData.pacFirstName || '',
			pacPhoneNumber: initialData.pacPhoneNumber || '',
			pictureUrl: initialData.pictureUrl || '',
			workPlace: initialData.workPlace || '',
			occupation: initialData.occupation || '',
			EmploymentType: initialData.employmentType || null,
		} : {
			userId: undefined,
			position: '',
			phoneNumber: '',
			civility: '',
			dateOfBirth: '',
			address: '',
			identityDocumentNumber: '',
			identityDocumentType: '',
			identityDeliveryCity: '',
			identityDeliveryDate: '',
			identityExpiryDate: '',
			pacLastName: '',
			pacFirstName: '',
			pacPhoneNumber: '',
			pictureUrl: '',
			workPlace: '',
			occupation: '',
			employmentType: null,
		},
	});

	const handleSubmit = async (data: ManagerFormData | ManagerUpdateFormData) => {
		await onSubmit(data);
	};

	return (
		<Card >
			<CardHeader>
				<CardTitle>{isEditMode ? "Modifier le Profil Gestionnaire" : "Nouveau Profil Gestionnaire"}</CardTitle>
				<CardDescription>
					{isEditMode
						? `Modification du profil de ${initialData?.user?.firstName || ''} ${initialData?.user?.lastName || ''} (ID Gestionnaire: ${initialData?.id})`
						: "Remplissez les informations pour créer un nouveau profil gestionnaire."}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
						{/* Account Section - Only for creation */}
						{!isEditMode && (
							<div className="space-y-4">
								<h2 className="text-lg font-semibold">Compte Utilisateur</h2>
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" >
									<FormField
										control={form.control}
										name="userId"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Utilisateur à associer</FormLabel>
												<FormControl>
													<ComboboxUsers
														users={usersWithUserRole}
														value={field.value}
														onChange={field.onChange}
														placeholder="Sélectionnez un utilisateur..."
														searchPlaceholder="Rechercher par nom ou email..."
														emptyResultText="Aucun utilisateur correspondant."
														disabled={isLoading}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</div>
						)}

						{/* Personal Information Section */}
						<div className="space-y-4">
							<h2 className="text-lg font-semibold">Informations Personnelles</h2>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
								<FormField
									control={form.control}
									name="civility"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Civilité</FormLabel>
											<Select
												onValueChange={field.onChange}
												value={field.value || ''}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Sélectionner" />
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
								<FormField
									control={form.control}
									name="dateOfBirth"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Date de naissance</FormLabel>
											<FormControl>
												<DatePicker
													field={{
														value: field.value || null,
														onChange: (value) => field.onChange(value || '')
													}}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="address"
									render={({ field }) => (
										<FormItem className="lg:col-span-1">
											<FormLabel>Adresse</FormLabel>
											<FormControl>
												<Input placeholder="Ville, Quartier, Maison John Doe" {...field} value={field.value || ''} />
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
											<FormLabel>Téléphone</FormLabel>
											<FormControl>
												<Input type="tel" placeholder="+22812345678" {...field} value={field.value || ''} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>

						{/* Identity Document Section */}
						<div className="space-y-4">
							<h2 className="text-lg font-semibold">Pièce d'Identité</h2>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
								<FormField
									control={form.control}
									name="identityDocumentType"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Type de pièce</FormLabel>
											<FormControl>
												<Input placeholder="CNI, Passeport, etc." {...field} value={field.value || ''} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="identityDocumentNumber"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Numéro de la pièce</FormLabel>
											<FormControl>
												<Input placeholder="" {...field} value={field.value || ''} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="identityDeliveryCity"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Lieu de délivrance</FormLabel>
											<FormControl>
												<Input placeholder="" {...field} value={field.value || ''} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="identityDeliveryDate"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Date de délivrance</FormLabel>
											<FormControl>
												<DatePicker
													field={{
														value: field.value || null,
														onChange: (value) => field.onChange(value || '')
													}}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="identityExpiryDate"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Date d'expiration</FormLabel>
											<FormControl>
												<DatePicker
													field={{
														value: field.value || null,
														onChange: (value) => field.onChange(value || '')
													}}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>

						{/* Emergency Contact Section */}
						<div className="space-y-4">
							<h2 className="text-lg font-semibold">Personne à contacter en cas d'urgence</h2>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
								<FormField
									control={form.control}
									name="pacLastName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Nom</FormLabel>
											<FormControl>
												<Input {...field} value={field.value || ''} />
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
											<FormLabel>Prénoms</FormLabel>
											<FormControl>
												<Input {...field} value={field.value || ''} />
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
											<FormLabel>Téléphone</FormLabel>
											<FormControl>
												<Input type="tel" placeholder="+22812345678" {...field} value={field.value || ''} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>

						{/* Employment Section */}
						<div className="space-y-4">
							<h2 className="text-lg font-semibold">Informations Professionnelles</h2>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
								<FormField
									control={form.control}
									name="position"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Poste / Fonction<span className='text-red-500'> *</span></FormLabel>
											<FormControl>
												<Input placeholder="Ex: Gestionnaire Locatif, Comptable" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="employmentType"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Type de contrat</FormLabel>
											<Select onValueChange={field.onChange} value={field.value || ''}>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Sélectionner un type" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{CONTRACT_TYPE_OPTIONS.map((option) => (
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
									name="workPlace"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Lieu de travail</FormLabel>
											<FormControl>
												<Input placeholder="Nom de l'entreprise" {...field} value={field.value || ''} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="occupation"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Profession</FormLabel>
											<FormControl>
												<Input placeholder="Ex: Comptable, Ingénieur" {...field} value={field.value || ''} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>

						{/* Picture Section */}
						<div className="space-y-4">
							<h2 className="text-lg font-semibold">Photo d'Identité </h2>
							<FormField
								control={form.control}
								name="pictureUrl"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Photo</FormLabel>
										<FormControl>
											<ImageDropzone
												value={field.value}
												onChange={field.onChange}
												disabled={isLoading}
											/>
										</FormControl>
										<FormDescription>
											PNG/JPG/JPEG, max 1 Mo.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Submit Button */}
						<div className="flex justify-end gap-4 pt-4">
							<Button type="submit" disabled={isLoading}>
								{isLoading && <Spinner />}
								{submitButtonText}
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
