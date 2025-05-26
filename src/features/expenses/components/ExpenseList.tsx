
"use client";

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { TrendingDown, PlusCircle } from "lucide-react"; // Icône pour Dépenses
import { ExpenseWithRelations } from "@/types";
import { DataTable } from '@/components/shared/DataTable';
import { expenseColumns } from './expense.columns';

interface ExpenseListProps {
	expenses: ExpenseWithRelations[];
}

export function ExpenseList({ expenses }: ExpenseListProps) {
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
		<DataTable
			columns={expenseColumns}
			data={expenses || []}
			emptyStateContent={emptyState}
		/>
	);
}