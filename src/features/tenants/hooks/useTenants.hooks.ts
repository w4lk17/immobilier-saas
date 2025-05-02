
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import tenantsService from '../services/tenantsApi';
import { TenantFormData, TenantUpdateFormData } from '../schemas/tenantSchemas';
import toast from 'react-hot-toast';
import { FrontendTenant } from '@/types';

export const TENANTS_QUERY_KEY = ['tenants'];

export function useTenants() {
	return useQuery<FrontendTenant[], Error>({
		queryKey: TENANTS_QUERY_KEY,
		queryFn: tenantsService.getTenants,
		staleTime: 1000 * 60 * 5,
	});
}

export function useTenant(tenantId: number | null | undefined) {
	return useQuery<FrontendTenant, Error>({
		queryKey: [...TENANTS_QUERY_KEY, tenantId],
		queryFn: () => {
			if (!tenantId) throw new Error("ID locataire invalide");
			return tenantsService.getTenantById(tenantId);
		},
		enabled: !!tenantId,
	});
}

export function useCreateTenant() {
	const queryClient = useQueryClient();
	return useMutation<FrontendTenant, Error, TenantFormData>({
		mutationFn: (data) => tenantsService.createTenant(data),
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
	return useMutation<FrontendTenant, Error, { id: number; data: TenantUpdateFormData }>({
		mutationFn: ({ id, data }) => tenantsService.updateTenant(id, data),
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
	return useMutation<FrontendTenant, Error, number>({
		mutationFn: (id) => tenantsService.deleteTenant(id),
		onSuccess: (deletedTenant, id) => {
			toast.success(`Profil locataire ${id} supprimé avec succès !`);
			queryClient.invalidateQueries({ queryKey: TENANTS_QUERY_KEY });
			// Invalider les contrats et paiements liés si nécessaire
			queryClient.invalidateQueries({ queryKey: ['contracts'] });
			queryClient.invalidateQueries({ queryKey: ['payments'] });
			queryClient.removeQueries({ queryKey: [...TENANTS_QUERY_KEY, id] });
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Erreur lors de la suppression du profil locataire.");
		},
	});
}