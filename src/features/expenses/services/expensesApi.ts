
import api from '@/lib/api';
import { ExpenseFormData, ExpenseUpdateFormData } from '../schemas/expenseSchemas';
import { FrontendExpense, ExpenseWithRelations } from '@/types';

const expensesService = {
	// Basic list (minimal data)
	async getAll(): Promise<FrontendExpense[]> {
		const response = await api.get<FrontendExpense[]>('/expenses');
		return response.data;
	},

	// List with relations (for tables/displays)
	async getAllWithRelations(): Promise<ExpenseWithRelations[]> {
		const response = await api.get<ExpenseWithRelations[]>('/expenses?include=property');
		return response.data;
	},

	// Single record (basic)
	async getById(id: number): Promise<FrontendExpense> {
		const response = await api.get<FrontendExpense>(`/expenses/${id}`);
		return response.data;
	},

	// Single record (full relations for detail view)
	async getByIdWithRelations(id: number): Promise<ExpenseWithRelations> {
		const response = await api.get<ExpenseWithRelations>(`/expenses/${id}?include=property`);
		return response.data;
	},

	// CRUD operations
	async create(payload: ExpenseFormData): Promise<ExpenseWithRelations> {
		const response = await api.post<ExpenseWithRelations>('/expenses', payload);
		return response.data;
	},

	async update(id: number, payload: ExpenseUpdateFormData): Promise<ExpenseWithRelations> {
		const response = await api.patch<ExpenseWithRelations>(`/expenses/${id}`, payload);
		return response.data;
	},

	async delete(id: number): Promise<void> {
		await api.delete(`/expenses/${id}`);
	},
};

export default expensesService;