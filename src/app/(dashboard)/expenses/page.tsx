"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ExpenseList } from "@/features/expenses/components/ExpenseList";
import { useExpenses } from "@/features/expenses/hooks/useExpenses.hooks";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export default function ExpensesPage() {
	const { data: expenses, isLoading, isError, error } = useExpenses();

	if (isLoading) {
		// Afficher des Skeletons pendant le chargement
		return (
			<div className="space-y-4">
				<div className="flex justify-between items-center">
					<Skeleton className="h-8 w-32" />
					<Skeleton className="h-10 w-24" />
				</div>
				<Skeleton className="h-20 w-full" />
				<Skeleton className="h-20 w-full" />
				<Skeleton className="h-20 w-full" />
			</div>
		);
	}

	if (isError) {
		return <p className="text-destructive">Erreur de chargement: {error?.message || 'Inconnue'}</p>;
	}

	return (
		<div className="">
			{/* Breadcrumb */}
			<div>Breadcrumb</div>
			{/* Container */}
			<div className="flex flex-col xl:flex-row gap-4 p-4">

				<div className="bg-primary-foreground p-4 rounded-lg">
					<div className="flex items-center justify-between mb-2">
						<h2 className="text-lg font-medium">Liste des dépenses</h2>
						<Button variant="outline" size="sm" >
							<PlusIcon />
							<Link href="/expenses/new">
								<span className="hidden lg:inline">Nouveau</span>
							</Link>
						</Button>
					</div>
					{/*Composant d'affichage */}
					<ExpenseList expenses={expenses || []} />
				</div>
			</div>
		</div>

	)
}