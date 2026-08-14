
import api from '@/lib/api';
import { InvoiceFormData, InvoiceUpdateFormData } from '../schemas/invoiceSchemas';
import { Invoice, InvoiceWithRelations } from '@/types';

const invoicesService = {
	// Basic list (minimal data)
	async getAll(): Promise<Invoice[]> {
		const response = await api.get<Invoice[]>('/invoices');
		return response.data;
	},

	// List with relations (for tables/displays)
	async getAllWithRelations(): Promise<InvoiceWithRelations[]> {
		const response = await api.get<InvoiceWithRelations[]>('/invoices?include=contract,tenant');
		return response.data;
	},

	// Single record (basic)
	async getById(id: number): Promise<Invoice> {
		const response = await api.get<Invoice>(`/invoices/${id}`);
		return response.data;
	},

	// Single record (full relations for detail view)
	async getByIdWithRelations(id: number): Promise<InvoiceWithRelations> {
		const response = await api.get<InvoiceWithRelations>(`/invoices/${id}?include=contract,tenant`);
		return response.data;
	},

	// CRUD operations
	async create(payload: InvoiceFormData): Promise<InvoiceWithRelations> {
		const response = await api.post<InvoiceWithRelations>('/invoices', payload);
		return response.data;
	},

	async update(id: number, payload: InvoiceUpdateFormData): Promise<InvoiceWithRelations> {
		const response = await api.patch<InvoiceWithRelations>(`/invoices/${id}`, payload);
		return response.data;
	},

	async delete(id: number): Promise<void> {
		await api.delete(`/invoices/${id}`);
	},
};

export default invoicesService;