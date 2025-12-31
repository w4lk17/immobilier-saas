import { z } from 'zod';
import { UserRole } from '@/types/enums';

export const roleEnum = z.nativeEnum(UserRole);

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

export const UserCreateSchema = z.object({
	email: z.string().email({ message: 'Invalid email address' }),
	password: z.string().min(8, 'Password must be at least 8 characters').regex(passwordRegex, 'Password must include letters, numbers and a special character'),
	firstName: z.string().optional().nullable(),
	lastName: z.string().optional().nullable(),
});

export const UserUpdateSchema = z.object({
	email: z.string().email({ message: 'Invalid email address' }).optional(),
	role: roleEnum.optional(),
	firstName: z.string().optional().nullable(),
	lastName: z.string().optional().nullable(),
	isActive: z.boolean().optional(),
});

export const PasswordChangeSchema = z.object({
	oldPassword: z.string().min(1),
	newPassword: z.string().min(8).regex(passwordRegex, 'Password must include letters, numbers and a special character'),
});

export type UserCreateFormData = z.infer<typeof UserCreateSchema>;
export type UserUpdateFormData = z.infer<typeof UserUpdateSchema>;
export type PasswordChangeFormData = z.infer<typeof PasswordChangeSchema>;

export default {
	UserCreateSchema,
	UserUpdateSchema,
	PasswordChangeSchema,
};