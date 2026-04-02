
import api from '@/lib/api';
import { TenantFormData, TenantUpdateFormData } from '../schemas/tenantSchemas';
import { FrontendTenant, FrontendTenantWithUser, TenantWithRelations } from '@/types';

const tenantsService = {
	// Basic list (minimal data)
	async getAll(): Promise<FrontendTenant[]> {
		const response = await api.get<FrontendTenant[]>('/tenants');
		return response.data;
	},

	// List with user data (for tables/displays)
	async getAllWithUser(): Promise<FrontendTenantWithUser[]> {
		const response = await api.get<FrontendTenantWithUser[]>('/tenants?include=user');
		return response.data;
	},

	// Single record (basic)
	async getById(id: number): Promise<FrontendTenant> {
		const response = await api.get<FrontendTenant>(`/tenants/${id}`);
		return response.data;
	},

	// Single record (full relations for detail view)
	async getByIdWithRelations(id: number): Promise<TenantWithRelations> {
		const response = await api.get<TenantWithRelations>(`/tenants/${id}?include=user,contracts,payments`);
		return response.data;
	},

	// CRUD operations
	async create(payload: TenantFormData): Promise<FrontendTenantWithUser> {
		const response = await api.post<FrontendTenantWithUser>('/tenants', payload);
		return response.data;
	},

	async update(id: number, payload: TenantUpdateFormData): Promise<FrontendTenantWithUser> {
		const response = await api.patch<FrontendTenantWithUser>(`/tenants/${id}`, payload);
		return response.data;
	},

	async delete(id: number): Promise<void> {
		await api.delete(`/tenants/${id}`);
	},
};

export default tenantsService;