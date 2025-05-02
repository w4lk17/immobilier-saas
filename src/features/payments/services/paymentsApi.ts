
import api from '@/lib/api';
import { PaymentFormData, UpdatePaymentFormData } from '../schemas/paymentSchemas'; // Schemas à créer
import { FrontendPayment, PaymentWithRelations } from '@/types'; // Importer les types frontend

const paymentsService = {
	async getPayments(): Promise<PaymentWithRelations[]> {
		// Ajouter des query params pour filtrer par contrat/tenant etc si nécessaire
		const response = await api.get<PaymentWithRelations[]>('/payments');
		return response.data;
	},

	async getPaymentById(id: number): Promise<PaymentWithRelations> {
		const response = await api.get<PaymentWithRelations>(`/payments/${id}`);
		return response.data;
	},

	async createPayment(data: PaymentFormData): Promise<FrontendPayment> {
		const response = await api.post<FrontendPayment>('/payments', data);
		return response.data;
	},

	// Utilise un type différent pour l'update (UpdatePaymentDto backend)
	async updatePayment(id: number, data: UpdatePaymentFormData): Promise<FrontendPayment> {
		const response = await api.patch<FrontendPayment>(`/payments/${id}`, data);
		return response.data;
	},

	async deletePayment(id: number): Promise<FrontendPayment> {
		const response = await api.delete<FrontendPayment>(`/payments/${id}`);
		return response.data;
	}
};

export default paymentsService;