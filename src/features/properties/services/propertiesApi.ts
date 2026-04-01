
import api from '@/lib/api';
import { PropertyFormData, PropertyUpdateFormData } from '../schemas/propertySchemas';
import { FrontendProperty, PropertyWithRelations } from '@/types';

const propertiesService = {
	// Basic list (minimal data)
	async getAll(): Promise<FrontendProperty[]> {
		const response = await api.get<FrontendProperty[]>('/properties');
		return response.data;
	},

	// List with relations (for tables/displays)
	async getAllWithRelations(): Promise<PropertyWithRelations[]> {
		const response = await api.get<PropertyWithRelations[]>('/properties?include=owner,manager');
		return response.data;
	},

	// Single record (basic)
	async getById(id: number): Promise<FrontendProperty> {
		const response = await api.get<FrontendProperty>(`/properties/${id}`);
		return response.data;
	},

	// Single record (full relations for detail view)
	async getByIdWithRelations(id: number): Promise<PropertyWithRelations> {
		const response = await api.get<PropertyWithRelations>(`/properties/${id}?include=owner,manager`);
		return response.data;
	},

	// CRUD operations
	async create(payload: PropertyFormData): Promise<PropertyWithRelations> {
		const response = await api.post<PropertyWithRelations>('/properties', payload);
		return response.data;
	},

	async update(id: number, payload: PropertyUpdateFormData): Promise<PropertyWithRelations> {
		const response = await api.patch<PropertyWithRelations>(`/properties/${id}`, payload);
		return response.data;
	},

	async delete(id: number): Promise<void> {
		await api.delete(`/properties/${id}`);
	},
};

export default propertiesService;