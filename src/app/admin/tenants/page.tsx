"use client";

import { Terminal } from "lucide-react";

import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TenantList } from "@/features/tenants/components/TenantList";
import { useTenants } from "@/features/tenants/hooks/useTenants.hooks";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Permission, hasPermission } from "@/lib/permissions";
import { PageHeader } from "@/components/shared/PageHeader";

export default function TenantsPage() {
	const { data: tenants, isLoading, isError, error } = useTenants();
	const { user } = useAuth();

	const canRead = user && hasPermission(user.role, Permission.TENANTS_READ);
	const canCreate = user && hasPermission(user.role, Permission.TENANTS_CREATE);

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
					Impossible de charger la liste des locataires: {error?.message}
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="space-y-6 p-4">
			<PageHeader
				title="Liste des locataires"
				description="Gérez, consultez ou ajoutez des locataires à la plateforme."
			/>
			<TenantList tenants={tenants || []} />
		</div>
	);
}