import api from '@/lib/api';
import type { FrontendUser } from '@/types';
import type { UserCreateFormData, UserUpdateFormData, PasswordChangeFormData } from '../schemas/userSchemas';

export interface GetUsersParams {
	page?: number;
	perPage?: number;
	search?: string;
	role?: string;
}

// Base URL for users endpoint
const BASE = '/users';

export async function getUsers(params?: GetUsersParams) {
	try {
		const res = await api.get(`/users`, { params });
		// Expect API to return { data: FrontendUser[], total, page, perPage }
		return res.data as { data: FrontendUser[]; total?: number; page?: number; perPage?: number };
	} catch (error) {
		throw error;
	}
}

export async function getUserById(id: number) {
	try {
		const res = await api.get(`/users/${id}`);
		return res.data as FrontendUser;
	} catch (error) {
		throw error;
	}
}

export async function createUser(data: UserCreateFormData) {
	try {
		const res = await api.post('/users', data);
		return res.data as FrontendUser;
	} catch (error) {
		throw error;
	}
}

export async function updateUser(id: number, data: UserUpdateFormData) {
	try {
		const res = await api.patch(`/users/${id}`, data);
		return res.data as FrontendUser;
	} catch (error) {
		throw error;
	}
}

// Soft delete (mark inactive) by default
export async function deleteUser(id: number, hard = false) {
	try {
		if (hard) {
			const res = await api.delete(`/users/${id}`);
			return res.data;
		}
		const res = await api.patch(`/users/${id}`, { isActive: false });
		return res.data as FrontendUser;
	} catch (error) {
		throw error;
	}
}

export async function changeUserPassword(id: number, payload: PasswordChangeFormData) {
	try {
		const res = await api.post(`/users/${id}/change-password`, payload);
		return res.data;
	} catch (error) {
		throw error;
	}
}

export default {
	getUsers,
	getUserById,
	createUser,
	updateUser,
	deleteUser,
	changeUserPassword,
};
