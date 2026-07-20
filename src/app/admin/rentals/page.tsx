"use client";

import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { RentalList } from "@/features/rentals/components/RentalList";
import { useRentalsWithRelations } from "@/features/rentals/hooks/useRentals.hooks";
import { Terminal } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Permission, hasPermission } from "@/lib/permissions";
import { PageHeader } from "@/components/shared/PageHeader";

export default function RentalsPage() {
	const { data: rentals, isLoading, isError, error } = useRentalsWithRelations();
	const { user } = useAuth();

	const canRead = user && hasPermission(user.role, Permission.RENTALS_READ);

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
		return (
			<div className="flex justify-center items-center h-64">
				<LoadingSpinner size={32} />
			</div>
		);
	}

	if (isError) {
		return (
			<Alert variant="destructive" className="max-w-2xl mx-auto">
				<Terminal className="h-4 w-4" />
				<AlertTitle>Erreur de chargement</AlertTitle>
				<AlertDescription>
					Impossible de charger la liste des locaux : {error?.message}
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="space-y-6 p-4">
			<PageHeader
				title="Liste des locaux "
				// title="Liste des locaux / unités"
				description="Gérez vos appartements, boutiques, studios et villas."
			/>
			<RentalList rentals={rentals || []} />
		</div>
	);
}
