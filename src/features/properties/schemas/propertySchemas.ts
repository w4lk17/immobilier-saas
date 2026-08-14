
import { z } from 'zod';
import { PropertyType, PropertyStatus } from '@/types/enums';

export const propertyCreateSchema = z.object({
	ownerId: z.number({ invalid_type_error: "L'ID propriétaire doit être un nombre." }).int().positive("L'ID propriétaire est requis.").optional(),
	managerId: z.number().int().positive().optional().nullable(),
	address: z.string().min(5, { message: "L'adresse doit contenir au moins 5 caractères." }),
	type: z.nativeEnum(PropertyType, { required_error: "Le type de propriété est requis." }),
	description: z.string().optional().nullable(),
	propertyValue: z.coerce.number({ invalid_type_error: "La valeur du bien doit être un nombre." }).min(0, { message: "La valeur ne peut pas être négative." }).optional().nullable(),
	status: z.nativeEnum(PropertyStatus).optional(),

	// Mock UI fields for the redesign
	isForSale: z.boolean().default(false).optional(),
	nLot: z.number().int().positive().optional().nullable(),
	lot: z.number().int().positive().optional().nullable(),
	landTitle: z.string().optional().nullable(),
	surface: z.coerce.number({ invalid_type_error: "La surface doit être un nombre." }).min(0).optional().nullable(),
	name: z.string().optional(),
	city: z.string().min(3, { message: "La ville doit contenir au moins 3 caractères." }),
	neighborhood: z.string().min(3, { message: "Le quartier doit contenir au moins 3 caractères." }),
});

export type PropertyFormData = z.infer<typeof propertyCreateSchema>;

export const propertyUpdateSchema = propertyCreateSchema.partial();
export type PropertyUpdateFormData = z.infer<typeof propertyUpdateSchema>;