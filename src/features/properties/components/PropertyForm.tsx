"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Loader2,
	Building2,
	FileText,
	MapPin,
	Info,
	Upload,
	DollarSign,
	Ruler
} from 'lucide-react';
import React from 'react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Property, User } from '@/types';

// ComboBox pour sélectionner l'utilisateur
import { ComboboxUsers } from '@/components/shared/ComboboxUsers';
import {
	propertyCreateSchema,
	PropertyFormData,
	PropertyUpdateFormData,
	propertyUpdateSchema
} from '../schemas/propertySchemas';
import { PropertyStatus, PropertyType } from '@/types/enums';
import { propertyStatusLabels, propertyTypeLabels } from '../lib/propertyLabels';

interface PropertyFormProps {
	initialData?: Property | null; // Pour pré-remplir en mode édition
	onSubmit: (data: PropertyFormData | PropertyUpdateFormData) => Promise<void>;
	isLoading?: boolean;
	submitButtonText?: string;
	usersForSelection?: User[]; // Pour le ComboBox
}

export function PropertyForm({
	initialData,
	onSubmit,
	isLoading = false,
	submitButtonText = initialData ? "Mettre à jour" : "Créer propriété",
	usersForSelection = [] // Pour le ComboBox
}: PropertyFormProps) {

	const isEditMode = !!initialData;

	// Utiliser le schéma approprié basé sur le mode
	const form = useForm<PropertyFormData | PropertyUpdateFormData>({
		resolver: zodResolver(isEditMode ? propertyUpdateSchema : propertyCreateSchema),
		defaultValues: isEditMode && initialData ? {
			// ownerId: initialData.ownerId ,
			managerId: initialData.managerId || undefined,
			address: initialData.address || '',
			type: initialData.type || PropertyType.HOUSE,
			status: initialData.status || PropertyStatus.AVAILABLE,
			description: initialData.description || '',
			propertyValue: initialData.propertyValue || undefined,
			rentalUnits: initialData.rentalUnits || undefined,

			// Mock UI fields for edit mode pre-filling
			// isForSale: initialData.isForSale || false,
			nLot: initialData.nLot || undefined,
			lot: initialData.lot || undefined,
			landTitle: initialData.landTitle || undefined,
			surface: initialData.surface || undefined,
			name: initialData.name || '',
			city: initialData.city || '',
			neighborhood: initialData.neighborhood || '',

		} : {
			// ownerId: undefined,
			managerId: undefined,
			address: '',
			type: PropertyType.HOUSE,
			status: PropertyStatus.AVAILABLE,
			description: '',
			propertyValue: undefined,
			rentalUnits: 1, 

			// isForSale: false, //
			nLot: undefined,
			lot: undefined,
			landTitle: undefined,
			surface: undefined,
			name: '',
			city: '',
			neighborhood: '',
			
		},
	});

	// Drag & Drop State pour le fichier
	const [dragActive, setDragActive] = React.useState(false);
	const [selectedFileName, setSelectedFileName] = React.useState<string | null>(null);
	const fileInputRef = React.useRef<HTMLInputElement>(null);

	const handleDrag = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === "dragenter" || e.type === "dragover") {
			setDragActive(true);
		} else if (e.type === "dragleave") {
			setDragActive(false);
		}
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);
		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			const file = e.dataTransfer.files[0];
			setSelectedFileName(file.name);
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			setSelectedFileName(file.name);
		}
	};

	const onDropzoneClick = () => {
		fileInputRef.current?.click();
	};

	const handleSubmit = async (data: PropertyFormData | PropertyUpdateFormData) => {
		await onSubmit(data);
	};

	return (
		<div className="w-full max-w-6xl mx-auto">
			<Card className="border-border/80 shadow-lg bg-card">
				{/* <CardHeader className="border-b bg-muted/10 pb-6">
					<CardTitle className="text-2xl font-bold tracking-tight">
						{isEditMode ? "Modifier Bien" : "Nouveau Bien"}
					</CardTitle>
					<CardDescription className="text-sm text-muted-foreground mt-1">
						{isEditMode
							? `Modification du profil de ${initialData?.id || ''} ${initialData?.type || ''} (ID Bien: ${initialData?.id})`
							: "Remplissez les informations pour créer un nouveau profil de Bien immobilier."}
					</CardDescription>
				</CardHeader> */}

				<CardContent className="pt-8">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">

							{/* SECTION 1: Informations Générales */}
							<div className="space-y-5">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
									{/* Nom du bien */}
									<FormField
										control={form.control}
										name="name"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Référence de la propriété</FormLabel>							
												<FormControl>
													<Input placeholder="Ex: Résidence Al Qods" {...field} disabled={isLoading} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Type de bien */}
									<FormField
										control={form.control}
										name="type"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Type de propriété <span className="text-destructive">*</span></FormLabel>							
												<Select
													disabled={isLoading}
													onValueChange={field.onChange}
													value={field.value}
												>
													<FormControl className="w-full">
														<SelectTrigger className="w-full">
															<SelectValue placeholder="Sélectionnez un type..." />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{Object.entries(propertyTypeLabels).map(([key, label]) => (
															<SelectItem key={key} value={key}>
																{label}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Statut */}
									{/* <FormField
										control={form.control}
										name="status"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Statut</FormLabel>
												<Select
													disabled={isLoading}
													onValueChange={field.onChange}
													value={field.value}
												>
													<FormControl className="w-full">
														<SelectTrigger className="w-full">
															<SelectValue placeholder="Sélectionnez un statut..." />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{Object.entries(propertyStatusLabels).map(([key, label]) => (
															<SelectItem key={key} value={key}>
																{label}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/> */}

									{/* Destiné à la vente ? */}
									{/* 
										// Champ retiré car la vente n'est pas pertinente pour gestion locative :
										// <FormField
										//	control={form.control}
										//	name="isForSale"
										//	render={({ field }) => (
										//		<FormItem>
										//			<FormLabel>Destiné à la vente ?</FormLabel>
										//			<Select
										//				disabled={isLoading}
										//				onValueChange={field.onChange}
										//				value={field.value ? 'true' : 'false'}
										//			>
										//				<FormControl className="w-full">
										//					<SelectTrigger className="w-full">
										//						<SelectValue placeholder="Sélectionnez..." />
										//					</SelectTrigger>
										//				</FormControl>
										//				<SelectContent>
										//					<SelectItem value="false">Non</SelectItem>
										//					<SelectItem value="true">Oui</SelectItem>
										//				</SelectContent>
										//			</Select>
										//			<FormMessage />
										//		</FormItem>
										//	)}
										// />
									*/}

								
									<div className="md:col-span-2">
										<FormField
											control={form.control}
											name="rentalUnits"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Nombre de locatifs <span className="text-destructive">*</span></FormLabel>
													<FormControl>
														<Input
															type="number"
															min={1}
															placeholder="Ex: 3"
															{...field}
															disabled={isLoading}
														/>
													</FormControl>
													<FormDescription>
														Indiquez combien d’unités locatives contient la propriété.
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

								</div>
							</div>

							{/* SECTION 2: Localisation & Propriétaire */}
							<div className="space-y-5">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
									{/* Ville */}
									<FormField
										control={form.control}
										name="city"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Ville <span className="text-destructive">*</span></FormLabel>
												<FormControl>
													<Input placeholder="Ex: Lome" {...field} disabled={isLoading} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Quartier */}
									<FormField
										control={form.control}
										name="neighborhood"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Quartier <span className="text-destructive">*</span></FormLabel>
												<FormControl>
													<Input placeholder="Ex: nukafu" {...field} disabled={isLoading} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Adresse - Full width */}
									<div className="md:col-span-2">
										<FormField
											control={form.control}
											name="address"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Adresse complète <span className="text-destructive">*</span></FormLabel>								
													<FormControl>
														<Input placeholder="Ex: 45, Rue de la liberté" {...field} disabled={isLoading} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									{/* Propriétaire - décommenter si besoin */}
									{/* {!isEditMode && (
										<div className="md:col-span-2">
											<FormField
												control={form.control}
												name="ownerId"
												render={({ field }) => (
													<FormItem className="flex flex-col">
														<FormLabel>Propriétaire</FormLabel>
														<FormControl >
															<ComboboxUsers
																users={usersForSelection}
																value={field.value}
																onChange={field.onChange}
																placeholder="Sélectionnez un propriétaire..."
																searchPlaceholder="Rechercher par nom ou email..."
																emptyResultText="Aucun utilisateur correspondant."
																disabled={isLoading}
															/>
														</FormControl>
														<FormDescription>
															Le compte utilisateur existant à lier à ce profil Bien.
														</FormDescription>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									)} */}
								</div>
							</div>

							{/* SECTION 3: Description */}
							<div className="space-y-5">
								<FormField
									control={form.control}
									name="description"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Description / Notes complémentaires</FormLabel>
											<FormControl>
												<Textarea
													placeholder="Ajoutez des précisions ou remarques utiles concernant cette propriété"
													className="min-h-[120px] resize-y"
													disabled={isLoading}
													{...field}
													value={field.value ?? ''}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							{/* Image Upload & Submit Action */}
							<div className="space-y-6">

								{/* Dropzone Container */}
								{/* <div className="rounded-xl border border-border/80 bg-muted/5 p-5 space-y-4 shadow-sm">
									<h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
										<Upload className="h-5 w-5 text-primary" />
										Identification
									</h3>
									<p className="text-xs text-muted-foreground">
										Ajoutez des images ou des documents d'identification du bien immobilier.
									</p>

									<div
										onDragEnter={handleDrag}
										onDragOver={handleDrag}
										onDragLeave={handleDrag}
										onDrop={handleDrop}
										onClick={onDropzoneClick}
										className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 transition-all duration-200 cursor-pointer min-h-[180px] ${
											dragActive
												? "border-primary bg-primary/5 scale-[1.02]"
												: "border-muted-foreground/30 hover:border-primary/50 hover:bg-accent/40"
										}`}
									>
										<input
											ref={fileInputRef}
											type="file"
											className="hidden"
											onChange={handleFileChange}
											accept="image/*"
											disabled={isLoading}
										/>
										<Upload className="h-8 w-8 text-muted-foreground/80 mb-3" />
										<p className="text-sm font-medium text-center text-foreground">
											{selectedFileName || "Glissez ou cliquez pour ajouter une image"}
										</p>
										<p className="text-[10px] text-muted-foreground mt-2 text-center">
											PNG, JPG, JPEG jusqu'à 5 Mo
										</p>
									</div>

									{selectedFileName && (
										<div className="flex items-center gap-2 p-2 bg-muted/40 rounded-lg text-xs text-muted-foreground border">
											<span className="truncate flex-1 font-medium">{selectedFileName}</span>
											<button
												type="button"
												onClick={(e) => {
													e.stopPropagation();
													setSelectedFileName(null);
												}}
												className="text-destructive hover:underline font-medium"
											>
												Retirer
											</button>
										</div>
									)}
								</div> */}

								{/* Action Buttons */}
								<div className="space-y-3">
									<Button
										type="submit"
										className="w-full h-12 text-sm font-semibold shadow-md transition-all active:scale-[0.98]"
										disabled={isLoading}
									>
										{isLoading ? (
											<>
												<Loader2 className="mr-2 h-5 w-5 animate-spin" />
												Enregistrement...
											</>
										) : (
											submitButtonText
										)}
									</Button>
								</div>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
