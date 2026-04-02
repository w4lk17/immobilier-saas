
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
	deleteUser,
	getUserById,
	getUsers,
	updateUser,
	updateUserStatus,
} from "@/features/users/services/usersService";
import { UserUpdateSchema } from "@/features/users/schemas/userSchemas";
import { z } from "zod";
import { User } from "@/types";

export const USER_QUERY_KEYS = {
	all: ["users"],
	lists: () => [...USER_QUERY_KEYS.all, "list"],
	list: (filters?: Record<string, unknown>) => [...USER_QUERY_KEYS.lists(), filters],
	details: () => [...USER_QUERY_KEYS.all, "detail"],
	detail: (id: number) => [...USER_QUERY_KEYS.details(), id],
};

// Lister les users
export const useUsers = () => {
	return useQuery({
		queryKey: USER_QUERY_KEYS.list(),
		queryFn: () => getUsers(),
		staleTime: 5 * 60 * 1000,
	});
};

// Voir un user
export const useUser = (userId: number, enabled = true) => {
	return useQuery({
		queryKey: USER_QUERY_KEYS.detail(userId),
		queryFn: () => getUserById(userId),
		enabled,
	});
};

// Modifier un user (Admin corrige les infos)
export const useUpdateUser = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: number; data: z.infer<typeof UserUpdateSchema> }) =>
			updateUser(id, data),
		onSuccess: (_, variables) => {
			toast.success("Utilisateur mis à jour");
			queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
			queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.detail(variables.id) });
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || "Erreur lors de la mise à jour");
		},
	});
};

// Changer le statut (Switch Actif/Inactif)
export const useUpdateUserStatus = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
			updateUserStatus(id, isActive),

		// 1. ON MUTATE : Mise à jour optimiste (visuel immédiat)
		onMutate: async ({ id, isActive }) => {
			// Annule les requêtes en cours pour éviter de remplacer notre update
			await queryClient.cancelQueries({ queryKey: USER_QUERY_KEYS.lists() });

			// Capture l'état actuel pour pouvoir revenir en arrière si besoin
			const previousUsers = queryClient.getQueryData(USER_QUERY_KEYS.lists());

			// Met à jour le cache localement
			queryClient.setQueryData(USER_QUERY_KEYS.lists(), (old: User[] | undefined) => {
				if (!old) return [];
				return old.map((user) =>
					user.id === id ? { ...user, isActive } : user
				);
			});

			return { previousUsers };
		},

		// 2. ON ERROR : Si le serveur dit "Non", on revient en arrière
		onError: (err, variables, context) => {
			// Rollback : on remet l'ancienne liste
			if (context?.previousUsers) {
				queryClient.setQueryData(USER_QUERY_KEYS.lists(), context.previousUsers);
			}

			// Toast d'erreur
			toast.error("Erreur", {
				description: "Impossible de changer le statut.",
			});
		},

		// 3. ON SUCCESS : Tout s'est bien passé
		onSuccess: () => {
			// Toast de succès
			toast.success("Statut mis à jour", {
				description: "Le changement a été sauvegardé.",
			});
		},

		// 4. ON SETTLED : Dans tous les cas, on resync avec le serveur
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
		},
	});
};
// Supprimer un user
export const useDeleteUser = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => deleteUser(id),
		onSuccess: () => {
			toast.success("Utilisateur supprimé définitivement");
			queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || "Erreur lors de la suppression");
		},
	});
};