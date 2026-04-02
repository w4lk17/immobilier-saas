import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ManagerFormData, ManagerUpdateFormData } from '../schemas/managerSchemas';
import { toast } from "sonner";
import { Manager, ManagerWithUser, ManagerWithRelations } from '@/types';
import managersService from '../services/managersService';

export const MANAGERS_QUERY_KEY = ['managers'];

// List queries
export function useManagers() {
	return useQuery<Manager[], Error>({
		queryKey: MANAGERS_QUERY_KEY,
		queryFn: managersService.getAll,
		staleTime: 1000 * 60 * 5,
	});
}

export function useManagersWithUser() {
	return useQuery<ManagerWithUser[], Error>({
		queryKey: [...MANAGERS_QUERY_KEY, 'with-user'],
		queryFn: managersService.getAllWithUser,
		staleTime: 1000 * 60 * 5,
	});
}

// Detail queries
export function useManager(managerId: number | null | undefined) {
	return useQuery<Manager, Error>({
		queryKey: [...MANAGERS_QUERY_KEY, managerId],
		queryFn: () => {
			if (!managerId) throw new Error("ID employé invalide");
			return managersService.getById(managerId);
		},
		enabled: !!managerId,
		staleTime: 1000 * 60 * 5,
	});
}

export function useManagerWithRelations(managerId: number | null | undefined) {
	return useQuery<ManagerWithRelations, Error>({
		queryKey: [...MANAGERS_QUERY_KEY, managerId, 'with-relations'],
		queryFn: () => {
			if (!managerId) throw new Error("ID employé invalide");
			return managersService.getByIdWithRelations(managerId);
		},
		enabled: !!managerId,
		staleTime: 1000 * 60 * 5,
	});
}

// Mutation hooks
export function useCreateManager() {
	const queryClient = useQueryClient();
	return useMutation<ManagerWithUser, Error, ManagerFormData>({
		mutationFn: (data) => managersService.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: MANAGERS_QUERY_KEY });
			toast.success("Profil employé créé avec succès !");
		},
		onError: (error: any) => {
			toast.error(
				"Erreur lors de la création du profil employé.",
				error.response?.data?.message);
		},
	});
}

export function useUpdateManager() {
	const queryClient = useQueryClient();
	return useMutation<ManagerWithUser, Error, { id: number; data: ManagerUpdateFormData }>({
		mutationFn: ({ id, data }) => managersService.update(id, data),
		onSuccess: (updatedManager, variables) => {
			queryClient.invalidateQueries({ queryKey: MANAGERS_QUERY_KEY });
			queryClient.setQueryData([...MANAGERS_QUERY_KEY, variables.id], updatedManager);
			toast.success("Profil employé mis à jour avec succès !");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Erreur lors de la mise à jour du profil employé.");
		},
	});
}

export function useDeleteManager() {
	const queryClient = useQueryClient();
	return useMutation<void, Error, number>({
		mutationFn: (id) => managersService.delete(id),
		onSuccess: (_, id) => {
			toast.success(`Profil employé supprimé avec succès !`);
			queryClient.invalidateQueries({ queryKey: MANAGERS_QUERY_KEY });
			queryClient.removeQueries({ queryKey: [...MANAGERS_QUERY_KEY, id] });
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Erreur lors de la suppression du profil employé.");
		},
	});
}