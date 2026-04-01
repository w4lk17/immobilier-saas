
import api from '@/lib/api';
import { ContractFormData, ContractUpdateFormData } from '../schemas/contractSchemas';
import { Contract, ContractWithRelations } from '@/types';

const contractsService = {
	// Basic list (minimal data)
	async getAll(): Promise<Contract[]> {
		const response = await api.get<Contract[]>('/contracts');
		return response.data;
	},

	// List with relations (for tables/displays)
	async getAllWithRelations(): Promise<ContractWithRelations[]> {
		const response = await api.get<ContractWithRelations[]>('/contracts?include=property,tenant,manager');
		return response.data;
	},

	// Single record (basic)
	async getById(id: number): Promise<Contract> {
		const response = await api.get<Contract>(`/contracts/${id}`);
		return response.data;
	},

	// Single record (full relations for detail view)
	async getByIdWithRelations(id: number): Promise<ContractWithRelations> {
		const response = await api.get<ContractWithRelations>(`/contracts/${id}?include=property,tenant,manager`);
		return response.data;
	},

	// CRUD operations
	async create(payload: ContractFormData): Promise<ContractWithRelations> {
		const response = await api.post<ContractWithRelations>('/contracts', payload);
		return response.data;
	},

	async update(id: number, payload: ContractUpdateFormData): Promise<ContractWithRelations> {
		const response = await api.patch<ContractWithRelations>(`/contracts/${id}`, payload);
		return response.data;
	},

	async delete(id: number): Promise<void> {
		await api.delete(`/contracts/${id}`);
	},
};

export default contractsService;