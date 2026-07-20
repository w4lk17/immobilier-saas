import { z } from 'zod';

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

export const LoginSchema = z.object({
	email: z.string().email( 'Adresse email invalide.'),
	password: z.string().min(1, 'Mot de passe requis'),
});
export const RegisterSchema = z.object({
	email: z.string().email({ message: 'Adresse email invalide.' }),
	password: z.string().min(8, 'Le mot de passe doit faire au moins 8 caractères'),
	firstName: z.string().min(1, 'Le prénom est requis'),
	lastName: z.string().min(1, 'Le nom est requis'),
	companyName: z.string().min(1, 'Le nom de l\'organisation est requis'),
	planSlug: z.string(), 
});

export type LoginCredentials = z.infer<typeof LoginSchema>;
export type RegisterCredentials = z.infer<typeof RegisterSchema>;