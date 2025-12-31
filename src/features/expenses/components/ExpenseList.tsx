"use client";

import Link from 'next/link';
import { TrendingDown, PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ExpenseWithRelations } from "@/types";
import { DataTable } from '@/components/shared/DataTable/DataTable';
import { expenseColumns } from './expense.columns';
import { ExpenseDetailsModal } from './ExpenseDetailsModal';
import { useState } from 'react';

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
		<div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
			<TrendingDown className="h-12 w-12 text-muted-foreground" />
			<h3 className="text-xl font-semibold">Aucune dépense trouvée</h3>
			<p className="text-muted-foreground">Commencez par enregistrer une nouvelle dépense.</p>
			<Button asChild>
				<Link href="/expenses/new"> {/* Assurez-vous que cette route existe */}
					<PlusCircle className="mr-2 h-4 w-4" /> Ajouter une dépense
				</Link>
			</Button>
		</div>
	);

	return (
		<div className=" grid grid-cols-1 gap-4">
			<DataTable
				columns={expenseColumns}
				data={expenses || []}
				meta={{ viewDetails: handleViewDetails }}
				searchColumn={'description'}
				newButtonHref={'/expenses/new'}
				newButtonTitle={'Nouveau'}
				emptyStateContent={emptyState} />

			<ExpenseDetailsModal
				expense={selectedExpense}
				isOpen={isModalOpen}
				onOpenChange={setIsModalOpen}
			/>
		</div>
	);
}