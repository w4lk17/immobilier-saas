"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import React from 'react';

import {
	employeeCreateSchema,
	EmployeeFormData,
	employeeUpdateSchema,
	EmployeeUpdateFormData
} from '../schemas/employeeSchemas';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FrontendEmployee, FrontendUserSnippet } from '@/types'; // Importer FrontendEmployee pour initialData

// ComboBox pour sélectionner l'utilisateur
import { ComboboxUsers } from '@/components/shared/ComboboxUsers';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface EmployeeFormProps {
	initialData?: FrontendEmployee | null; // Pour pré-remplir en mode édition
	onSubmit: (data: EmployeeFormData | EmployeeUpdateFormData) => Promise<void>;
	isLoading?: boolean;
	submitButtonText?: string;
	usersForSelection?: FrontendUserSnippet[]; // Pour le ComboBox
}

export function EmployeeForm({
	initialData,
	onSubmit,
	isLoading = false,
	submitButtonText = initialData ? "Mettre à jour" : "Créer l'employé",
	usersForSelection = [] // Pour le ComboBox
}: EmployeeFormProps) {

	const isEditMode = !!initialData;

	// Utiliser le schéma approprié basé sur le mode
	const form = useForm<EmployeeFormData | EmployeeUpdateFormData>({
		resolver: zodResolver(isEditMode ? employeeUpdateSchema : employeeCreateSchema),
		defaultValues: isEditMode && initialData ? {
			// Pour la mise à jour, userId n'est généralement pas modifié via ce formulaire
			// On se base sur employeeUpdateSchema qui rend les champs optionnels
			position: initialData.position || '',
			phoneNumber: initialData.phoneNumber || '',
			// userId: initialData.userId, // Ne pas inclure pour l'update si non modifiable
		} : {
			userId: undefined, // Ou un autre type si vous utilisez un number input
			position: '',
			phoneNumber: '',
		},
	});

	const form2 = useForm<EmployeeFormData>();

	const handleSubmit = async (data: EmployeeFormData | EmployeeUpdateFormData) => {
		await onSubmit(data);
	};

	return (
		<>
			{/* CONTAINER */}
			<div className='flex flex-col gap-4'>
				{/* DEBUT FORM */}
				<Form {...form2}>
					<form className='flex flex-col gap-4 xl:flex-row xl:gap-6 '>
						{/* LEFT */}
						<div className='w-full xl:w-3/4 space-y-6'>
							{/* INFORMATION + CONNEXION CONTAINER */}
							<div className='bg-primary-foreground p-4 rounded-lg space-y-4'>

								{/* INFORMATION */}
								<h1 className='text-xl font-medium tracking-tight'>Information</h1>
								<div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4 gap-3'>
									<FormField
										control={form.control}
										name="position"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Civilité</FormLabel>
												<FormControl>
													<Input placeholder="M./ Me/ Mlle" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="position"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Nom</FormLabel>
												<FormControl>
													<Input placeholder="" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="position"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Prénoms</FormLabel>
												<FormControl>
													<Input placeholder="" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="position"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Date de naissance</FormLabel>
												<FormControl>
													<Input placeholder="10/10/1999" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4 gap-3'>
									<FormField
										control={form.control}
										name="position"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Poste / Fonction</FormLabel>
												<FormControl>
													<Input placeholder="Ex: Gestionnaire Locatif, Comptable" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="position"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Adresse</FormLabel>
												<FormControl>
													<Input placeholder="Ville, Quartier, Maison John Doe" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="position"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Téléphone</FormLabel>
												<FormControl>
													<Input placeholder="+228--------" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="position"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Nature de la pièce</FormLabel>
												<FormControl>
													<Input placeholder="" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4 gap-3'>
									<FormField
										control={form.control}
										name="position"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Numéro de la pièce </FormLabel>
												<FormControl>
													<Input placeholder="" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="position"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Lieu de délivrance</FormLabel>
												<FormControl>
													<Input placeholder="" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="position"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Date de délivrance</FormLabel>
												<FormControl>
													<Input placeholder="11/11/1111" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="position"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Date d'expiration</FormLabel>
												<FormControl>
													<Input placeholder="11/11/1111" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4 gap-3'>
									<FormField
										control={form.control}
										name="position"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Statut matrimonial</FormLabel>
												<FormControl>
													<Input placeholder="" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="position"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Nombre d'enfant</FormLabel>
												<FormControl>
													<Input placeholder="" type='number' {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="position"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Type contrat</FormLabel>
												<FormControl>
													<Input placeholder="CDI, CDD, Stagiaire" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

								</div>
								{/* PERSONNE A PREVENIR */}
								<h1 className='text-xl font-medium tracking-tight'>Personne a contacter en cas d'urgence</h1>
								<div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4 gap-3'>
									<FormField
										control={form.control}
										name="position"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Nom</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="position"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Prénoms</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="position"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Téléphone</FormLabel>
												<FormControl>
													<Input placeholder="+228XXXXXXXX" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

								</div>
								{/* CONNEXION */}
								<h1 className='text-xl font-medium tracking-tight'>Connexion</h1>
								<div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4 gap-3'>
									<FormField
										control={form.control}
										name="position"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Nom d'utilisateur</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="position"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Mot de passe</FormLabel>
												<FormControl>
													<Input type='password' {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="position"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input type='email' placeholder="m@exemple.com" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

								</div>
							</div>
						</div>
						{/* RIGHT */}
						<div className='w-full xl:w-1/4 space-y-6'>
							{/* IMAGE FILE + ROLE ACCESS CONTAINER */}
							<div className='bg-primary-foreground p-4 rounded-lg'>
								<div className='flex flex-col gap-8 mb-4'>

									{/* IMAGE FILE */}
									<div>
										<h1 className='text-xl font-medium tracking-tight'>Identification</h1>
										<div className='space-y-4 mt-4'>
											{/* TODO: make an drop image file input  */}
											<Input type='file' placeholder='Glissez ou cliquer pour ajouter' />
										</div>
									</div>

									{/* ROLES */}
									<div>
										<h1 className='text-xl font-medium tracking-tight'>Droits d'acces</h1>
										<div className='space-y-4 mt-4'>
											<div className='grid grid-cols-1 gap-4'>
												<div className='grid grid-cols-2 items-center justify-between gap-4'>
													<div className='flex items-center space-x-2'>
														<Switch id="employe" className='mr-2' />
														<Label htmlFor="employe" className='text-sm font-medium'>Employe</Label>
													</div>
													<div className='flex items-center space-x-2'>
														<Switch id="proprietaire" className='mr-2' />
														<Label htmlFor="proprietaire" className='text-sm font-medium'>Proprietaire</Label>
													</div>
												</div>
												<div className='grid grid-cols-2 items-center justify-between gap-4'>
													<div className='flex items-center space-x-2'>
														<Switch id="locataire" className='mr-2' />
														<Label htmlFor="locataire" className='text-sm font-medium'>Locataire</Label>
													</div>
													<div className='flex items-center space-x-2'>
														<Switch id="locative" className='mr-2' />
														<Label htmlFor="locative" className='text-sm font-medium'>Locative</Label>
													</div>
												</div>
												<div className='grid grid-cols-2 items-center justify-between gap-4'>
													<div className='flex items-center space-x-2'>
														<Switch id="bien" className='mr-2' />
														<Label htmlFor="bien" className='text-sm font-medium'>Biens</Label>
													</div>
													<div className='flex items-center space-x-2'>
														<Switch id="contrat" className='mr-2' />
														<Label htmlFor="contrat" className='text-sm font-medium'>Contrat</Label>
													</div>
												</div>
												<div className='grid grid-cols-2 items-center justify-between gap-4'>
													<div className='flex items-center space-x-2'>
														<Switch id="paiement" className='mr-2' />
														<Label htmlFor="paiement" className='text-sm font-medium'>Paiement</Label>
													</div>
													<div className='flex items-center space-x-2'>
														<Switch id="rapport" className='mr-2' />
														<Label htmlFor="rapport" className='text-sm font-medium'>Rapport</Label>
													</div>
												</div>
												<div className='grid grid-cols-2 items-center justify-between gap-4'>
													<div className='flex items-center space-x-2'>
														<Switch id="admin" className='mr-2' />
														<Label htmlFor="admin" className='text-sm font-medium'>Admin</Label>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								{/* Button */}
								<Button className='mt-4'>
									Enregistrer
								</Button>
							</div>
						</div>
						{/* END FORM */}
					</form>
				</Form>
			</div>



			{/* /////////////////////////// */}
			<div>
				<Card className="max-w-2xl ">
					<CardHeader>
						<CardTitle>{isEditMode ? "Modifier le Profil Employé" : "Nouveau Profil Employé"}</CardTitle>
						<CardDescription>
							{isEditMode
								? `Modification du profil de ${initialData?.user?.firstName || ''} ${initialData?.user?.lastName || ''} (ID Employé: ${initialData?.id})`
								: "Remplissez les informations pour créer un nouveau profil employé."}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
								{!isEditMode && ( // Champ userId uniquement pour la création
									<FormField
										control={form.control}
										name="userId" // Assurez-vous que ce nom correspond au schéma
										render={({ field }) => (
											<FormItem className="flex flex-col"> {/* Important pour l'alignement du label */}
												<FormLabel>Utilisateur à associer</FormLabel>
												<FormControl>
													{/* TODO: Remplacer par un ComboBox/Select pour une meilleure UX */}
													<ComboboxUsers
														users={usersForSelection}
														value={field.value}
														onChange={field.onChange}
														placeholder="Sélectionnez un utilisateur..."
														searchPlaceholder="Rechercher par nom ou email..."
														emptyResultText="Aucun utilisateur correspondant."
														disabled={isLoading /* || isLoadingUsers */} // Désactiver pendant le chargement
													/>
													{/* <Input
												type="number"
												placeholder="Entrez l'ID de l'utilisateur existant"
												{...field}
												onChange={event => field.onChange(+event.target.value)} // Convertir en nombre
											/> */}
												</FormControl>
												<FormDescription>
													Le compte utilisateur existant (créé via la section Utilisateurs) à lier à ce profil employé.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								)}

								<FormField
									control={form.control}
									name="position"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Position / Poste</FormLabel>
											<FormControl>
												<Input placeholder="Ex: Gestionnaire Locatif, Comptable" {...field} />
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
											<FormLabel>Numéro de téléphone (Optionnel)</FormLabel>
											<FormControl>
												<Input type="tel" placeholder="Ex: +228 90000000" {...field} value={field.value ?? ''} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<Button type="submit" className="w-full" disabled={isLoading}>
									{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
									{submitButtonText}
								</Button>
							</form>
						</Form>
					</CardContent>
				</Card>
			</div >
		</>
	);
}