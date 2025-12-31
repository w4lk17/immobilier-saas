"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import React from 'react';

import {
	expenseCreateSchema,
	ExpenseFormData,
	expenseUpdateSchema,
	ExpenseUpdateFormData
} from '../schemas/expenseSchemas';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FrontendExpense, FrontendProperty, FrontendUserSnippet } from '@/types'; // Importer FrontendExpense pour initialData

// ComboBox pour sélectionner l'utilisateur
import { ComboboxUsers } from '@/components/shared/ComboboxUsers';
import { Combobox } from '@/components/shared/Combobox';

interface ExpenseFormProps {
	initialData?: FrontendExpense | null; // Pour pré-remplir en mode édition
	onSubmit: (data: ExpenseFormData | ExpenseUpdateFormData) => Promise<void>;
	isLoading?: boolean;
	submitButtonText?: string;
	usersForSelection?: FrontendUserSnippet[]; // Pour le ComboBox
	propertiesForSelection?: FrontendProperty[];
}

export function ExpenseForm({
	initialData,
	onSubmit,
	isLoading = false,
	submitButtonText = initialData ? "Mettre à jour" : "Créer l'employé",
	usersForSelection = [], // Pour le ComboBox
	propertiesForSelection = [],
}: ExpenseFormProps) {

	const isEditMode = !!initialData;

	// Utiliser le schéma approprié basé sur le mode
	const form = useForm<ExpenseFormData | ExpenseUpdateFormData>({
		resolver: zodResolver(isEditMode ? expenseUpdateSchema : expenseCreateSchema),
		defaultValues: isEditMode && initialData ? {
			// Pour la mise à jour, userId n'est généralement pas modifié via ce formulaire
			// On se base sur expenseUpdateSchema qui rend les champs optionnels
			amount: initialData.amount,
			description: initialData.description || '',
			date: initialData.date,
			type: initialData.type,
			status: initialData.status,
		} : {
			propertyId: undefined,
			amount: undefined,
			description: '',
			date: undefined,
			type: undefined,
			status: undefined,
		},
	});

	const form2 = useForm<ExpenseFormData>();

	const handleSubmit = async (data: ExpenseFormData | ExpenseUpdateFormData) => {
		await onSubmit(data);
	};

	return (
		<>
			{/* CONTAINER */}
			<div className='flex flex-col gap-4'>
				{/* DEBUT FORM */}
				<Form {...form2}>
					<form className='flex flex-col gap-4 xl:flex-row xl:gap-6 '>

						<div className='w-full  space-y-6'>
							<div className='bg-primary-foreground p-4 rounded-lg space-y-4'>

								{/* INFORMATION */}
								<h1 className='text-xl font-medium tracking-tight'>Information</h1>
								<div className='grid grid-cols-1 gap-4'>
									<div className='grid  sm:grid-cols-1 xl:grid-cols-3 gap-3'>
										<FormField
											control={form2.control}
											name="amount"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Montant<span className='text-red-500'>*</span></FormLabel>
													<FormControl>
														<Input placeholder="Montant" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form2.control}
											name="description"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Description<span className='text-red-500'>*</span></FormLabel>
													<FormControl>
														<Input placeholder="Description" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>



									<div className='grid grid-cols-1 sm:grid-cols-1 xl:grid-cols-3 gap-3'>
										<FormField
											control={form2.control}
											name="propertyId"
											render={({ field }) => (
												<FormItem className="flex flex-col">
													<FormLabel>Bien immobiliers<span className='text-red-500'>*</span></FormLabel>
													<Combobox<FrontendProperty>
														items={propertiesForSelection}
														value={field.value}
														onChange={field.onChange}
														valueAccessor={(property) => property.id}
														displayAccessor={(property) => property.address}
														placeholder="Sélectionner un bien..."
														searchPlaceholder="Rechercher un bien..."
														emptyResultText="Aucun bien trouvé."
													/>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form2.control}
											name="owner"
											render={({ field }) => (
												<FormItem className="flex flex-col">
													<FormLabel>Propriétaire<span className='text-red-500'>*</span></FormLabel>
													<Combobox<FrontendUserSnippet>
														items={usersForSelection}
														value={field.value}
														onChange={field.onChange}
														valueAccessor={(user) => user.id}
														displayAccessor={(user) => `${user.firstName} ${user.lastName}` || 'N/A'}
														placeholder="Sélectionner un propriétaire..."
														searchPlaceholder="Rechercher un propriétaire..."
														emptyResultText="Aucun propriétaire trouvé."
													/>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form2.control}
											name="locative"
											render={({ field }) => (
												<FormItem className="flex flex-col">
													<FormLabel>Locative</FormLabel>
													<Combobox<FrontendUserSnippet>
														items={usersForSelection}
														value={field.value}
														onChange={field.onChange}
														valueAccessor={(user) => user.id}
														displayAccessor={(user) => user.name}
														placeholder="Sélectionner une locative..."
														searchPlaceholder="Rechercher une locative..."
														emptyResultText="Aucune locative trouvée."
													/>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>


								</div>
								{/* Button */}
								<div className='flex items-center mt-8 gap-2'>
									<Button variant='outline'>
										Annuler
									</Button>
									<Button type="submit">
										Enregistrer
									</Button>
								</div>
							</div>
						</div>
						{/* END FORM */}
					</form>
				</Form>
			</div >



			{/* /////////////////////////// */}
			<div>
				<Card className="max-w-2xl ">
					<CardHeader>
						<CardTitle>{isEditMode ? "Modifier le Profil Employé" : "Nouveau Profil Employé"}</CardTitle>
						<CardDescription>
							{isEditMode
								? `Modification du profil de ${initialData?.propertyId || ''} ${initialData?.type || ''} (ID Depense: ${initialData?.id})`
								: "Remplissez les informations pour créer un nouveau profil employé."}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
								{!isEditMode && ( // Champ userId uniquement pour la création
									<FormField
										control={form.control}
										name="propertyId" // Assurez-vous que ce nom correspond au schéma
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
									name="amount"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Montant</FormLabel>
											<FormControl>
												<Input placeholder="Entrez le montant" type="number" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="description"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Description</FormLabel>
											<FormControl>
												<Input placeholder="Entrez la description" value={field.value ?? ''} />
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
											<FormLabel>Type de depense</FormLabel>
											<FormControl>
												<Input placeholder="Entrez le type de depense" value={field.value ?? ''} />
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