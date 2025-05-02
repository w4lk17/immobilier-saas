
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import contractsService from '../services/contractsApi';
import { ContractFormData, ContractUpdateFormData } from '../schemas/contractSchemas';
import toast from 'react-hot-toast';
import { FrontendContract, ContractWithRelations } from '@/types';

export const CONTRACTS_QUERY_KEY = ['contracts'];

// Hook pour la liste (peut nécessiter des filtres via query params)
export function useContracts(/* filters: any = {} */) {
	return useQuery<ContractWithRelations[], Error>({
		queryKey: [CONTRACTS_QUERY_KEY /*, filters */], // Inclure les filtres dans la clé si utilisés
		queryFn: () => contractsService.getContracts(/* filters */),
		staleTime: 1000 * 60 * 3,
	});
}

export function useContract(contractId: number | null | undefined) {
	return useQuery<ContractWithRelations, Error>({
		queryKey: [...CONTRACTS_QUERY_KEY, contractId],
		queryFn: () => {
			if (!contractId) throw new Error("ID contrat invalide");
			return contractsService.getContractById(contractId);
		},
		enabled: !!contractId,
	});
}

export function useCreateContract() {
	const queryClient = useQueryClient();
	return useMutation<FrontendContract, Error, ContractFormData>({
		mutationFn: (data) => contractsService.createContract(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: CONTRACTS_QUERY_KEY });
			// Invalider aussi la propriété liée pour MAJ son statut
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
	return useMutation<FrontendContract, Error, { id: number; data: ContractUpdateFormData }>({
		mutationFn: ({ id, data }) => contractsService.updateContract(id, data),
		onSuccess: (updatedContract, variables) => {
			queryClient.invalidateQueries({ queryKey: CONTRACTS_QUERY_KEY });
			queryClient.setQueryData([...CONTRACTS_QUERY_KEY, variables.id], updatedContract);
			// Invalider la propriété liée si le statut change
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
	return useMutation<FrontendContract, Error, number>({
		mutationFn: (id) => contractsService.deleteContract(id),
		onSuccess: (deletedContract, id) => {
			toast.success(`Contrat ${id} supprimé avec succès !`);
			queryClient.invalidateQueries({ queryKey: CONTRACTS_QUERY_KEY });
			// Invalider la propriété liée pour MAJ son statut
			queryClient.invalidateQueries({ queryKey: ['properties', deletedContract.propertyId] });
			queryClient.invalidateQueries({ queryKey: ['properties'] });
			// Invalider les paiements liés
			queryClient.invalidateQueries({ queryKey: ['payments'] });
			queryClient.removeQueries({ queryKey: [...CONTRACTS_QUERY_KEY, id] });
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Erreur lors de la suppression du contrat.");
		},
	});
}