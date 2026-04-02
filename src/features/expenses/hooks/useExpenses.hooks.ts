
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import expensesService from '../services/expensesApi';
import { ExpenseFormData, ExpenseUpdateFormData } from '../schemas/expenseSchemas';
import { toast } from "sonner";
import { Expense, ExpenseWithRelations } from '@/types';

export const EXPENSES_QUERY_KEY = ['expenses'];

// List queries
export function useExpenses() {
	return useQuery<Expense[], Error>({
		queryKey: EXPENSES_QUERY_KEY,
		queryFn: expensesService.getAll,
		staleTime: 1000 * 60 * 5,
	});
}

export function useExpensesWithRelations() {
	return useQuery<ExpenseWithRelations[], Error>({
		queryKey: [...EXPENSES_QUERY_KEY, 'with-relations'],
		queryFn: expensesService.getAllWithRelations,
		staleTime: 1000 * 60 * 5,
	});
}

// Detail queries
export function useExpense(expenseId: number | null | undefined) {
	return useQuery<Expense, Error>({
		queryKey: [...EXPENSES_QUERY_KEY, expenseId],
		queryFn: () => {
			if (!expenseId) throw new Error("ID dépense invalide");
			return expensesService.getById(expenseId);
		},
		enabled: !!expenseId,
		staleTime: 1000 * 60 * 5,
	});
}

export function useExpenseWithRelations(expenseId: number | null | undefined) {
	return useQuery<ExpenseWithRelations, Error>({
		queryKey: [...EXPENSES_QUERY_KEY, expenseId, 'with-relations'],
		queryFn: () => {
			if (!expenseId) throw new Error("ID dépense invalide");
			return expensesService.getByIdWithRelations(expenseId);
		},
		enabled: !!expenseId,
		staleTime: 1000 * 60 * 5,
	});
}

// Mutation hooks
export function useCreateExpense() {
	const queryClient = useQueryClient();
	return useMutation<ExpenseWithRelations, Error, ExpenseFormData>({
		mutationFn: (data) => expensesService.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: EXPENSES_QUERY_KEY });
			toast.success("Dépense enregistrée avec succès !");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Erreur lors de l'enregistrement de la dépense.");
		},
	});
}

export function useUpdateExpense() {
	const queryClient = useQueryClient();
	return useMutation<ExpenseWithRelations, Error, { id: number; data: ExpenseUpdateFormData }>({
		mutationFn: ({ id, data }) => expensesService.update(id, data),
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
	return useMutation<void, Error, number>({
		mutationFn: (id) => expensesService.delete(id),
		onSuccess: (_, id) => {
			toast.success(`Dépense supprimée avec succès !`);
			queryClient.invalidateQueries({ queryKey: EXPENSES_QUERY_KEY });
			queryClient.removeQueries({ queryKey: [...EXPENSES_QUERY_KEY, id] });
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Erreur lors de la suppression de la dépense.");
		},
	});
}