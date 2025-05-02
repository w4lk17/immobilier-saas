import { z } from 'zod';
import { UserRole } from '@/types/enums'; // Import enum frontend

// Schéma pour la mise à jour d'un utilisateur par un admin
export const userUpdateSchema = z.object({
	// L'email est généralement unique, sa mise à jour peut nécessiter une logique spéciale
	email: z.string().email({ message: 'Adresse email invalide.' }).optional(),
	// Le mot de passe est optionnel lors de la mise à jour. S'il est fourni, le backend doit le hasher.
	// On peut ajouter une validation plus complexe si nécessaire (ex: confirmation)
	password: z.string().min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères.' }).optional().or(z.literal('')), // Permet une chaîne vide si on ne veut pas le MAJ via ce champ
	role: z.nativeEnum(UserRole).optional(),
	firstName: z.string().min(1, "Le prénom ne peut pas être vide.").optional().nullable(),
	lastName: z.string().min(1, "Le nom ne peut pas être vide.").optional().nullable(),
});

export type UserFormData = z.infer<typeof userUpdateSchema>; // Nom générique, peut être renommé UpdateUserFormData