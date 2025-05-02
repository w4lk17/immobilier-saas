
import { z } from 'zod';

// Schéma pour la création d'un profil Locataire (lié à un User existant)
export const tenantCreateSchema = z.object({
	userId: z.number({ required_error: "L'ID utilisateur est requis." }).int().positive("L'ID utilisateur doit être positif."),
	phoneNumber: z.string().optional().nullable(),
});

export type TenantFormData = z.infer<typeof tenantCreateSchema>;

// Schéma pour la mise à jour
export const tenantUpdateSchema = tenantCreateSchema.omit({ userId: true }).partial();

export type TenantUpdateFormData = z.infer<typeof tenantUpdateSchema>;