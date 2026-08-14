// features/tenants/hooks/useTenants.hooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import tenantsService from '../services/tenantsApi';
import { TenantFormData, TenantUpdateFormData } from '../schemas/tenantSchemas';
import { toast } from "sonner";
import { FrontendTenant, User } from '@/types';

export const TENANT_QUERY_KEY = {
	all: ["tenants"],
	lists: () => [...TENANT_QUERY_KEY.all, "list"],
	list: (filters?: Record<string, unknown>) => [...TENANT_QUERY_KEY.lists(), filters],
	details: () => [...TENANT_QUERY_KEY.all, "detail"],
	detail: (id: number | null | undefined) => [...TENANT_QUERY_KEY.details(), id],
};


// Lister les tenats
export const useTenants = () => {
	return useQuery<FrontendTenant[], Error>({
		queryKey: TENANT_QUERY_KEY.lists(),
		queryFn: tenantsService.getAll,
		staleTime: 5 * 60 * 1000,
	});
};


// Voir un tenant
export const useTenant = (id: number | null | undefined, enabled = true) => {
	return useQuery<FrontendTenant, Error>({
		queryKey: TENANT_QUERY_KEY.detail(id),
		queryFn: () => {
			if (!id) throw new Error("ID locataire invalide");
			return tenantsService.getById(id);
		},
		enabled: enabled && !!id,
	});
};

export const useCreateTenant = () => {
	const queryClient = useQueryClient();
	return useMutation<FrontendTenant, Error, TenantFormData>({
		mutationFn: (data: TenantFormData) => tenantsService.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: TENANT_QUERY_KEY.lists() });
			// toast.success("Locataire créé avec succès. Un email lui a été envoyé.");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Erreur lors de la création.");
		},
	});
}

// Modifier un tenant 
export const useUpdateTenant = () => {
	const queryClient = useQueryClient();

	return useMutation<FrontendTenant, Error, { id: number; data: TenantUpdateFormData }>({
		mutationFn: ({ id, data }: { id: number; data: TenantUpdateFormData }) =>
			tenantsService.update(id, data),
		onSuccess: (_, variables) => {
			toast.success("Locataire mis à jour");
			queryClient.invalidateQueries({ queryKey: TENANT_QUERY_KEY.lists() });
			queryClient.invalidateQueries({ queryKey: TENANT_QUERY_KEY.detail(variables.id) });
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || "Erreur lors de la mise à jour");
		},
	});
};

// Changer le statut (Switch Actif/Inactif)
export const useUpdateTenantStatus = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
			tenantsService.updateTenantStatus(id, isActive),

		// 1. ON MUTATE : Mise à jour optimiste (visuel immédiat)
		onMutate: async ({ id, isActive }) => {
			// Annule les requêtes en cours pour éviter de remplacer notre update
			await queryClient.cancelQueries({ queryKey: TENANT_QUERY_KEY.lists() });

			// Capture l'état actuel pour pouvoir revenir en arrière si besoin
			const previousUsers = queryClient.getQueryData(TENANT_QUERY_KEY.lists());

			// Met à jour le cache localement
			queryClient.setQueryData(TENANT_QUERY_KEY.lists(), (old: User[] | undefined) => {
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
				queryClient.setQueryData(TENANT_QUERY_KEY.lists(), context.previousUsers);
			}

			// Toast d'erreur
			toast.error("Erreur", {
				description: "Impossible de changer le statut.",
			});
		},

		// 3. ON SUCCESS : Tout s'est bien passé
		onSuccess: () => {
			// Toast de succès
			toast.success("Statut mis à jour");
		},

		// 4. ON SETTLED : Dans tous les cas, on resync avec le serveur
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: TENANT_QUERY_KEY.lists() });
		},
	});
};

// Supprimer un tenant
export const useDeleteTenant = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => tenantsService.delete(id),
		onSuccess: () => {
			toast.success("Locataire supprimé.");
			queryClient.invalidateQueries({ queryKey: TENANT_QUERY_KEY.lists() });
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || "Erreur lors de la suppression");
		},
	});
};

// export const useTenantWithRelations(tenantId: number | null | undefined) {
// 	return useQuery<TenantWithRelations, Error>({
// 		queryKey: [...TENANT_QUERY_KEY, tenantId, 'with-relations'],
// 		queryFn: () => {
// 			if (!tenantId) throw new Error("ID locataire invalide");
// 			return tenantsService.getByIdWithRelations(tenantId);
// 		},
// 		enabled: !!tenantId,
// 		staleTime: 1000 * 60 * 5,
// 	});
// }
