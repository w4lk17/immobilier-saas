import api from "@/lib/api";
import { Rental, RentalWithRelations } from "@/types";
import { RentalFormData } from "../schemas/rentalSchemas";

const rentalsService = {
	// Basic list (minimal data)
	async getAll(): Promise<Rental[]> {
		const response = await api.get<Rental[]>("/rentals");
		return response.data;
	},

	// List with relations (for tables/displays)
	async getAllWithRelations(): Promise<RentalWithRelations[]> {
		const response = await api.get<RentalWithRelations[]>("/rentals?include=property,contracts");
		return response.data;
	},

	// Single record (basic)
	async getById(id: number): Promise<Rental> {
		const response = await api.get<Rental>(`/rentals/${id}`);
		return response.data;
	},

	// Single record (full relations for detail view)
	async getByIdWithRelations(id: number): Promise<RentalWithRelations> {
		const response = await api.get<RentalWithRelations>(`/rentals/${id}?include=property,contracts`);
		return response.data;
	},

	// CRUD operations
	async create(payload: RentalFormData): Promise<Rental> {
		const response = await api.post<Rental>("/rentals", payload);
		return response.data;
	},

	async update(id: number, payload: Partial<RentalFormData>): Promise<Rental> {
		const response = await api.patch<Rental>(`/rentals/${id}`, payload);
		return response.data;
	},

	async delete(id: number): Promise<void> {
		await api.delete(`/rentals/${id}`);
	},
};

export default rentalsService;
