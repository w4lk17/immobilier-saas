"use client";

import { Download, Terminal } from "lucide-react";
import Link from "next/link";

import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ExpenseList } from "@/features/expenses/components/ExpenseList";
import { useExpensesWithRelations } from "@/features/expenses/hooks/useExpenses.hooks";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Permission, hasPermission } from "@/lib/permissions";

export default function ManagerExpensesPage() {
	const { data: expenses, isLoading, isError, error } = useExpensesWithRelations();
	const { user } = useAuth();

	const canRead = user && hasPermission(user.role, Permission.EXPENSES_READ);
	const canCreate = user && hasPermission(user.role, Permission.EXPENSES_CREATE);

	if (!canRead) {
		return (
			<Alert variant="destructive" className="max-w-2xl mx-auto">
				<Terminal className="h-4 w-4" />
				<AlertTitle>Accès refusé</AlertTitle>
				<AlertDescription>
					Vous n'avez pas la permission d'accéder à cette page.
				</AlertDescription>
			</Alert>
		);
	}

	if (isLoading) {
		return <div className="flex justify-center items-center h-64"><LoadingSpinner size={32} /></div>;
	}

	if (isError) {
		return (
			<Alert variant="destructive" className="max-w-2xl mx-auto">
				<Terminal className="h-4 w-4" />
				<AlertTitle>Erreur de chargement</AlertTitle>
				<AlertDescription>
					Impossible de charger la liste des dépenses. {error?.message}
				</AlertDescription>
			</Alert>
		);
	}
	return (
		<div className=" h-full flex-1 flex-col gap-8 p-4 md:flex">
			<div className="flex items-center justify-between gap-2">
				<div className="flex flex-col gap-1">
					<h2 className="text-2xl font-bold tracking-tight">Dépenses</h2>
					<p className="text-muted-foreground">
						Gérez les dépenses liées aux biens
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button variant="outline"
						onClick={() => { alert("Fonctionnalité d'export PDF à implémenter !"); }}
					>
						<Download /> Exporter
					</Button>
					{canCreate && (
						<Button asChild>
							<Link href="/manager-portal/expenses/new">
								Ajouter une dépense
							</Link>
						</Button>
					)}
				</div>
			</div>
			<ExpenseList expenses={expenses || []} />
		</div>
	);
}
