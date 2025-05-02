
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ownersService from '../services/ownersApi';
import { OwnerFormData, OwnerUpdateFormData } from '../schemas/ownerSchemas';
import toast from 'react-hot-toast';
import { FrontendOwner } from '@/types';

export const OWNERS_QUERY_KEY = ['owners'];

export function useOwners() {
	return useQuery<FrontendOwner[], Error>({
		queryKey: OWNERS_QUERY_KEY,
		queryFn: ownersService.getOwners,
		staleTime: 1000 * 60 * 5,
	});
}

export function useOwner(ownerId: number | null | undefined) {
	return useQuery<FrontendOwner, Error>({
		queryKey: [...OWNERS_QUERY_KEY, ownerId],
		queryFn: () => {
			if (!ownerId) throw new Error("ID propriétaire invalide");
			return ownersService.getOwnerById(ownerId);
		},
		enabled: !!ownerId,
	});
}

export function useCreateOwner() {
	const queryClient = useQueryClient();
	return useMutation<FrontendOwner, Error, OwnerFormData>({
		mutationFn: (data) => ownersService.createOwner(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: OWNERS_QUERY_KEY });
			toast.success("Profil propriétaire créé avec succès !");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Erreur lors de la création du profil propriétaire.");
		},
	});
}

export function useUpdateOwner() {
	const queryClient = useQueryClient();
	return useMutation<FrontendOwner, Error, { id: number; data: OwnerUpdateFormData }>({
		mutationFn: ({ id, data }) => ownersService.updateOwner(id, data),
		onSuccess: (updatedOwner, variables) => {
			queryClient.invalidateQueries({ queryKey: OWNERS_QUERY_KEY });
			queryClient.setQueryData([...OWNERS_QUERY_KEY, variables.id], updatedOwner);
			toast.success("Profil propriétaire mis à jour avec succès !");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Erreur lors de la mise à jour du profil propriétaire.");
		},
	});
}

export function useDeleteOwner() {
	const queryClient = useQueryClient();
	return useMutation<FrontendOwner, Error, number>({
		mutationFn: (id) => ownersService.deleteOwner(id),
		onSuccess: (deletedOwner, id) => {
			toast.success(`Profil propriétaire ${id} supprimé avec succès !`);
			queryClient.invalidateQueries({ queryKey: OWNERS_QUERY_KEY });
			// Invalider aussi les propriétés si nécessaire (ou le backend gère cascade?)
			queryClient.invalidateQueries({ queryKey: ['properties'] });
			queryClient.removeQueries({ queryKey: [...OWNERS_QUERY_KEY, id] });
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Erreur lors de la suppression du profil propriétaire.");
		},
	});
}