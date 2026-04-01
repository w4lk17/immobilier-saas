
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import tenantsService from '../services/tenantsApi';
import { TenantFormData, TenantUpdateFormData } from '../schemas/tenantSchemas';
import { toast } from "sonner";
import { FrontendTenant, FrontendTenantWithUser, TenantWithRelations } from '@/types';

export const TENANTS_QUERY_KEY = ['tenants'];

// List queries
export function useTenants() {
	return useQuery<FrontendTenant[], Error>({
		queryKey: TENANTS_QUERY_KEY,
		queryFn: tenantsService.getAll,
		staleTime: 1000 * 60 * 5,
	});
}

export function useTenantsWithUser() {
	return useQuery<FrontendTenantWithUser[], Error>({
		queryKey: [...TENANTS_QUERY_KEY, 'with-user'],
		queryFn: tenantsService.getAllWithUser,
		staleTime: 1000 * 60 * 5,
	});
}

// Detail queries
export function useTenant(tenantId: number | null | undefined) {
	return useQuery<FrontendTenant, Error>({
		queryKey: [...TENANTS_QUERY_KEY, tenantId],
		queryFn: () => {
			if (!tenantId) throw new Error("ID locataire invalide");
			return tenantsService.getById(tenantId);
		},
		enabled: !!tenantId,
		staleTime: 1000 * 60 * 5,
	});
}

export function useTenantWithRelations(tenantId: number | null | undefined) {
	return useQuery<TenantWithRelations, Error>({
		queryKey: [...TENANTS_QUERY_KEY, tenantId, 'with-relations'],
		queryFn: () => {
			if (!tenantId) throw new Error("ID locataire invalide");
			return tenantsService.getByIdWithRelations(tenantId);
		},
		enabled: !!tenantId,
		staleTime: 1000 * 60 * 5,
	});
}

// Mutation hooks
export function useCreateTenant() {
	const queryClient = useQueryClient();
	return useMutation<FrontendTenantWithUser, Error, TenantFormData>({
		mutationFn: (data) => tenantsService.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: TENANTS_QUERY_KEY });
			toast.success("Profil locataire créé avec succès !");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Erreur lors de la création du profil locataire.");
		},
	});
}

export function useUpdateTenant() {
	const queryClient = useQueryClient();
	return useMutation<FrontendTenantWithUser, Error, { id: number; data: TenantUpdateFormData }>({
		mutationFn: ({ id, data }) => tenantsService.update(id, data),
		onSuccess: (updatedTenant, variables) => {
			queryClient.invalidateQueries({ queryKey: TENANTS_QUERY_KEY });
			queryClient.setQueryData([...TENANTS_QUERY_KEY, variables.id], updatedTenant);
			toast.success("Profil locataire mis à jour avec succès !");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Erreur lors de la mise à jour du profil locataire.");
		},
	});
}

export function useDeleteTenant() {
	const queryClient = useQueryClient();
	return useMutation<void, Error, number>({
		mutationFn: (id) => tenantsService.delete(id),
		onSuccess: (_, id) => {
			toast.success(`Profil locataire supprimé avec succès !`);
			queryClient.invalidateQueries({ queryKey: TENANTS_QUERY_KEY });
			queryClient.invalidateQueries({ queryKey: ['contracts'] });
			queryClient.invalidateQueries({ queryKey: ['payments'] });
			queryClient.removeQueries({ queryKey: [...TENANTS_QUERY_KEY, id] });
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Erreur lors de la suppression du profil locataire.");
		},
	});
}