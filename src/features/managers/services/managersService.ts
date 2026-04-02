
import api from '@/lib/api';
import { ManagerFormData, ManagerUpdateFormData } from '../schemas/managerSchemas';
import { Manager, ManagerWithUser, ManagerWithRelations } from '@/types';

const managersService = {
	// Basic list (minimal data)
	async getAll(): Promise<Manager[]> {
		const response = await api.get<Manager[]>('/managers');
		return response.data;
	},

	// List with user data (for tables/displays)
	async getAllWithUser(): Promise<ManagerWithUser[]> {
		const response = await api.get<ManagerWithUser[]>('/managers?include=user');
		return response.data;
	},

	// Single record (basic)
	async getById(id: number): Promise<Manager> {
		const response = await api.get<Manager>(`/managers/${id}`);
		return response.data;
	},

	// Single record (full relations for detail view)
	async getByIdWithRelations(id: number): Promise<ManagerWithRelations> {
		const response = await api.get<ManagerWithRelations>(`/managers/${id}?include=user,managedProperties,managedContracts`);
		return response.data;
	},


	async create(payload: ManagerFormData): Promise<ManagerWithUser> {
		const response = await api.post<ManagerWithUser>('/managers', payload);
		return response.data;
	},

	async update(id: number, payload: ManagerUpdateFormData): Promise<ManagerWithUser> {
		const response = await api.patch<ManagerWithUser>(`/managers/${id}`, payload);
		return response.data;
	},

	async delete(id: number): Promise<void> {
		await api.delete(`/managers/${id}`);
	},
};

export default managersService;