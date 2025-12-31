"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, RefreshCcwDot, RefreshCcwDotIcon, RotateCcw } from 'lucide-react';
import React from 'react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FrontendContract, FrontendUserSnippet } from '@/types'; // Importer FrontendTenant pour initialData

// ComboBox pour sélectionner l'utilisateur
import { ComboboxUsers } from '@/components/shared/ComboboxUsers';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { contractCreateSchema, ContractFormData, ContractUpdateFormData, contractUpdateSchema } from '../schemas/contractSchemas';
import { ContractStatus } from '@/types/enums';
import { DatePicker } from '@/components/shared/DatePicker';

interface ContractFormProps {
	initialData?: FrontendContract | null; // Pour pré-remplir en mode édition
	onSubmit: (data: ContractFormData | ContractUpdateFormData) => Promise<void>;
	isLoading?: boolean;
	submitButtonText?: string;
	usersForSelection?: FrontendUserSnippet[]; // Pour le ComboBox
}

export function ContractForm({
	initialData,
	onSubmit,
	isLoading = false,
	submitButtonText = initialData ? "Mettre à jour" : "Créer contrat",
	usersForSelection = [] // Pour le ComboBox
}: ContractFormProps) {

	const isEditMode = !!initialData;

	// Utiliser le schéma approprié basé sur le mode
	const form = useForm<ContractFormData | ContractUpdateFormData>({
		resolver: zodResolver(isEditMode ? contractUpdateSchema : contractCreateSchema),
		defaultValues: isEditMode && initialData ? {
			// Pour la mise à jour, userId n'est généralement pas modifié via ce formulaire
			// On se base sur contractUpdateSchema qui rend les champs optionnels
			status: initialData.status || ContractStatus,
			endDate: initialData.endDate ? new Date(initialData.endDate) : null,
		} : {
			propertyId: undefined,
			tenantId: undefined,
			managerId: undefined,
			startDate: new Date(),
			rentAmount: undefined,
			depositAmount: undefined,
			endDate: undefined,
			status: ContractStatus.DRAFT,
		},
	});

	const form2 = useForm<{ test: string, test2: number, test3: Date }>();

	const handleSubmit = async (data: ContractFormData | ContractUpdateFormData) => {
		await onSubmit(data);
	};

	return (
		<>
			{/* CONTAINER */}
			<div className='flex flex-col gap-4'>
				{/* START FORM */}
				<Form {...form2}>
					<form className='flex flex-col gap-4 xl:flex-row xl:gap-6 '>
						{/* LEFT */}
						<div className='w-full xl:w-1/4 space-y-6'>
							<div className='bg-primary-foreground p-4 rounded-lg'>
								<div className='flex flex-col gap-8 mb-4'>
									{/* */}
									<div>
										<h1 className='text-lg font-medium tracking-tight'>Concernés</h1>
										<div className='space-y-3 mt-4'>
											<FormField
												control={form2.control}
												name="test2"
												render={({ field }) => (
													<FormItem className="flex flex-col"> {/* Important pour l'alignement du label */}
														<FormLabel>Propriétaire</FormLabel>
														<FormControl>
															{/* TODO: Remplacer par un ComboBox/Select pour une meilleure UX */}
															<ComboboxUsers
																users={usersForSelection}
																value={field.value}
																onChange={field.onChange}
																placeholder="Sélectionnez Propriétaire"
																searchPlaceholder="Rechercher par nom ou email..."
																emptyResultText="Aucun utilisateur correspondant."
																disabled={isLoading /* || isLoadingUsers */} // Désactiver pendant le chargement
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form2.control}
												name="test2"
												render={({ field }) => (
													<FormItem className="flex flex-col"> {/* Important pour l'alignement du label */}
														<FormLabel>Bien</FormLabel>
														<FormControl>
															{/* TODO: Remplacer par un ComboBox/Select pour une meilleure UX */}
															<ComboboxUsers
																users={usersForSelection}
																value={field.value}
																onChange={field.onChange}
																placeholder="Sélectionnez bien"
																searchPlaceholder="Rechercher par nom ou email..."
																emptyResultText="Aucun utilisateur correspondant."
																disabled={isLoading /* || isLoadingUsers */} // Désactiver pendant le chargement
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form2.control}
												name="test2"
												render={({ field }) => (
													<FormItem className="flex flex-col"> {/* Important pour l'alignement du label */}
														<FormLabel>Locative</FormLabel>
														<FormControl>
															{/* TODO: Remplacer par un ComboBox/Select pour une meilleure UX */}
															<ComboboxUsers
																users={usersForSelection}
																value={field.value}
																onChange={field.onChange}
																placeholder="Sélectionnez locative"
																searchPlaceholder="Rechercher par nom ou email..."
																emptyResultText="Aucun utilisateur correspondant."
																disabled={isLoading /* || isLoadingUsers */} // Désactiver pendant le chargement
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form2.control}
												name="test2"
												render={({ field }) => (
													<FormItem className="flex flex-col"> {/* Important pour l'alignement du label */}
														<FormLabel>Locataire</FormLabel>
														<FormControl>
															{/* TODO: Remplacer par un ComboBox/Select pour une meilleure UX */}
															<ComboboxUsers
																users={usersForSelection}
																value={field.value}
																onChange={field.onChange}
																placeholder="Sélectionnez locataire"
																searchPlaceholder="Rechercher par nom ou email..."
																emptyResultText="Aucun utilisateur correspondant."
																disabled={isLoading /* || isLoadingUsers */} // Désactiver pendant le chargement
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* RIGHT */}
						<div className='w-full xl:w-3/4 space-y-6'>
							{/* INFORMATION */}
							<div className='bg-primary-foreground p-4 rounded-lg space-y-4'>

								{/* INFORMATION */}
								<h1 className='text-lg font-bold tracking-tight'>Eléments liés au contrat</h1>
								<h1 className='text-sm font-semibold '>Locataire</h1>
								<div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3  gap-3'>
									<FormField
										control={form2.control}
										name="test"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Type de contrat</FormLabel>
												<FormControl>
													<Input type='text' {...field} />
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
												<FormLabel>Caution</FormLabel>
												<FormControl>
													<Input type='number' {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form2.control}
										name="test"
										render={({ field }) => (
											<FormItem className='sm:col-span-2 xl:col-span-1'>
												<FormLabel>Loyer Avance</FormLabel>
												<FormControl>
													<Input type='number' {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<FormField
									control={form2.control}
									name="test"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Valeur locative</FormLabel>
											<FormControl className='text-center font-bold'>
												<Input disabled {...field} value={field.value ?? ''} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3'>
									<FormField
										control={form2.control}
										name="test"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Date signature</FormLabel>
												<FormControl>
													<Input {...field} />
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
												<FormLabel>Date debut</FormLabel>
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
												<FormLabel>Date fin</FormLabel>
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
												<FormLabel>Jour ajouté à la date de paiement </FormLabel>
												<FormControl>
													<Input type="number" placeholder="" {...field} />
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
												<FormLabel>Debuter le paiement apres (mois)</FormLabel>
												<FormControl>
													<Input type="number" placeholder="" {...field} />
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
												<FormLabel>Pourcentage a payer en cas de retard</FormLabel>
												<FormControl>
													<Input placeholder="" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								{/* PROPRIETAIRE & AGENCE */}
								<h1 className='text-sm font-semibold '>Propriétaire et Agence</h1>
								{/* <h1 className='text-sm font-medium tracking-tight'>Visite du site</h1> */}
								<div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4 gap-3'>
									<FormField
										control={form2.control}
										name="test"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Visite du site</FormLabel>
												<FormControl>
													<Input type='number' disabled {...field} />
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
												<FormLabel>Honoraire (15%)</FormLabel>
												<FormControl>
													<Input type='number' disabled {...field} />
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
												<FormLabel>Frais de Dossier</FormLabel>
												<FormControl>
													<Input type='number' disabled {...field} />
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
												<FormLabel>Droit d'enrégistrement</FormLabel>
												<FormControl>
													<Input type='number' {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<div className='flex items-center space-x-2'>
									<Switch id="compte" className='mr-2' />
									<Label htmlFor="compte" className='text-sm font-medium'>Activer Contrat</Label>
								</div>
								{/* Button */}
								<div className='flex items-center mt-8 gap-2'>
									<Button className='mr-2'>
										Enregistrer
									</Button>
									<Button
										variant='secondary'
									>
										<span className="sr-only">Reset form</span>
										<RotateCcw />
									</Button>
								</div>
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
						<CardTitle>{isEditMode ? "Modifier le Contrat" : "Nouveau Contrat"}</CardTitle>
						<CardDescription>
							{isEditMode
								? `Modification du contrat de ${initialData?.managerId || ''} ${initialData?.managerId || ''} (ID Contrat: ${initialData?.id})`
								: "Remplissez les informations pour créer un nouveau contrat."}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
								{!isEditMode && ( // Champ userId uniquement pour la création
									<>
										<FormField
											control={form.control}
											name="tenantId" // Assurez-vous que ce nom correspond au schéma
											render={({ field }) => (
												<FormItem className="flex flex-col"> {/* Important pour l'alignement du label */}
													<FormLabel>Locataire</FormLabel>
													<FormControl>
														{/* TODO: Remplacer par un ComboBox/Select pour une meilleure UX */}
														<ComboboxUsers
															users={usersForSelection}
															value={field.value}
															onChange={field.onChange}
															placeholder="Sélectionnez locataire"
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
														Le compte utilisateur existant (créé via la section Utilisateurs) à lier à ce profil contrat.
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="managerId" // Assurez-vous que ce nom correspond au schéma
											render={({ field }) => (
												<FormItem className="flex flex-col"> {/* Important pour l'alignement du label */}
													<FormLabel>Manager</FormLabel>
													<FormControl>
														{/* TODO: Remplacer par un ComboBox/Select pour une meilleure UX */}
														<ComboboxUsers
															users={usersForSelection}
															value={field.value}
															onChange={field.onChange}
															placeholder="Sélectionnez manager"
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
														Le compte utilisateur existant (créé via la section Utilisateurs) à lier à ce profil contrat.
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
									</>
								)}
								{/* 
								<FormField
									control={form.control}
									name="endDate"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Position / Poste</FormLabel>
											<FormControl>
												<Input type='' placeholder="" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/> */}

								<FormField
									control={form.control}
									name="status"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Status</FormLabel>
											<FormControl>
												<Input placeholder="" {...field} value={field.value ?? ''} />
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