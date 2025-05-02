import { z } from 'zod';

// Schéma pour la création d'un profil Employé (lié à un User existant)
export const employeeCreateSchema = z.object({
	userId: z.number({ required_error: "L'ID utilisateur est requis." }).int().positive("L'ID utilisateur doit être positif."),
	position: z.string({ required_error: "La position est requise." }).min(1, { message: "La position est requise." }),
	phoneNumber: z.string().optional().nullable(),
	// hireDate a une valeur par défaut dans le backend, pas besoin ici pour la création simple
});

export type EmployeeFormData = z.infer<typeof employeeCreateSchema>; // Nom générique pour le formulaire

// Schéma pour la mise à jour (on ne modifie généralement pas userId)
export const employeeUpdateSchema = employeeCreateSchema.omit({ userId: true }).partial();
// `.partial()` rend tous les champs optionnels. Affinez si certains doivent rester requis à l'update.

export type EmployeeUpdateFormData = z.infer<typeof employeeUpdateSchema>;