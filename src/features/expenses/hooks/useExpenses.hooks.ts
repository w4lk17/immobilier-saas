
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import expensesService from '../services/expensesApi';
import { ExpenseFormData, ExpenseUpdateFormData } from '../schemas/expenseSchemas';
import { toast } from "sonner";
import { FrontendExpense, ExpenseWithRelations } from '@/types';

export const EXPENSES_QUERY_KEY = ['expenses'];

// Hook pour la liste (peut nécessiter des filtres)
export function useExpenses(/* filters: any = {} */) {
	return useQuery<ExpenseWithRelations[], Error>({
		queryKey: [EXPENSES_QUERY_KEY /*, filters */],
		queryFn: () => expensesService.getExpenses(/* filters */),
		staleTime: 1000 * 60 * 2,
	});
}

export function useExpense(expenseId: number | null | undefined) {
	return useQuery<ExpenseWithRelations, Error>({
		queryKey: [...EXPENSES_QUERY_KEY, expenseId],
		queryFn: () => {
			if (!expenseId) throw new Error("ID dépense invalide");
			return expensesService.getExpenseById(expenseId);
		},
		enabled: !!expenseId,
	});
}

export function useCreateExpense() {
	const queryClient = useQueryClient();
	return useMutation<FrontendExpense, Error, ExpenseFormData>({
		mutationFn: (data) => expensesService.createExpense(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: EXPENSES_QUERY_KEY });
			// Invalider la propriété liée ?
			// queryClient.invalidateQueries({ queryKey: ['properties'] }); // Peut-être trop large
			toast.success("Dépense enregistrée avec succès !");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Erreur lors de l'enregistrement de la dépense.");
		},
	});
}

export function useUpdateExpense() {
	const queryClient = useQueryClient();
	// Utiliser ExpenseUpdateFormData si différent de ExpenseFormData
	return useMutation<FrontendExpense, Error, { id: number; data: Partial<ExpenseFormData> }>({
		mutationFn: ({ id, data }) => expensesService.updateExpense(id, data),
		onSuccess: (updatedExpense, variables) => {
			queryClient.invalidateQueries({ queryKey: EXPENSES_QUERY_KEY });
			queryClient.setQueryData([...EXPENSES_QUERY_KEY, variables.id], updatedExpense);
			toast.success("Dépense mise à jour avec succès !");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Erreur lors de la mise à jour de la dépense.");
		},
	});
}

export function useDeleteExpense() {
	const queryClient = useQueryClient();
	return useMutation<FrontendExpense, Error, number>({
		mutationFn: (id) => expensesService.deleteExpense(id),
		onSuccess: (deletedExpense, id) => {
			toast.success(`Dépense ${id} supprimée avec succès !`);
			queryClient.invalidateQueries({ queryKey: EXPENSES_QUERY_KEY });
			queryClient.removeQueries({ queryKey: [...EXPENSES_QUERY_KEY, id] });
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Erreur lors de la suppression de la dépense.");
		},
	});
}