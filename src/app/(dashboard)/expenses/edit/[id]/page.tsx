"use client";

import { useParams, useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, Terminal } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useExpense, useUpdateExpense } from "@/features/expenses/hooks/useExpenses.hooks";
import { ExpenseForm } from "@/features/expenses/components/ExpenseForm";
import { ExpenseUpdateFormData } from "@/features/expenses/schemas/expenseSchemas";

export default function EditExpensePage() {
	const router = useRouter();
	const params = useParams();
	const expenseId = params.id ? parseInt(params.id as string, 10) : null;

	const { data: expense, isLoading: isLoadingExpense, isError, error } = useExpense(expenseId);
	const updateExpenseMutation = useUpdateExpense();

	const handleSubmit = async (data: ExpenseUpdateFormData) => {
		if (!expenseId) return;
		// Le hook gère déjà le toast et l'invalidation du cache
		await updateExpenseMutation.mutateAsync({ id: expenseId, data });
		router.push("/expenses"); // Rediriger vers la liste après mise à jour
	};

	if (isLoadingExpense) {
		return <div className="flex justify-center items-center h-64"><LoadingSpinner size={32} /></div>;
	}

	if (isError || !expense) {
		return (
			<Alert variant="destructive">
				<Terminal className="h-4 w-4" />
				<AlertTitle>Erreur</AlertTitle>
				<AlertDescription>
					Impossible de charger les données de la dépense. {error?.message}
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="h-full flex-col gap-8 p-4 md:flex">
			<div className=" flex items-center justify-between gap-2 sm:flex-row sm:items-center sm:gap-0">
				<div className="flex flex-col gap-1">
					<h2 className="text-2xl font-bold tracking-tight">Modifier la dépense</h2>
				</div>
				<div className="flex items-center gap-2 sm:justify-end">
					<Button variant="outline" asChild>
						<Link href="/expenses">
							<ArrowLeft />
							liste des dépenses
						</Link>
					</Button>
					{/* <PresetSelector presets={presets} />
					<PresetSave />
					<div className="hidden space-x-2 md:flex">
						<CodeViewer />
						<PresetShare />
					</div>
					<PresetActions /> */}
				</div>
			</div>
			<ExpenseForm
				initialData={expense}
				onSubmit={handleSubmit}
				isLoading={updateExpenseMutation.isPending}
				submitButtonText="Mettre à jour la Depense"
			/>
		</div>
	);
}