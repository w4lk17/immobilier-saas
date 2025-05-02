
import { z } from 'zod';

// Schéma pour la création d'un profil Propriétaire (lié à un User existant)
export const ownerCreateSchema = z.object({
	userId: z.number({ required_error: "L'ID utilisateur est requis." }).int().positive("L'ID utilisateur doit être positif."),
	phoneNumber: z.string().optional().nullable(),
});

export type OwnerFormData = z.infer<typeof ownerCreateSchema>;

// Schéma pour la mise à jour
export const ownerUpdateSchema = ownerCreateSchema.omit({ userId: true }).partial();

export type OwnerUpdateFormData = z.infer<typeof ownerUpdateSchema>;