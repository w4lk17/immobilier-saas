"use client";

import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ContractList } from "@/features/contracts/components/ContractList";
import { useContracts } from "@/features/contracts/hooks/useContracts.hooks";
import { Download, Terminal } from "lucide-react";

export default function ContractsPage() {
	const { data: contracts, isLoading, isError, error } = useContracts();

	if (isLoading) {
		return <div className="flex justify-center items-center h-64"><LoadingSpinner size={32} /></div>;
	}

	if (isError) {
		return (
			<Alert variant="destructive" className="max-w-2xl mx-auto">
				<Terminal className="h-4 w-4" />
				<AlertTitle>Erreur de chargement</AlertTitle>
				<AlertDescription>
					Impossible de charger la liste des contrats: {error?.message}
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className=" h-full flex-1 flex-col gap-8 p-4 md:flex">
			{/* TODO: change this div to reusable component */}
			<div className="flex items-center justify-between gap-2">
				<div className="flex flex-col gap-1">
					<h2 className="text-2xl font-bold tracking-tight">Liste des contrats </h2>
					<p className="text-muted-foreground">
						Here&apos;s a list of your tasks for this month!
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button variant="outline"
						onClick={() => { alert("Fonctionnalité d'export PDF à implémenter !"); }}
					>
						<Download /> Exporter
					</Button>
				</div>
			</div>
			<ContractList contracts={contracts || []} />
		</div>

	)
}