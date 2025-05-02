
import api from '@/lib/api';
import { ContractFormData } from '../schemas/contractSchemas'; // Schema à créer
import { FrontendContract, ContractWithRelations } from '@/types'; // Importer les types frontend

const contractsService = {
	async getContracts(): Promise<ContractWithRelations[]> {
		const response = await api.get<ContractWithRelations[]>('/contracts');
		return response.data;
	},

	async getContractById(id: number): Promise<ContractWithRelations> {
		const response = await api.get<ContractWithRelations>(`/contracts/${id}`);
		return response.data;
	},

	async createContract(data: ContractFormData): Promise<FrontendContract> {
		const response = await api.post<FrontendContract>('/contracts', data);
		return response.data;
	},

	async updateContract(id: number, data: Partial<ContractFormData>): Promise<FrontendContract> {
		// Le DTO backend pour update est peut-être différent (UpdateContractDto)
		const response = await api.patch<FrontendContract>(`/contracts/${id}`, data);
		return response.data;
	},

	async deleteContract(id: number): Promise<FrontendContract> {
		const response = await api.delete<FrontendContract>(`/contracts/${id}`);
		return response.data;
	}
};

export default contractsService;