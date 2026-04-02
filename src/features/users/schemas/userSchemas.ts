import { z } from 'zod';

export const UserUpdateSchema = z.object({
	firstName: z.string().min(1, "Le prénom est requis").optional(),
	lastName: z.string().min(1, "Le nom est requis").optional(),
	phoneNumber: z.string().optional().nullable(),
	address: z.string().optional().nullable(),
});

export type UserUpdateFormData = z.infer<typeof UserUpdateSchema>;