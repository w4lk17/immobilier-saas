
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import paymentsService from '../services/paymentsApi';
import { PaymentFormData, PaymentUpdateFormData } from '../schemas/paymentSchemas';
import { toast } from "sonner";
import { FrontendPayment, PaymentWithRelations } from '@/types';

export const PAYMENTS_QUERY_KEY = ['payments'];

// List queries
export function usePayments() {
	return useQuery<FrontendPayment[], Error>({
		queryKey: PAYMENTS_QUERY_KEY,
		queryFn: paymentsService.getAll,
		staleTime: 1000 * 60 * 5,
	});
}

export function usePaymentsWithRelations() {
	return useQuery<PaymentWithRelations[], Error>({
		queryKey: [...PAYMENTS_QUERY_KEY, 'with-relations'],
		queryFn: paymentsService.getAllWithRelations,
		staleTime: 1000 * 60 * 5,
	});
}

// Detail queries
export function usePayment(paymentId: number | null | undefined) {
	return useQuery<FrontendPayment, Error>({
		queryKey: [...PAYMENTS_QUERY_KEY, paymentId],
		queryFn: () => {
			if (!paymentId) throw new Error("ID paiement invalide");
			return paymentsService.getById(paymentId);
		},
		enabled: !!paymentId,
		staleTime: 1000 * 60 * 5,
	});
}

export function usePaymentWithRelations(paymentId: number | null | undefined) {
	return useQuery<PaymentWithRelations, Error>({
		queryKey: [...PAYMENTS_QUERY_KEY, paymentId, 'with-relations'],
		queryFn: () => {
			if (!paymentId) throw new Error("ID paiement invalide");
			return paymentsService.getByIdWithRelations(paymentId);
		},
		enabled: !!paymentId,
		staleTime: 1000 * 60 * 5,
	});
}

// Mutation hooks
export function useCreatePayment() {
	const queryClient = useQueryClient();
	return useMutation<PaymentWithRelations, Error, PaymentFormData>({
		mutationFn: (data) => paymentsService.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: PAYMENTS_QUERY_KEY });
			toast.success("Paiement enregistré avec succès !");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Erreur lors de l'enregistrement du paiement.");
		},
	});
}

export function useUpdatePayment() {
	const queryClient = useQueryClient();
	return useMutation<PaymentWithRelations, Error, { id: number; data: PaymentUpdateFormData }>({
		mutationFn: ({ id, data }) => paymentsService.update(id, data),
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
	return useMutation<void, Error, number>({
		mutationFn: (id) => paymentsService.delete(id),
		onSuccess: (_, id) => {
			toast.success(`Paiement supprimé avec succès !`);
			queryClient.invalidateQueries({ queryKey: PAYMENTS_QUERY_KEY });
			queryClient.removeQueries({ queryKey: [...PAYMENTS_QUERY_KEY, id] });
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Erreur lors de la suppression du paiement.");
		},
	});
}