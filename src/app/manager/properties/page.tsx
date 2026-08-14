"use client";

import { Terminal } from "lucide-react";

import { usePropertiesWithRelations } from "@/features/properties/hooks/useProperties.hooks";
import { PropertyList } from "@/features/properties/components/PropertyList";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Permission, hasPermission } from "@/lib/permissions";

export default function ManagerPropertiesPage() {
	const { data: properties, isLoading, isError, error } = usePropertiesWithRelations();
	const { user } = useAuth();

	const canRead = user && hasPermission(user.role, Permission.PROPERTIES_READ);

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
					Impossible de charger la liste des biens immobiliers: {error?.message}
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="h-full flex-1 flex-col gap-8 p-4 md:flex">
			<div className="flex flex-col gap-1">
				<h2 className="text-2xl font-bold tracking-tight">Biens Immobiliers</h2>
				<p className="text-muted-foreground">
					Gérez les biens que vous gérez
				</p>
			</div>
			<PropertyList properties={properties || []} />
		</div>
	);
}
