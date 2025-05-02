
import { z } from 'zod';
import { PropertyType, PropertyStatus } from '@/types/enums'; // Import enums frontend

export const propertySchema = z.object({
	// ownerId est requis à la création
	ownerId: z.number({ invalid_type_error: "L'ID propriétaire doit être un nombre." }).int().positive("L'ID propriétaire est requis."),
	// managerId est optionnel
	managerId: z.number().int().positive().optional().nullable(),
	address: z.string().min(5, { message: "L'adresse doit contenir au moins 5 caractères." }),
	type: z.nativeEnum(PropertyType, { required_error: "Le type de propriété est requis." }),
	description: z.string().optional().nullable(),
	// Utiliser coerce pour transformer l'input string d'un formulaire en nombre si nécessaire
	rentAmount: z.coerce.number({ invalid_type_error: "Le loyer doit être un nombre." }).min(0, { message: "Le loyer ne peut pas être négatif." }),
	charges: z.coerce.number({ invalid_type_error: "Les charges doivent être un nombre." }).min(0, { message: "Les charges ne peuvent pas être négatives." }),
	status: z.nativeEnum(PropertyStatus).optional(), // Statut optionnel à la création/modif (backend a une valeur par défaut)
});

export type PropertyFormData = z.infer<typeof propertySchema>;

// Pour la mise à jour, on peut rendre ownerId optionnel (ou l'interdire via la logique UI/service)
export const propertyUpdateSchema = propertySchema.partial(); // Rend tous les champs optionnels pour la mise à jour partielle
// ou affiner: propertySchema.omit({ ownerId: true }).partial().extend({ ownerId: z.number()....optional() })
export type PropertyUpdateFormData = z.infer<typeof propertyUpdateSchema>;