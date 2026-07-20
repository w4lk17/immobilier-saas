"use client";

import { Terminal } from "lucide-react";

import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Permission, hasPermission } from "@/lib/permissions";
import { useInvoicesWithRelations } from "@/features/invoices/hooks/useInvoices.hooks";
import { PageHeader } from "@/components/shared/PageHeader";
import { TenantInvoiceCenter } from "@/features/invoices/components/TenantInvoiceCenter";

export default function TenantMyInvoicesPage() {
	const { data: invoices, isLoading, isError, error } = useInvoicesWithRelations();
	const { user } = useAuth();

	const canRead = user && hasPermission(user.role, Permission.INVOICES_READ);

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
					Impossible de charger vos factures&nbsp;: {error?.message}
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="space-y-6 p-4">
			<PageHeader
				title="Mes factures"
				description="Consultez vos loyers, factures et quittances depuis votre espace locataire."
			/>
			<TenantInvoiceCenter invoices={invoices || []} />
		</div>
	);
}
