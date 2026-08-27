import { z } from 'zod';

const phoneSchema = z.string().regex(/^\+[1-9]\d{7,14}$/, 'Saisissez un numéro valide.');

export const LoginSchema = z.object({ phone: phoneSchema, password: z.string().min(1, 'Mot de passe requis') });
export const RegisterSchema = z.object({
  email: z.string().email({ message: 'Adresse email invalide.' }),
  password: z.string().min(6, 'Le mot de passe doit faire au moins 6 caractères'),
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom est requis'),
  phone: phoneSchema,
  companyName: z.string().min(1, "Le nom de l'organisation est requis"),
  planSlug: z.string(),
});
export const VerifyPhoneSchema = z.object({ phone: phoneSchema, code: z.string().regex(/^\d{6}$/, 'Le code doit comporter 6 chiffres.') });
export const ForgotPasswordSchema = z.object({ email: z.string().email('Adresse email invalide.') });
export const ResetPasswordSchema = z.object({ token: z.string().min(1, 'Lien de réinitialisation invalide.'), password: z.string().min(6, 'Le mot de passe doit faire au moins 6 caractères.'), confirmPassword: z.string() }).refine(({ password, confirmPassword }) => password === confirmPassword, { message: 'Les mots de passe ne correspondent pas.', path: ['confirmPassword'] });
export type LoginCredentials = z.infer<typeof LoginSchema>;
export type RegisterCredentials = z.infer<typeof RegisterSchema>;
export type VerifyPhoneCredentials = z.infer<typeof VerifyPhoneSchema>;
export type ForgotPasswordCredentials = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordCredentials = z.infer<typeof ResetPasswordSchema>;