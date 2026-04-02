
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ownersService from '../services/ownersApi';
import { OwnerFormData, OwnerUpdateFormData } from '../schemas/ownerSchemas';
import { toast } from "sonner";
import { FrontendOwner, FrontendOwnerWithUser, OwnerWithRelations } from '@/types';

export const OWNERS_QUERY_KEY = ['owners'];

// List queries
export function useOwners() {
	return useQuery<FrontendOwner[], Error>({
		queryKey: OWNERS_QUERY_KEY,
		queryFn: ownersService.getAll,
		staleTime: 1000 * 60 * 5,
	});
}

export function useOwnersWithUser() {
	return useQuery<FrontendOwnerWithUser[], Error>({
		queryKey: [...OWNERS_QUERY_KEY, 'with-user'],
		queryFn: ownersService.getAllWithUser,
		staleTime: 1000 * 60 * 5,
	});
}

// Detail queries
export function useOwner(ownerId: number | null | undefined) {
	return useQuery<FrontendOwner, Error>({
		queryKey: [...OWNERS_QUERY_KEY, ownerId],
		queryFn: () => {
			if (!ownerId) throw new Error("ID propriétaire invalide");
			return ownersService.getById(ownerId);
		},
		enabled: !!ownerId,
		staleTime: 1000 * 60 * 5,
	});
}

export function useOwnerWithRelations(ownerId: number | null | undefined) {
	return useQuery<OwnerWithRelations, Error>({
		queryKey: [...OWNERS_QUERY_KEY, ownerId, 'with-relations'],
		queryFn: () => {
			if (!ownerId) throw new Error("ID propriétaire invalide");
			return ownersService.getByIdWithRelations(ownerId);
		},
		enabled: !!ownerId,
		staleTime: 1000 * 60 * 5,
	});
}

// Mutation hooks
export function useCreateOwner() {
	const queryClient = useQueryClient();
	return useMutation<FrontendOwnerWithUser, Error, OwnerFormData>({
		mutationFn: (data) => ownersService.create(data),
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
	return useMutation<FrontendOwnerWithUser, Error, { id: number; data: OwnerUpdateFormData }>({
		mutationFn: ({ id, data }) => ownersService.update(id, data),
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
	return useMutation<void, Error, number>({
		mutationFn: (id) => ownersService.delete(id),
		onSuccess: (_, id) => {
			toast.success(`Profil propriétaire supprimé avec succès !`);
			queryClient.invalidateQueries({ queryKey: OWNERS_QUERY_KEY });
			queryClient.invalidateQueries({ queryKey: ['properties'] });
			queryClient.removeQueries({ queryKey: [...OWNERS_QUERY_KEY, id] });
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Erreur lors de la suppression du profil propriétaire.");
		},
	});
}