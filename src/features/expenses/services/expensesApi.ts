
import api from '@/lib/api';
import { ExpenseFormData } from '../schemas/expenseSchemas'; // Schema à créer
import { FrontendExpense, ExpenseWithRelations } from '@/types'; // Importer les types frontend

const expensesService = {
	async getExpenses(): Promise<ExpenseWithRelations[]> {
		// Ajouter des query params pour filtrer par propriété etc si nécessaire
		const response = await api.get<ExpenseWithRelations[]>('/expenses');
		return response.data;
	},

	async getExpenseById(id: number): Promise<ExpenseWithRelations> {
		const response = await api.get<ExpenseWithRelations>(`/expenses/${id}`);
		return response.data;
	},

	async createExpense(data: ExpenseFormData): Promise<FrontendExpense> {
		const response = await api.post<FrontendExpense>('/expenses', data);
		return response.data;
	},

	async updateExpense(id: number, data: Partial<ExpenseFormData>): Promise<FrontendExpense> {
		const response = await api.patch<FrontendExpense>(`/expenses/${id}`, data);
		return response.data;
	},

	async deleteExpense(id: number): Promise<FrontendExpense> {
		const response = await api.delete<FrontendExpense>(`/expenses/${id}`);
		return response.data;
	}
};

export default expensesService;