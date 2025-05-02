
import { z } from 'zod';
import { ContractStatus } from '@/types/enums';

export const contractSchema = z.object({
	propertyId: z.number({ required_error: "L'ID de propriété est requis." }).int().positive(),
	tenantId: z.number({ required_error: "L'ID de locataire est requis." }).int().positive(),
	managerId: z.number({ required_error: "L'ID de gestionnaire est requis." }).int().positive(),

	// Gérer les dates comme des strings (format ISO) ou des objets Date selon le DatePicker utilisé
	// Utiliser z.string() si le date picker retourne une string ISO
	// Utiliser z.date() si le date picker retourne un objet Date
	// `coerce` peut aider à la transformation
	startDate: z.coerce.date({
		required_error: "La date de début est requise.",
		invalid_type_error: "Format de date de début invalide.",
	}),
	endDate: z.coerce.date({ invalid_type_error: "Format de date de fin invalide." }).optional().nullable(),

	rentAmount: z.coerce.number({ invalid_type_error: "Le loyer doit être un nombre." }).min(0),
	depositAmount: z.coerce.number({ invalid_type_error: "La caution doit être un nombre." }).min(0),
	status: z.nativeEnum(ContractStatus).optional(), // Le backend a une valeur par défaut
});

export type ContractFormData = z.infer<typeof contractSchema>;

// Schéma pour la mise à jour (souvent seulement status et endDate sont modifiables)
export const contractUpdateSchema = z.object({
	status: z.nativeEnum(ContractStatus).optional(),
	endDate: z.coerce.date({ invalid_type_error: "Format de date de fin invalide." }).optional().nullable(),
	// Ajouter rentAmount/depositAmount si modifiables après création
	// rentAmount: z.coerce.number({ invalid_type_error: "Le loyer doit être un nombre." }).min(0).optional(),
	// depositAmount: z.coerce.number({ invalid_type_error: "La caution doit être un nombre." }).min(0).optional(),
});

export type ContractUpdateFormData = z.infer<typeof contractUpdateSchema>;