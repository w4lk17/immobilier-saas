
import api from '@/lib/api';
import { EmployeeFormData } from '../schemas/employeeSchemas'; // Schema à créer
import { FrontendEmployee } from '@/types'; // Utiliser le type frontend

// L'API retourne probablement l'employé avec son utilisateur imbriqué simplifié
type EmployeeApiResponse = FrontendEmployee; // Ajuster si l'API retourne plus/moins de détails

const employeesService = {
	async getEmployees(): Promise<EmployeeApiResponse[]> {
		const response = await api.get<EmployeeApiResponse[]>('/employees');
		return response.data;
	},

	async getEmployeeById(id: number): Promise<EmployeeApiResponse> {
		const response = await api.get<EmployeeApiResponse>(`/employees/${id}`);
		return response.data;
	},

	async createEmployee(data: EmployeeFormData): Promise<EmployeeApiResponse> {
		const response = await api.post<EmployeeApiResponse>('/employees', data);
		return response.data;
	},

	async updateEmployee(id: number, data: Partial<EmployeeFormData>): Promise<EmployeeApiResponse> {
		const response = await api.patch<EmployeeApiResponse>(`/employees/${id}`, data);
		return response.data;
	},

	async deleteEmployee(id: number): Promise<EmployeeApiResponse> {
		const response = await api.delete<EmployeeApiResponse>(`/employees/${id}`);
		return response.data;
	}
};

export default employeesService;