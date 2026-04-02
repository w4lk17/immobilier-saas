
import api from '@/lib/api';
import { PaymentFormData, PaymentUpdateFormData } from '../schemas/paymentSchemas';
import { FrontendPayment, PaymentWithRelations } from '@/types';

const paymentsService = {
	// Basic list (minimal data)
	async getAll(): Promise<FrontendPayment[]> {
		const response = await api.get<FrontendPayment[]>('/payments');
		return response.data;
	},

	// List with relations (for tables/displays)
	async getAllWithRelations(): Promise<PaymentWithRelations[]> {
		const response = await api.get<PaymentWithRelations[]>('/payments?include=contract,tenant');
		return response.data;
	},

	// Single record (basic)
	async getById(id: number): Promise<FrontendPayment> {
		const response = await api.get<FrontendPayment>(`/payments/${id}`);
		return response.data;
	},

	// Single record (full relations for detail view)
	async getByIdWithRelations(id: number): Promise<PaymentWithRelations> {
		const response = await api.get<PaymentWithRelations>(`/payments/${id}?include=contract,tenant`);
		return response.data;
	},

	// CRUD operations
	async create(payload: PaymentFormData): Promise<PaymentWithRelations> {
		const response = await api.post<PaymentWithRelations>('/payments', payload);
		return response.data;
	},

	async update(id: number, payload: PaymentUpdateFormData): Promise<PaymentWithRelations> {
		const response = await api.patch<PaymentWithRelations>(`/payments/${id}`, payload);
		return response.data;
	},

	async delete(id: number): Promise<void> {
		await api.delete(`/payments/${id}`);
	},
};

export default paymentsService;