"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { maintenanceRequestSchema, MaintenanceRequestFormData } from "../schemas/maintenanceSchemas";
import { MultiImageDropzone } from "@/components/shared/MultiImageDropzone";

interface MaintenanceRequestFormProps {
	onSuccess?: () => void;
	onCancel?: () => void;
}

const categories = [
	{ value: "Plomberie", label: "Plomberie" },
	{ value: "Électricité", label: "Électricité" },
	{ value: "Climatisation", label: "Climatisation" },
	{ value: "Menuiserie", label: "Menuiserie" },
	{ value: "Peinture", label: "Peinture" },
	{ value: "Serrurerie", label: "Serrurerie" },
	{ value: "Autre", label: "Autre" },
];

const priorities = [
	{ value: "low", label: "Faible" },
	{ value: "medium", label: "Moyenne" },
	{ value: "high", label: "Élevée" },
];

export function MaintenanceRequestForm({ onSuccess, onCancel }: MaintenanceRequestFormProps) {
	const form = useForm<MaintenanceRequestFormData>({
		resolver: zodResolver(maintenanceRequestSchema),
		defaultValues: {
			title: "",
			description: "",
			category: undefined,
			priority: "medium",
			images:  [],
		},
	});

	const onSubmit = async (data: MaintenanceRequestFormData) => {
		try {
			// TODO: Implement API call to create maintenance request
			console.log("Maintenance request data:", data);

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Show success message
			// toast.success("Demande de maintenance envoyée avec succès");

			// Reset form
			form.reset();

			// Call success callback
			onSuccess?.();
		} catch (error) {
			console.error("Error creating maintenance request:", error);
			// toast.error("Erreur lors de l'envoi de la demande");
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				{/* Title */}
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Titre</FormLabel>
							<FormControl>
								<Input
									placeholder="Ex: Fuite d'eau dans la salle de bain"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Category */}
				<FormField
					control={form.control}
					name="category"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Catégorie</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Sélectionnez une catégorie" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{categories.map((category) => (
										<SelectItem key={category.value} value={category.value}>
											{category.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Priority */}
				<FormField
					control={form.control}
					name="priority"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Priorité</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Sélectionnez une priorité" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{priorities.map((priority) => (
										<SelectItem key={priority.value} value={priority.value}>
											{priority.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Description */}
				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Décrivez le problème en détail..."
									className="min-h-[120px]"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Images */}
				<FormField
					control={form.control}
					name="images"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Images (optionnel)</FormLabel>
							<FormControl>
								<MultiImageDropzone
									value={field.value || []}
									onChange={field.onChange}
									disabled={form.formState.isSubmitting}
									maxFiles={3}
									accept={{
										"image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"],
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Actions */}
				<div className="flex items-center justify-end gap-3">
					{onCancel && (
						<Button type="button" variant="outline" onClick={onCancel}>
							Annuler
						</Button>
					)}
					<Button type="submit" disabled={form.formState.isSubmitting}>
						{form.formState.isSubmitting ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Envoi en cours...
							</>
						) : (
							"Envoyer la demande"
						)}
					</Button>
				</div>
			</form>
		</Form>
	);
}
