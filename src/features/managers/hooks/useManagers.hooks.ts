import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from "sonner";
import { Manager, ManagerWithUser, ManagerWithRelations } from '@/types';
import managersService from '../services/managersService';
import { CreateManagerFormData, UpdateManagerFormData } from '../schemas/managerSchemas';

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
	return useMutation<ManagerWithUser, Error, CreateManagerFormData>({
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
	return useMutation<ManagerWithUser, Error, { id: number; data: UpdateManagerFormData }>({
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

// Changer le statut (Switch Actif/Inactif)
// export const useUpdateUserStatus = () => {
// 	const queryClient = useQueryClient();

// 	return useMutation({
// 		mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
// 			updateUserStatus(id, isActive),

// 		// 1. ON MUTATE : Mise à jour optimiste (visuel immédiat)
// 		onMutate: async ({ id, isActive }) => {
// 			// Annule les requêtes en cours pour éviter de remplacer notre update
// 			await queryClient.cancelQueries({ queryKey: MANAGERS_QUERY_KEY.lists() });

// 			// Capture l'état actuel pour pouvoir revenir en arrière si besoin
// 			const previousUsers = queryClient.getQueryData(MANAGERS_QUERY_KEY.lists());

// 			// Met à jour le cache localement
// 			queryClient.setQueryData(MANAGERS_QUERY_KEY.lists(), (old: User[] | undefined) => {
// 				if (!old) return [];
// 				return old.map((user) =>
// 					user.id === id ? { ...user, isActive } : user
// 				);
// 			});

// 			return { previousUsers };
// 		},

// 		// 2. ON ERROR : Si le serveur dit "Non", on revient en arrière
// 		onError: (err, variables, context) => {
// 			// Rollback : on remet l'ancienne liste
// 			if (context?.previousUsers) {
// 				queryClient.setQueryData(MANAGERS_QUERY_KEY.lists(), context.previousUsers);
// 			}

// 			// Toast d'erreur
// 			toast.error("Erreur", {
// 				description: "Impossible de changer le statut.",
// 			});
// 		},

// 		// 3. ON SUCCESS : Tout s'est bien passé
// 		onSuccess: () => {
// 			// Toast de succès
// 			toast.success("Statut mis à jour", {
// 				description: "Le changement a été sauvegardé.",
// 			});
// 		},

// 		// 4. ON SETTLED : Dans tous les cas, on resync avec le serveur
// 		onSettled: () => {
// 			queryClient.invalidateQueries({ queryKey: MANAGERS_QUERY_KEY.lists() });
// 		},
// 	});
// };

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