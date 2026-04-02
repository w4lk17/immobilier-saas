"use client";

import { Terminal } from "lucide-react";

import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ContractList } from "@/features/contracts/components/ContractList";
import { useContractsWithRelations } from "@/features/contracts/hooks/useContracts.hooks";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Permission, hasPermission } from "@/lib/permissions";

export default function TenantMyContractsPage() {
	const { data: contracts, isLoading, isError, error } = useContractsWithRelations();
	const { user } = useAuth();

	const canRead = user && hasPermission(user.role, Permission.CONTRACTS_READ);

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
					Impossible de charger vos contrats: {error?.message}
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="h-full flex-1 flex-col gap-8 p-4 md:flex">
			<div className="flex items-center justify-between gap-2">
				<div className="flex flex-col gap-1">
					<h2 className="text-2xl font-bold tracking-tight">Mes Contrats</h2>
					<p className="text-muted-foreground">
						Vos contrats de location
					</p>
				</div>
			</div>
			<ContractList contracts={contracts || []} />
		</div>
	);
}
