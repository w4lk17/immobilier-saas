// src/features/users/services/usersService.ts
import api from '@/lib/api';
import type { User } from '@/types';
import type { UserUpdateFormData } from '../schemas/userSchemas';

export interface GetUsersParams {
	page?: number;
	perPage?: number;
	search?: string;
	role?: string;
}

const BASE = '/users';

// Lister les utilisateurs (Admin)
export async function getUsers(params?: GetUsersParams) {
	const res = await api.get(`${BASE}`, { params });
	return res.data as User[];
}

// Voir un utilisateur (Admin)
export async function getUserById(id: number) {
	const res = await api.get(`${BASE}/${id}`);
	return res.data as User;
}

// Modifier un utilisateur (Admin) - Ex: changer le nom, prénom
export async function updateUser(id: number, data: UserUpdateFormData) {
	const res = await api.patch(`${BASE}/${id}`, data);
	return res.data as User;
}

// Changer le statut Actif/Inactif (Admin)
export async function updateUserStatus(id: number, isActive: boolean) {
	const res = await api.patch(`${BASE}/${id}/status`, { isActive });
	return res.data as User;
}

// Supprimer définitivement (Admin)
export async function deleteUser(id: number) {
	const res = await api.delete(`${BASE}/${id}`);
	return res.data;
}

export default {
	getUsers,
	getUserById,
	updateUser,
	updateUserStatus,
	deleteUser,
};