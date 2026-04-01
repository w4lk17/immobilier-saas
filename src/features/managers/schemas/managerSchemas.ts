import { z } from 'zod';
import { EmploymentType } from '@/types/enums';

// Schema for Employe Profile creation
export const ManagerCreateSchema = z.object({
	userId: z.number({ required_error: "L'ID utilisateur est requis." }).int().positive("L'ID utilisateur doit être positif."),
	phoneNumber: z.string().optional().nullable(),
	// BaseProfile common fields
	civility: z.string().optional().nullable(),
	dateOfBirth: z.string().optional().nullable(),
	address: z.string().optional().nullable(),
	identityDocumentNumber: z.string().optional().nullable(),
	identityDocumentType: z.string().optional().nullable(),
	identityDeliveryCity: z.string().optional().nullable(),
	identityDeliveryDate: z.string().optional().nullable(),
	identityExpiryDate: z.string().optional().nullable(),
	pacLastName: z.string().optional().nullable(),
	pacFirstName: z.string().optional().nullable(),
	pacPhoneNumber: z.string().optional().nullable(),
	pictureUrl: z.union([
		z.string().url(),
		z.literal(''),
		z.null(),
	]).optional(),
	workPlace: z.string().optional().nullable(),
	occupation: z.string().optional().nullable(),
	// Manager specific fields
	position: z.string({ required_error: "La position est requise." }).min(1, { message: "La position est requise." }),
	EmploymentType: z.nativeEnum(EmploymentType).optional().nullable(),
});

// Schema for update (userId is not generally updated)
export const ManagerUpdateSchema = ManagerCreateSchema.omit({ userId: true }).partial();
// `.partial()` rend tous les champs optionnels. Affinez si certains doivent rester requis à l'update.

export type ManagerFormData = z.infer<typeof ManagerCreateSchema>;
export type ManagerUpdateFormData = z.infer<typeof ManagerUpdateSchema>;