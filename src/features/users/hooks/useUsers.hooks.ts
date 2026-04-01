import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
	changeUserPassword,
	createUser,
	deleteUser,
	getUserById,
	getUsers,
	updateUser,
} from "@/features/users/services/usersService";
import {
	PasswordChangeSchema,
	UserCreateSchema,
	UserUpdateSchema,
} from "@/features/users/schemas/userSchemas";
import { z } from "zod";

// Query key factory
export const USER_QUERY_KEYS = {
	all: ["users"],
	lists: () => [...USER_QUERY_KEYS.all, "list"],
	list: (filters?: Record<string, unknown>) => [...USER_QUERY_KEYS.lists(), filters],
	details: () => [...USER_QUERY_KEYS.all, "detail"],
	detail: (id: number) => [...USER_QUERY_KEYS.details(), id],
};

// Query hook for all users
export const useUsers = () => {
	return useQuery({
		queryKey: USER_QUERY_KEYS.list(),
		queryFn: () => getUsers(),
		staleTime: 5 * 60 * 1000, // 5 minutes
		retry: 2,
	});
};

// Query hook for single user
export const useUser = (userId: number, enabled = true) => {
	return useQuery({
		queryKey: USER_QUERY_KEYS.detail(userId),
		queryFn: () => getUserById(userId),
		enabled,
		staleTime: 5 * 60 * 1000,
		retry: 2,
	});
};

// Mutation hook for creating user
export const useCreateUser = () => {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationFn: (data: z.infer<typeof UserCreateSchema>) => createUser(data),
		onSuccess: () => {
			toast.success("Utilisateur créé avec succès");
			queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
			router.push("/users");
		},
		onError: (error: any) => {
			toast.error(error?.message || "Erreur lors de la création");
		},
	});
};

// Mutation hook for updating user
export const useUpdateUser = () => {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationFn: ({ id, data }: { id: number; data: z.infer<typeof UserUpdateSchema> }) =>
			updateUser(id, data),
		onSuccess: (_, variables) => {
			toast.success("Utilisateur mis à jour avec succès");
			queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
			queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.detail(variables.id) });
			router.push("/users");
		},
		onError: (error: any) => {
			toast.error(error?.message || "Erreur lors de la mise à jour");
		},
	});
};

// Mutation hook for deleting user
export const useDeleteUser = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => deleteUser(id),
		onSuccess: () => {
			toast.success("Utilisateur supprimé avec succès");
			queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() });
		},
		onError: (error: any) => {
			toast.error(error?.message || "Erreur lors de la suppression");
		},
	});
};

// Mutation hook for changing password
export const useChangePassword = () => {
	return useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: number;
			data: z.infer<typeof PasswordChangeSchema>;
		}) => changeUserPassword(id, data),
		onSuccess: () => {
			toast.success("Mot de passe changé avec succès");
		},
		onError: (error: any) => {
			toast.error(error?.message || "Erreur lors du changement de mot de passe");
		},
	});
};
