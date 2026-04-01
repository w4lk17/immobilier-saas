
import { z } from 'zod';

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

// Schéma de mise à jour du profil (Infos personnelles)
export const UpdateProfileSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis").optional(),
  lastName: z.string().min(1, "Le nom est requis").optional(),
  phoneNumber: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  civility: z.string().optional().nullable(),
  // On peut ajouter d'autres champs autorisés ici (workPlace, occupation...)
  // Mais pas de 'role' ni 'isActive' !
});

// Schéma de changement de mot de passe
export const ChangePasswordSchema = z.object({
  oldPassword: z.string().min(1, "L'ancien mot de passe est requis"),
  newPassword: z.string()
    .min(8, 'Le mot de passe doit faire au moins 8 caractères')
    .regex(passwordRegex, 'Le mot de passe doit contenir lettres, chiffres et un caractère spécial'),
  confirmPassword: z.string().min(8),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"], // L'erreur s'affichera sous le champ confirmPassword
});

export type UpdateProfileFormData = z.infer<typeof UpdateProfileSchema>;
export type ChangePasswordFormData = z.infer<typeof ChangePasswordSchema>;