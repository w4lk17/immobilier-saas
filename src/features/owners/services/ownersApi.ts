
import api from '@/lib/api';
import { OwnerFormData, OwnerUpdateFormData } from '../schemas/ownerSchemas';
import { FrontendOwner, FrontendOwnerWithUser, OwnerWithRelations } from '@/types';

const ownersService = {
	// Basic list (minimal data)
	async getAll(): Promise<FrontendOwner[]> {
		const response = await api.get<FrontendOwner[]>('/owners');
		return response.data;
	},

	// List with user data (for tables/displays)
	async getAllWithUser(): Promise<FrontendOwnerWithUser[]> {
		const response = await api.get<FrontendOwnerWithUser[]>('/owners?include=user');
		return response.data;
	},

	// Single record (basic)
	async getById(id: number): Promise<FrontendOwner> {
		const response = await api.get<FrontendOwner>(`/owners/${id}`);
		return response.data;
	},

	// Single record (full relations for detail view)
	async getByIdWithRelations(id: number): Promise<OwnerWithRelations> {
		const response = await api.get<OwnerWithRelations>(`/owners/${id}?include=user,properties`);
		return response.data;
	},

	// CRUD operations
	async create(payload: OwnerFormData): Promise<FrontendOwnerWithUser> {
		const response = await api.post<FrontendOwnerWithUser>('/owners', payload);
		return response.data;
	},

	async update(id: number, payload: OwnerUpdateFormData): Promise<FrontendOwnerWithUser> {
		const response = await api.patch<FrontendOwnerWithUser>(`/owners/${id}`, payload);
		return response.data;
	},

	async delete(id: number): Promise<void> {
		await api.delete(`/owners/${id}`);
	},
};

export default ownersService;