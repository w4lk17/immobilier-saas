
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import propertiesService from '../services/propertiesApi';
import { PropertyFormData, PropertyUpdateFormData } from '../schemas/propertySchemas';
import { toast } from "sonner";
import { FrontendProperty, PropertyWithRelations } from '@/types';

export const PROPERTIES_QUERY_KEY = ['properties'];

// Hook pour récupérer la liste des propriétés (avec relations)
export function useProperties() {
	return useQuery<PropertyWithRelations[], Error>({
		queryKey: PROPERTIES_QUERY_KEY,
		queryFn: propertiesService.getProperties,
		staleTime: 1000 * 60 * 2, // Cache un peu moins longtemps peut-être
	});
}

// Hook pour récupérer une propriété spécifique par ID (avec relations)
export function useProperty(propertyId: number | null | undefined) {
	return useQuery<PropertyWithRelations, Error>({
		queryKey: [...PROPERTIES_QUERY_KEY, propertyId],
		queryFn: () => {
			if (!propertyId) throw new Error("ID de propriété invalide");
			return propertiesService.getPropertyById(propertyId);
		},
		enabled: !!propertyId, // N'exécute que si propertyId a une valeur
	});
}

// Hook pour créer une propriété
export function useCreateProperty() {
	const queryClient = useQueryClient();
	return useMutation<FrontendProperty, Error, PropertyFormData>({
		mutationFn: (data: PropertyFormData) => propertiesService.createProperty(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: PROPERTIES_QUERY_KEY });
			toast.success("Propriété créée avec succès !");
			// Redirection ou fermeture de modal gérée dans le composant appelant
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Erreur lors de la création de la propriété.");
		}
	});
}

// Hook pour mettre à jour une propriété
export function useUpdateProperty() {
	const queryClient = useQueryClient();
	return useMutation<FrontendProperty, Error, { id: number; data: PropertyUpdateFormData }>({
		mutationFn: ({ id, data }) => propertiesService.updateProperty(id, data),
		onSuccess: (updatedProperty, variables) => {
			queryClient.invalidateQueries({ queryKey: PROPERTIES_QUERY_KEY });
			queryClient.setQueryData([...PROPERTIES_QUERY_KEY, variables.id], updatedProperty); // Met à jour le cache détail
			toast.success("Propriété mise à jour avec succès !");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Erreur lors de la mise à jour de la propriété.");
		}
	});
}

// Hook pour supprimer une propriété
export function useDeleteProperty() {
	const queryClient = useQueryClient();
	return useMutation<FrontendProperty, Error, number>({
		mutationFn: (id) => propertiesService.deleteProperty(id),
		onSuccess: (deletedProperty, id) => {
			toast.success(`Propriété ${id} supprimée avec succès !`);
			queryClient.invalidateQueries({ queryKey: PROPERTIES_QUERY_KEY });
			// Invalider aussi contrats et dépenses liés potentiellement
			queryClient.invalidateQueries({ queryKey: ['contracts'] });
			queryClient.invalidateQueries({ queryKey: ['expenses'] });
			queryClient.removeQueries({ queryKey: [...PROPERTIES_QUERY_KEY, id] });
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Erreur lors de la suppression de la propriété.");
		}
	});
}