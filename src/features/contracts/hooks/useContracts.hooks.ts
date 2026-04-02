
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import contractsService from '../services/contractsApi';
import { ContractFormData, ContractUpdateFormData } from '../schemas/contractSchemas';
import { toast } from "sonner";
import { Contract, ContractWithRelations } from '@/types';

export const CONTRACTS_QUERY_KEY = ['contracts'];

// List queries
export function useContracts() {
	return useQuery<Contract[], Error>({
		queryKey: CONTRACTS_QUERY_KEY,
		queryFn: contractsService.getAll,
		staleTime: 1000 * 60 * 5,
	});
}

export function useContractsWithRelations() {
	return useQuery<ContractWithRelations[], Error>({
		queryKey: [...CONTRACTS_QUERY_KEY, 'with-relations'],
		queryFn: contractsService.getAllWithRelations,
		staleTime: 1000 * 60 * 5,
	});
}

// Detail queries
export function useContract(contractId: number | null | undefined) {
	return useQuery<Contract, Error>({
		queryKey: [...CONTRACTS_QUERY_KEY, contractId],
		queryFn: () => {
			if (!contractId) throw new Error("ID contrat invalide");
			return contractsService.getById(contractId);
		},
		enabled: !!contractId,
		staleTime: 1000 * 60 * 5,
	});
}

export function useContractWithRelations(contractId: number | null | undefined) {
	return useQuery<ContractWithRelations, Error>({
		queryKey: [...CONTRACTS_QUERY_KEY, contractId, 'with-relations'],
		queryFn: () => {
			if (!contractId) throw new Error("ID contrat invalide");
			return contractsService.getByIdWithRelations(contractId);
		},
		enabled: !!contractId,
		staleTime: 1000 * 60 * 5,
	});
}

// Mutation hooks
export function useCreateContract() {
	const queryClient = useQueryClient();
	return useMutation<ContractWithRelations, Error, ContractFormData>({
		mutationFn: (data) => contractsService.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: CONTRACTS_QUERY_KEY });
			queryClient.invalidateQueries({ queryKey: ['properties'] });
			toast.success("Contrat créé avec succès !");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Erreur lors de la création du contrat.");
		},
	});
}

export function useUpdateContract() {
	const queryClient = useQueryClient();
	return useMutation<ContractWithRelations, Error, { id: number; data: ContractUpdateFormData }>({
		mutationFn: ({ id, data }) => contractsService.update(id, data),
		onSuccess: (updatedContract, variables) => {
			queryClient.invalidateQueries({ queryKey: CONTRACTS_QUERY_KEY });
			queryClient.setQueryData([...CONTRACTS_QUERY_KEY, variables.id], updatedContract);
			queryClient.invalidateQueries({ queryKey: ['properties', updatedContract.propertyId] });
			queryClient.invalidateQueries({ queryKey: ['properties'] });
			toast.success("Contrat mis à jour avec succès !");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Erreur lors de la mise à jour du contrat.");
		},
	});
}

export function useDeleteContract() {
	const queryClient = useQueryClient();
	return useMutation<void, Error, number>({
		mutationFn: (id) => contractsService.delete(id),
		onSuccess: (_, id) => {
			toast.success(`Contrat supprimé avec succès !`);
			queryClient.invalidateQueries({ queryKey: CONTRACTS_QUERY_KEY });
			queryClient.invalidateQueries({ queryKey: ['properties'] });
			queryClient.invalidateQueries({ queryKey: ['payments'] });
			queryClient.removeQueries({ queryKey: [...CONTRACTS_QUERY_KEY, id] });
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Erreur lors de la suppression du contrat.");
		},
	});
}