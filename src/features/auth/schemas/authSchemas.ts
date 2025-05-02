
import { z } from 'zod';

// Pour le formulaire de connexion
export const loginSchema = z.object({
	email: z.string().email({ message: 'Adresse email invalide.' }),
	password: z.string().min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères.' }),
});

export type LoginCredentials = z.infer<typeof loginSchema>;

// Pour le formulaire d'inscription (correspond au CreateUserDto backend)
// Note: Le service API usersApi.register utilisera ce type
export const registerSchema = z.object({
	firstName: z.string().min(1, { message: 'Le prénom est requis.' }).optional(),
	lastName: z.string().min(1, { message: 'Le nom est requis.' }).optional(),
	email: z.string().email({ message: 'Adresse email invalide.' }),
	password: z.string().min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères.' }),
	// Le rôle est défini par défaut côté backend, pas dans le formulaire d'inscription public
});

export type RegisterCredentials = z.infer<typeof registerSchema>;