
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import usersService from '../services/usersApi';
import { UserFormData } from '../schemas/userSchemas';
import { toast } from "sonner";
import { FrontendUserSnippet } from '@/types';

// Clé de requête de base pour les utilisateurs
export const USERS_QUERY_KEY = ['users'];

// Hook pour récupérer la liste de tous les utilisateurs (Admin)
export function useUsers() {
	return useQuery<FrontendUserSnippet[], Error>({
		queryKey: USERS_QUERY_KEY,
		queryFn: usersService.getUsers,
		staleTime: 1000 * 60 * 5, // Garder les données fraîches pendant 5 minutes
	});
}

// Hook pour récupérer un utilisateur spécifique par ID (Admin)
export function useUser(userId: number | null | undefined) {
	return useQuery<FrontendUserSnippet, Error>({
		queryKey: [...USERS_QUERY_KEY, userId], // Clé spécifique à l'utilisateur
		queryFn: () => {
			if (!userId) throw new Error("ID utilisateur invalide");
			return usersService.getUserById(userId);
		},
		enabled: !!userId, // N'exécute que si userId est fourni
	});
}

// Hook pour mettre à jour un utilisateur (Admin)
export function useUpdateUser() {
	const queryClient = useQueryClient();
	return useMutation<FrontendUserSnippet, Error, { id: number; data: Partial<UserFormData> }>({
		mutationFn: ({ id, data }) => usersService.updateUser(id, data),
		onSuccess: (updatedUser, variables) => {
			// Invalider la liste complète des utilisateurs
			queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
			// Mettre à jour directement le cache pour cet utilisateur spécifique (optionnel mais améliore l'UX)
			queryClient.setQueryData([...USERS_QUERY_KEY, variables.id], updatedUser);
			toast.success("Utilisateur mis à jour avec succès !");
		},
		onError: (error) => {
			toast.error(error.message || "Erreur lors de la mise à jour de l'utilisateur.");
		},
	});
}

// Hook pour supprimer un utilisateur (Admin)
export function useDeleteUser() {
	const queryClient = useQueryClient();
	return useMutation<FrontendUserSnippet, Error, number>({ // Prend l'ID comme variable
		mutationFn: (id) => usersService.deleteUser(id),
		onSuccess: (deletedUser, id) => {
			toast.success(`Utilisateur ${id} supprimé avec succès !`);
			// Invalider la liste complète
			queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
			// Optionnellement, supprimer la query de l'utilisateur spécifique du cache
			queryClient.removeQueries({ queryKey: [...USERS_QUERY_KEY, id] });
		},
		onError: (error) => {
			toast.error(error.message || "Erreur lors de la suppression de l'utilisateur.");
		},
	});
}

// Le hook pour l'inscription publique (register) pourrait être ici si vous préférez
// mais il est souvent appelé directement depuis le formulaire via authService/usersService.
// Exemple si on veut un hook :
// export function useRegisterUser() {
//   return useMutation<RegisterApiResponse, Error, RegisterCredentials>({
//     mutationFn: (data) => usersService.register(data),
//     // onSuccess/onError gérés dans le composant ou le hook useAuth
//   });
// }