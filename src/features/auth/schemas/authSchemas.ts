import { z } from 'zod';

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

export const loginSchema = z.object({
	email: z.string().email({ message: 'Adresse email invalide.' }),
	password: z.string().min(8, 'Le mot de passe doit comporter au moins 8 caractères'),
});
export const registerSchema = z.object({
	email: z.string().email({ message: 'Adresse email invalide.' }),
	password: z.string().min(8, 'Le mot de passe doit comporter au moins 8 caractères')
		.regex(passwordRegex, 'Le mot de passe doit contenir des lettres, des chiffres et un caractère spécial'),
	firstName: z.string().optional().nullable(),
	lastName: z.string().optional().nullable(),
});

export type LoginCredentials = z.infer<typeof loginSchema>;
export type RegisterCredentials = z.infer<typeof registerSchema>;