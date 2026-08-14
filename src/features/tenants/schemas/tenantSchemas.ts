// features/tenants/schemas/tenantSchemas.ts
import { z } from 'zod';

// Schéma complet pour créer un locataire (et son compte user)
export const tenantCreateSchema = z.object({
	// Champs User
	email: z.string().email('Email invalide'),
	firstName: z.string().min(1, 'Le prénom est requis'),
	lastName: z.string().min(1, 'Le nom est requis'),
	phoneNumber: z.string().min(1, 'Le numéro de téléphone est requis'),
	civility: z.string().min(1, 'La civilité est requise'),
	dateOfBirth: z.string().optional().nullable(),
	address: z.string().optional().nullable(),
	workPlace: z.string().optional().nullable(),
	occupation: z.string().min(1, 'La profession est requise'),
	pictureUrl: z.string().url().optional().nullable(),

	// Documents
	identityDocumentNumber: z.string().min(8, 'Le numéro de pièce d\'identité est requis'),
	identityDocumentType: z.string().min(1, 'Le type de pièce d\'identité est requis'),
	identityDeliveryCity: z.string().min(1, 'Ce champ est requis'),
	identityDeliveryDate: z.string().optional().nullable(),
	identityExpiryDate: z.string().optional().nullable(),

	// PAC
	pacLastName: z.string().min(1, "Le nom du contact d’urgence est requis"),
	pacFirstName: z.string().min(1, "Le prénom du contact d’urgence est requis"),
	pacPhoneNumber: z.string().min(1, "Le numéro du contact d’urgence est requis"),

	// Champs Tenant spécifique
	oldAddress: z.string().optional().nullable(),
});

// Mise à jour : tout est partiel
export const tenantUpdateSchema = tenantCreateSchema.partial();

export type TenantFormData = z.infer<typeof tenantCreateSchema>;
export type TenantUpdateFormData = z.infer<typeof tenantUpdateSchema>;