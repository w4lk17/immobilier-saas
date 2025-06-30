"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import React from 'react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FrontendProperty, FrontendUserSnippet } from '@/types'; // Importer FrontendProperty pour initialData

// ComboBox pour sélectionner l'utilisateur
import { ComboboxUsers } from '@/components/shared/ComboboxUsers';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { propertyCreateSchema, PropertyFormData, PropertyUpdateFormData, propertyUpdateSchema } from '../schemas/propertySchemas';
import { PropertyType } from '@/types/enums';
import { ZodEnum } from 'zod';

interface PropertyFormProps {
	initialData?: FrontendProperty | null; // Pour pré-remplir en mode édition
	onSubmit: (data: PropertyFormData | PropertyUpdateFormData) => Promise<void>;
	isLoading?: boolean;
	submitButtonText?: string;
	usersForSelection?: FrontendUserSnippet[]; // Pour le ComboBox
}

export function PropertyForm({
	initialData,
	onSubmit,
	isLoading = false,
	submitButtonText = initialData ? "Mettre à jour" : "Créer Bien",
	usersForSelection = [] // Pour le ComboBox
}: PropertyFormProps) {

	const isEditMode = !!initialData;

	// Utiliser le schéma approprié basé sur le mode
	const form = useForm<PropertyFormData | PropertyUpdateFormData>({
		resolver: zodResolver(isEditMode ? propertyUpdateSchema : propertyCreateSchema),
		defaultValues: isEditMode && initialData ? {
			// Pour la mise à jour, userId n'est généralement pas modifié via ce formulaire
			// On se base sur propertyUpdateSchema qui rend les champs optionnels
			// ownerId: initialData.ownerId, // Ne pas inclure pour l'update si non modifiable
			address: initialData.address || '',
			type: initialData.type  ,
			rentAmount: initialData.rentAmount,
			charges: initialData.charges,
			// managerId: initialData.managerId, // Ne pas inclure pour l'update si non modifiable
			status: initialData.status || '',
			description: initialData.description || '',
		} : {
			ownerId: undefined, // Ou un autre type si vous utilisez un number input
			address: '',
			type: '',
			rentAmount: '',
			charges: '',
			managerId: undefined, // Ou un autre type si vous utilisez un number input
			status: '',
			description: '',
		},
	});

	const form2 = useForm<{ test: string }>();

	const handleSubmit = async (data: PropertyFormData | PropertyUpdateFormData) => {
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
									{/* select input */}
									<FormField
										control={form2.control}
										name="test"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Destiné à la vente ?</FormLabel>
												<FormControl>
													<Input placeholder="" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form2.control}
										name="test"
										render={({ field }) => (
											<FormItem>
												<FormLabel>N° Lot</FormLabel>
												<FormControl>
													<Input placeholder="" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form2.control}
										name="test"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Lot</FormLabel>
												<FormControl>
													<Input placeholder="" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form2.control}
										name="test"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Titre Foncier</FormLabel>
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
										control={form2.control}
										name="test"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Surface (m²)</FormLabel>
												<FormControl>
													<Input placeholder="" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form2.control}
										name="test"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Nom du bien</FormLabel>
												<FormControl>
													<Input placeholder="" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										// use select input
										control={form2.control}
										name="test"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Type de bien</FormLabel>
												<FormControl>
													<Input placeholder="" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form2.control}
										name="test"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Adresse</FormLabel>
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
										control={form2.control}
										name="test"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Ville</FormLabel>
												<FormControl>
													<Input placeholder="" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form2.control}
										name="test"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Quartier</FormLabel>
												<FormControl>
													<Input placeholder="" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form2.control}
										name="test"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Valeur du bien</FormLabel>
												<FormControl>
													<Input placeholder="" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										// use select input or combobox
										control={form2.control}
										name="test"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Proprietaire</FormLabel>
												<FormControl>
													<Input placeholder="" {...field} />
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
						<CardTitle>{isEditMode ? "Modifier Bien" : "Nouveau Bien"}</CardTitle>
						<CardDescription>
							{isEditMode
								? `Modification du profil de ${initialData?.id || ''} ${initialData?.type || ''} (ID Bien: ${initialData?.id})`
								: "Remplissez les informations pour créer un nouveau profil Bien."}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
								{!isEditMode && ( // Champ userId uniquement pour la création
									<FormField
										control={form.control}
										name="ownerId" // Assurez-vous que ce nom correspond au schéma
										render={({ field }) => (
											<FormItem className="flex flex-col"> {/* Important pour l'alignement du label */}
												<FormLabel>Propriétaire</FormLabel>
												<FormControl>
													{/* TODO: Remplacer par un ComboBox/Select pour une meilleure UX */}
													<ComboboxUsers
														users={usersForSelection}
														value={field.value}
														onChange={field.onChange}
														placeholder="Sélectionnez un propriétaire..."
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
													Le compte utilisateur existant (créé via la section Utilisateurs) à lier à ce profil Bien.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								)}

								<FormField
									control={form.control}
									name="address"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Adresse</FormLabel>
											<FormControl>
												<Input placeholder="" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="type"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Numéro de téléphone (Optionnel)</FormLabel>
											<FormControl>
												<Input placeholder="Ex: +228 90000000" {...field} value={field.value ?? ''} />
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
