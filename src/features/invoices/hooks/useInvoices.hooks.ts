
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import invoicesService from '../services/invoicesApi';
import { PaymentFormData, PaymentUpdateFormData } from '../schemas/paymentSchemas';
import { toast } from "sonner";
import { Invoice, InvoiceWithRelations } from '@/types';

export const INVOICES_QUERY_KEY = ['invoices'];

// List queries
export function useInvoices() {
	return useQuery<Invoice[], Error>({
		queryKey: INVOICES_QUERY_KEY,
		queryFn: invoicesService.getAll,
		staleTime: 1000 * 60 * 5,
	});
}

export function useInvoicesWithRelations() {
	return useQuery<InvoiceWithRelations[], Error>({
		queryKey: [...INVOICES_QUERY_KEY, 'with-relations'],
		queryFn: invoicesService.getAllWithRelations,
		staleTime: 1000 * 60 * 5,
	});
}

// Detail queries
export function useInvoice(invoiceId: number | null | undefined) {
	return useQuery<Invoice, Error>({
		queryKey: [...INVOICES_QUERY_KEY, invoiceId],
		queryFn: () => {
			if (!invoiceId) throw new Error("ID facture invalide");
			return invoicesService.getById(invoiceId);
		},
		enabled: !!invoiceId,
		staleTime: 1000 * 60 * 5,
	});
}

export function useInvoiceWithRelations(invoiceId: number | null | undefined) {
	return useQuery<InvoiceWithRelations, Error>({
		queryKey: [...INVOICES_QUERY_KEY, invoiceId, 'with-relations'],
		queryFn: () => {
			if (!invoiceId) throw new Error("ID facture invalide");
			return invoicesService.getByIdWithRelations(invoiceId);
		},
		enabled: !!invoiceId,
		staleTime: 1000 * 60 * 5,
	});
}

// Mutation hooks
export function useCreateInvoice() {
	const queryClient = useQueryClient();
	return useMutation<InvoiceWithRelations, Error, PaymentFormData>({
		mutationFn: (data) => invoicesService.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEY });
			toast.success("Facture créée avec succès !");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Erreur lors de la création de la facture.");
		},
	});
}

export function useUpdateInvoice() {
	const queryClient = useQueryClient();
	return useMutation<InvoiceWithRelations, Error, { id: number; data: PaymentUpdateFormData }>({
		mutationFn: ({ id, data }) => invoicesService.update(id, data),
		onSuccess: (updatedInvoice, variables) => {
			queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEY });
			queryClient.setQueryData([...INVOICES_QUERY_KEY, variables.id], updatedInvoice);
			toast.success("Facture mise à jour avec succès !");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Erreur lors de la mise à jour de la facture.");
		},
	});
}

export function useDeleteInvoice() {
	const queryClient = useQueryClient();
	return useMutation<void, Error, number>({
		mutationFn: (id) => invoicesService.delete(id),
		onSuccess: (_, id) => {
			toast.success(`Facture supprimée avec succès !`);
			queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEY });
			queryClient.removeQueries({ queryKey: [...INVOICES_QUERY_KEY, id] });
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Erreur lors de la suppression de la facture.");
		},
	});
}