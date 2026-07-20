import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { PROPERTIES_QUERY_KEY } from "@/features/properties/hooks/useProperties.hooks";
import { RentalFormData } from "../schemas/rentalSchemas";
import rentalsService from "../services/rentalsApi";
import { Rental, RentalWithRelations } from "@/types";

export const RENTALS_QUERY_KEY = ["rentals"];

// List queries
export function useRentals() {
	return useQuery<Rental[], Error>({
		queryKey: RENTALS_QUERY_KEY,
		queryFn: rentalsService.getAll,
		staleTime: 1000 * 60 * 5,
	});
}

export function useRentalsWithRelations() {
	return useQuery<RentalWithRelations[], Error>({
		queryKey: [...RENTALS_QUERY_KEY, "with-relations"],
		queryFn: rentalsService.getAllWithRelations,
		staleTime: 1000 * 60 * 5,
	});
}

// Detail queries
export function useRental(rentalId: number | null | undefined) {
	return useQuery<Rental, Error>({
		queryKey: [...RENTALS_QUERY_KEY, rentalId],
		queryFn: () => {
			if (!rentalId) throw new Error("ID de local invalide");
			return rentalsService.getById(rentalId);
		},
		enabled: !!rentalId,
		staleTime: 1000 * 60 * 5,
	});
}

export function useRentalWithRelations(rentalId: number | null | undefined) {
	return useQuery<RentalWithRelations, Error>({
		queryKey: [...RENTALS_QUERY_KEY, rentalId, "with-relations"],
		queryFn: () => {
			if (!rentalId) throw new Error("ID de local invalide");
			return rentalsService.getByIdWithRelations(rentalId);
		},
		enabled: !!rentalId,
		staleTime: 1000 * 60 * 5,
	});
}

// Mutations
export function useCreateRental() {
	const queryClient = useQueryClient();

	return useMutation<Rental, Error, RentalFormData>({
		mutationFn: (data: RentalFormData) => rentalsService.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: RENTALS_QUERY_KEY });
			queryClient.invalidateQueries({ queryKey: PROPERTIES_QUERY_KEY });
			toast.success("Local créé avec succès !");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Erreur lors de la création du local.");
		},
	});
}

export function useUpdateRental() {
	const queryClient = useQueryClient();

	return useMutation<Rental, Error, { id: number; data: Partial<RentalFormData> }>({
		mutationFn: ({ id, data }) => rentalsService.update(id, data),
		onSuccess: (updatedRental, variables) => {
			queryClient.invalidateQueries({ queryKey: RENTALS_QUERY_KEY });
			queryClient.invalidateQueries({ queryKey: PROPERTIES_QUERY_KEY });
			queryClient.setQueryData([...RENTALS_QUERY_KEY, variables.id], updatedRental);
			toast.success("Local mis à jour avec succès !");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Erreur lors de la mise à jour du local.");
		},
	});
}

export function useDeleteRental() {
	const queryClient = useQueryClient();

	return useMutation<void, Error, number>({
		mutationFn: (id) => rentalsService.delete(id),
		onSuccess: (_, id) => {
			queryClient.invalidateQueries({ queryKey: RENTALS_QUERY_KEY });
			queryClient.invalidateQueries({ queryKey: PROPERTIES_QUERY_KEY });
			queryClient.invalidateQueries({ queryKey: ["contracts"] });
			queryClient.removeQueries({ queryKey: [...RENTALS_QUERY_KEY, id] });
			toast.success("Local supprimé avec succès !");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Erreur lors de la suppression du local.");
		},
	});
}
