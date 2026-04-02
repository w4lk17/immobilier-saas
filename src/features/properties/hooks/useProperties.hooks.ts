
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import propertiesService from '../services/propertiesApi';
import { PropertyFormData, PropertyUpdateFormData } from '../schemas/propertySchemas';
import { toast } from "sonner";
import { FrontendProperty, PropertyWithRelations } from '@/types';

export const PROPERTIES_QUERY_KEY = ['properties'];

// List queries
export function useProperties() {
	return useQuery<FrontendProperty[], Error>({
		queryKey: PROPERTIES_QUERY_KEY,
		queryFn: propertiesService.getAll,
		staleTime: 1000 * 60 * 5,
	});
}

export function usePropertiesWithRelations() {
	return useQuery<PropertyWithRelations[], Error>({
		queryKey: [...PROPERTIES_QUERY_KEY, 'with-relations'],
		queryFn: propertiesService.getAllWithRelations,
		staleTime: 1000 * 60 * 5,
	});
}

// Detail queries
export function useProperty(propertyId: number | null | undefined) {
	return useQuery<FrontendProperty, Error>({
		queryKey: [...PROPERTIES_QUERY_KEY, propertyId],
		queryFn: () => {
			if (!propertyId) throw new Error("ID de propriété invalide");
			return propertiesService.getById(propertyId);
		},
		enabled: !!propertyId,
		staleTime: 1000 * 60 * 5,
	});
}

export function usePropertyWithRelations(propertyId: number | null | undefined) {
	return useQuery<PropertyWithRelations, Error>({
		queryKey: [...PROPERTIES_QUERY_KEY, propertyId, 'with-relations'],
		queryFn: () => {
			if (!propertyId) throw new Error("ID de propriété invalide");
			return propertiesService.getByIdWithRelations(propertyId);
		},
		enabled: !!propertyId,
		staleTime: 1000 * 60 * 5,
	});
}

// Mutation hooks
export function useCreateProperty() {
	const queryClient = useQueryClient();
	return useMutation<PropertyWithRelations, Error, PropertyFormData>({
		mutationFn: (data: PropertyFormData) => propertiesService.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: PROPERTIES_QUERY_KEY });
			toast.success("Propriété créée avec succès !");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Erreur lors de la création de la propriété.");
		}
	});
}

export function useUpdateProperty() {
	const queryClient = useQueryClient();
	return useMutation<PropertyWithRelations, Error, { id: number; data: PropertyUpdateFormData }>({
		mutationFn: ({ id, data }) => propertiesService.update(id, data),
		onSuccess: (updatedProperty, variables) => {
			queryClient.invalidateQueries({ queryKey: PROPERTIES_QUERY_KEY });
			queryClient.setQueryData([...PROPERTIES_QUERY_KEY, variables.id], updatedProperty);
			toast.success("Propriété mise à jour avec succès !");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Erreur lors de la mise à jour de la propriété.");
		}
	});
}

export function useDeleteProperty() {
	const queryClient = useQueryClient();
	return useMutation<void, Error, number>({
		mutationFn: (id) => propertiesService.delete(id),
		onSuccess: (_, id) => {
			queryClient.invalidateQueries({ queryKey: PROPERTIES_QUERY_KEY });
			queryClient.invalidateQueries({ queryKey: ['contracts'] });
			queryClient.invalidateQueries({ queryKey: ['expenses'] });
			queryClient.removeQueries({ queryKey: [...PROPERTIES_QUERY_KEY, id] });
			toast.success(`Propriété supprimée avec succès !`);
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Erreur lors de la suppression de la propriété.");
		}
	});
}