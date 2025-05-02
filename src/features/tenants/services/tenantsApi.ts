
import api from '@/lib/api';
import { TenantFormData } from '../schemas/tenantSchemas'; // Schema à créer
import { FrontendTenant } from '@/types'; // Utiliser le type frontend

type TenantApiResponse = FrontendTenant; // Ajuster si l'API retourne plus/moins de détails

const tenantsService = {
	async getTenants(): Promise<TenantApiResponse[]> {
		const response = await api.get<TenantApiResponse[]>('/tenants');
		return response.data;
	},

	async getTenantById(id: number): Promise<TenantApiResponse> {
		const response = await api.get<TenantApiResponse>(`/tenants/${id}`);
		return response.data;
	},

	async createTenant(data: TenantFormData): Promise<TenantApiResponse> {
		const response = await api.post<TenantApiResponse>('/tenants', data);
		return response.data;
	},

	async updateTenant(id: number, data: Partial<TenantFormData>): Promise<TenantApiResponse> {
		const response = await api.patch<TenantApiResponse>(`/tenants/${id}`, data);
		return response.data;
	},

	async deleteTenant(id: number): Promise<TenantApiResponse> {
		const response = await api.delete<TenantApiResponse>(`/tenants/${id}`);
		return response.data;
	}
};

export default tenantsService;