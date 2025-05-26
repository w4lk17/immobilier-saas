
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import paymentsService from '../services/paymentsApi';
import { PaymentFormData, UpdatePaymentFormData } from '../schemas/paymentSchemas';
import { toast } from "sonner";
import { FrontendPayment, PaymentWithRelations } from '@/types';

export const PAYMENTS_QUERY_KEY = ['payments'];

// Hook pour la liste (peut nécessiter des filtres)
export function usePayments(/* filters: any = {} */) {
	return useQuery<PaymentWithRelations[], Error>({
		queryKey: [PAYMENTS_QUERY_KEY /*, filters */],
		queryFn: () => paymentsService.getPayments(/* filters */),
		staleTime: 1000 * 60, // Rafraîchir plus souvent?
	});
}

export function usePayment(paymentId: number | null | undefined) {
	return useQuery<PaymentWithRelations, Error>({
		queryKey: [...PAYMENTS_QUERY_KEY, paymentId],
		queryFn: () => {
			if (!paymentId) throw new Error("ID paiement invalide");
			return paymentsService.getPaymentById(paymentId);
		},
		enabled: !!paymentId,
	});
}

export function useCreatePayment() {
	const queryClient = useQueryClient();
	return useMutation<FrontendPayment, Error, PaymentFormData>({
		mutationFn: (data) => paymentsService.createPayment(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: PAYMENTS_QUERY_KEY });
			// Invalider le contrat lié ? Pas forcément utile.
			toast.success("Paiement enregistré avec succès !");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Erreur lors de l'enregistrement du paiement.");
		},
	});
}

export function useUpdatePayment() {
	const queryClient = useQueryClient();
	return useMutation<FrontendPayment, Error, { id: number; data: UpdatePaymentFormData }>({
		mutationFn: ({ id, data }) => paymentsService.updatePayment(id, data),
		onSuccess: (updatedPayment, variables) => {
			queryClient.invalidateQueries({ queryKey: PAYMENTS_QUERY_KEY });
			queryClient.setQueryData([...PAYMENTS_QUERY_KEY, variables.id], updatedPayment);
			toast.success("Paiement mis à jour avec succès !");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Erreur lors de la mise à jour du paiement.");
		},
	});
}

export function useDeletePayment() {
	const queryClient = useQueryClient();
	return useMutation<FrontendPayment, Error, number>({
		mutationFn: (id) => paymentsService.deletePayment(id),
		onSuccess: (deletedPayment, id) => {
			toast.success(`Paiement ${id} supprimé avec succès !`);
			queryClient.invalidateQueries({ queryKey: PAYMENTS_QUERY_KEY });
			queryClient.removeQueries({ queryKey: [...PAYMENTS_QUERY_KEY, id] });
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Erreur lors de la suppression du paiement.");
		},
	});
}