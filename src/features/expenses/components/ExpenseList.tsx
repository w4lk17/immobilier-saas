"use client";

import { TrendingDown, PlusCircle } from "lucide-react";
import { useState } from 'react';

import { ExpenseWithRelations } from "@/types";
import { DataTable } from '@/components/shared/DataTable/DataTable';
import { DataTableEmptyState } from '@/components/shared/DataTable/DataTableEmptyState';
import { expenseColumns } from './expense.columns';
import { ExpenseDetailsModal } from './ExpenseDetailsModal';

interface ExpenseListProps {
	expenses: ExpenseWithRelations[];
}

export function ExpenseList({ expenses }: ExpenseListProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedExpense, setSelectedExpense] = useState<ExpenseWithRelations | null>(null);

	const handleViewDetails = (expense: ExpenseWithRelations) => {
		setSelectedExpense(expense);
		setIsModalOpen(true);
	};

	const emptyState = (
		<DataTableEmptyState
			icon={TrendingDown}
			title="Aucune dépense trouvée"
			description="Commencez par enregistrer une nouvelle dépense."
			actionHref="/expenses/new"
			actionLabel="Ajouter une dépense"
			actionIcon={PlusCircle}
		/>
	);

	return (
		<div className="grid grid-cols-1 gap-4">
			<DataTable
				columns={expenseColumns}
				data={expenses || []}
				meta={{ viewDetails: handleViewDetails }}
				searchPlaceholder='Rechercher par description'
				searchColumn='description'
				newButtonHref='/expenses/new'
				newButtonTitle='Nouveau'
				enableExport={true}
				exportFileName='depenses'
				emptyStateContent={emptyState} />

			<ExpenseDetailsModal
				expense={selectedExpense}
				isOpen={isModalOpen}
				onOpenChange={setIsModalOpen}
			/>
		</div>
	);
}