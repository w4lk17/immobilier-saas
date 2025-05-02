
import api from '@/lib/api';
import { OwnerFormData } from '../schemas/ownerSchemas'; // Schema à créer
import { FrontendOwner } from '@/types'; // Utiliser le type frontend

type OwnerApiResponse = FrontendOwner; // Ajuster si l'API retourne plus/moins de détails

const ownersService = {
	async getOwners(): Promise<OwnerApiResponse[]> {
		const response = await api.get<OwnerApiResponse[]>('/owners');
		return response.data;
	},

	async getOwnerById(id: number): Promise<OwnerApiResponse> {
		const response = await api.get<OwnerApiResponse>(`/owners/${id}`);
		return response.data;
	},

	async createOwner(data: OwnerFormData): Promise<OwnerApiResponse> {
		const response = await api.post<OwnerApiResponse>('/owners', data);
		return response.data;
	},

	async updateOwner(id: number, data: Partial<OwnerFormData>): Promise<OwnerApiResponse> {
		const response = await api.patch<OwnerApiResponse>(`/owners/${id}`, data);
		return response.data;
	},

	async deleteOwner(id: number): Promise<OwnerApiResponse> {
		const response = await api.delete<OwnerApiResponse>(`/owners/${id}`);
		return response.data;
	}
};

export default ownersService;