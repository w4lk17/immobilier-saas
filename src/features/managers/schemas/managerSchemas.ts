
import { z } from 'zod';
import { EmploymentType } from '@/types'; // Assure-toi que l'enum est dispo

// Regex validation mot de passe
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

// Schéma de base pour les infos User (réutilisable)
const userBaseSchema = z.object({
	email: z.string().email({ message: 'Adresse email invalide.' }),
	firstName: z.string().min(1, "Le nom est requis"),
	lastName: z.string().min(1, "Le prénom est requis"),
	phoneNumber: z.string().optional().nullable(),
	civility: z.string().optional().nullable(),
	dateOfBirth: z.string().optional().nullable(), // Date object for form
	address: z.string().optional().nullable(),
	workPlace: z.string().optional().nullable(),
	occupation: z.string().optional().nullable(),
	pictureUrl: z.string().optional().nullable(),
	identityDocumentNumber: z.string().optional().nullable(),
	identityDocumentType: z.string().optional().nullable(),
	identityDeliveryCity: z.string().optional().nullable(),
	identityDeliveryDate: z.string().optional().nullable(), // Date object for form
	identityExpiryDate: z.string().optional().nullable(), // Date object for form
	pacLastName: z.string().optional().nullable(),
	pacFirstName: z.string().optional().nullable(),
	pacPhoneNumber: z.string().optional().nullable(),
});

// 1. Schéma de CRÉATION (Admin crée un employé)
// On inclut le password et les champs Employee
export const CreateManagerSchema = userBaseSchema.extend({
	password: z.string().min(8, 'Le mot de passe doit comporter au moins 8 caractères')
		.regex(passwordRegex, "Doit contenir lettres, chiffres et caractère spécial"),

	// Champs spécifiques Manager
	position: z.string().min(1, "Le poste est requis"),
	employmentType: z.nativeEnum(EmploymentType).optional(),
	hireDate: z.string().optional().nullable(),
	terminationDate: z.string().optional().nullable(),
	
});

// 2. Schéma de MISE À JOUR
// On retire email/password (changés ailleurs). On garde tout le reste.
export const UpdateManagerSchema = userBaseSchema.extend({
	// On retire email/password de la modification directe ici
	email: z.undefined(), // ou supprimer la clé
	password: z.undefined(),

	// Champs spécifiques Manager
	position: z.string().optional(),
	employmentType: z.nativeEnum(EmploymentType).optional(),
	hireDate: z.string().optional().nullable(),
	terminationDate: z.string().optional().nullable(),
}).omit({ email: true, password: true }); // Propre

// Types dérivés
export type CreateManagerFormData = z.infer<typeof CreateManagerSchema>;
export type UpdateManagerFormData = z.infer<typeof UpdateManagerSchema>;