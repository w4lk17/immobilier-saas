
import { z } from 'zod';
import { ExpenseType, ExpenseStatus } from '@/types/enums';

export const expenseSchema = z.object({
	propertyId: z.number({ required_error: "L'ID de propriété est requis." }).int().positive(),
	amount: z.coerce.number({ required_error: "Le montant est requis.", invalid_type_error: "Le montant doit être un nombre." }).min(0),
	description: z.string({ required_error: "La description est requise." }).min(3, { message: "La description doit contenir au moins 3 caractères." }),
	date: z.coerce.date({
		required_error: "La date de la dépense est requise.",
		invalid_type_error: "Format de date invalide.",
	}),
	type: z.nativeEnum(ExpenseType, { required_error: "Le type de dépense est requis." }),
	status: z.nativeEnum(ExpenseStatus).optional(), // Le backend a une valeur par défaut (PENDING)
});

export type ExpenseFormData = z.infer<typeof expenseSchema>;

// Pour la mise à jour, tous les champs sont généralement modifiables, sauf propertyId
export const expenseUpdateSchema = expenseSchema.omit({ propertyId: true }).partial();
// Si propertyId doit être modifiable (moins courant), ajustez ou créez un autre schéma.

export type ExpenseUpdateFormData = z.infer<typeof expenseUpdateSchema>;