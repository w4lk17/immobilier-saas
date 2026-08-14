import { z } from "zod";

export const maintenanceRequestSchema = z.object({
	title: z.string().min(5, "Le titre doit contenir au moins 5 caractères"),
	description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
	category: z.enum([
		"Plomberie",
		"Électricité",
		"Climatisation",
		"Menuiserie",
		"Peinture",
		"Serrurerie",
		"Autre",
	], {
		required_error: "Veuillez sélectionner une catégorie",
	}),
	priority: z.enum(["low", "medium", "high"], {
		required_error: "Veuillez sélectionner une priorité",
	}),
	images: z.array(z.string()).optional(),
});

export type MaintenanceRequestFormData = z.infer<typeof maintenanceRequestSchema>;
