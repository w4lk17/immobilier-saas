import api from '@/lib/api';
import { TenantFormData, TenantUpdateFormData } from '../schemas/tenantSchemas';
import { FrontendTenant, TenantWithRelations, User } from '@/types';


const BASE = '/tenants';

const tenantsService = {
	// Liste les locataires de MON organisation
	async getAll(): Promise<FrontendTenant[]> {
		const res = await api.get<FrontendTenant[]>(`${BASE}`);
		return res.data;
	},

	// Détails
	async getById(id: number): Promise<FrontendTenant> {
		const res = await api.get<FrontendTenant>(`${BASE}/${id}`);
		return res.data;
	},

	// Création (envoie toutes les données user + tenant)
	async create(data: TenantFormData): Promise<FrontendTenant> {
		const res = await api.post<FrontendTenant>(`${BASE}`, data);
		return res.data;
	},

	// Mise à jour
	async update(id: number, data: TenantUpdateFormData): Promise<FrontendTenant> {
		const res = await api.patch<FrontendTenant>(`${BASE}/${id}`, data);
		return res.data;
	},

	// Suppression (soft delete)
	async delete(id: number) {
		const res = await api.delete(`${BASE}/${id}`);
		return res.data;
	},

	// Changer le statut Actif/Inactif (Admin)
	async updateTenantStatus(id: number, isActive: boolean) {
		const res = await api.patch(`${BASE}/${id}/status`, { isActive });
		return res.data as User;
	},

	// Single record (full relations for detail view)
	async getByIdWithRelations(id: number): Promise<TenantWithRelations> {
		const res = await api.get<TenantWithRelations>(`${BASE}/${id}?include=user,contracts,payments`);
		return res.data;
	},
};

export default tenantsService;

