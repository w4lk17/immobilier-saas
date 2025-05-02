
import api from '@/lib/api';
import { PropertyFormData } from '../schemas/propertySchemas'; // Assurez-vous que ce fichier existe
import { FrontendProperty, PropertyWithRelations } from '@/types'; // Importer les types frontend

const propertiesService = {
	// Les GET retournent potentiellement les relations
	async getProperties(): Promise<PropertyWithRelations[]> {
		const response = await api.get<PropertyWithRelations[]>('/properties');
		return response.data;
	},

	async getPropertyById(id: number): Promise<PropertyWithRelations> {
		const response = await api.get<PropertyWithRelations>(`/properties/${id}`);
		return response.data;
	},

	// Les mutations retournent généralement l'objet de base mis à jour/créé/supprimé
	async createProperty(data: PropertyFormData): Promise<FrontendProperty> {
		const response = await api.post<FrontendProperty>('/properties', data);
		return response.data;
	},

	async updateProperty(id: number, data: Partial<PropertyFormData>): Promise<FrontendProperty> {
		const response = await api.patch<FrontendProperty>(`/properties/${id}`, data);
		return response.data;
	},

	async deleteProperty(id: number): Promise<FrontendProperty> {
		const response = await api.delete<FrontendProperty>(`/properties/${id}`);
		return response.data;
	}
};
export default propertiesService;