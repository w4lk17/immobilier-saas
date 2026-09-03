"use client";

import { Terminal } from "lucide-react";

import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Permission, hasPermission } from "@/lib/permissions";
import { InvoiceList } from "@/features/invoices/components/InvoiceList";
import { PageHeader } from "@/components/shared/PageHeader";
import { useInvoicesWithRelations } from "@/features/invoices/hooks/useInvoices.hooks";

export default function InvoicesPage() {
	const { data: invoices, isLoading, isError, error } = useInvoicesWithRelations();
	const { user } = useAuth();

	const canRead = user && hasPermission(user.role, Permission.INVOICES_READ);
	const canCreate = user && hasPermission(user.role, Permission.INVOICES_CREATE);

	if (!canRead) {
		return (
			<Alert variant="destructive" className="max-w-2xl mx-auto">
				<Terminal className="h-4 w-4" />
				<AlertTitle>Accès refusé</AlertTitle>
				<AlertDescription>
					Vous n&apos;avez pas la permission d&apos;accéder à cette page.
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
					Impossible de charger les factures&nbsp;: {error?.message}
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="space-y-6 p-4">
			<PageHeader
				title="Liste des factures"
				description="Liste des factures de tous les locataires"
			/>
			<InvoiceList invoices={invoices?.filter(i => i.type === "RENT" || i.type === "DEPOSIT") || []} />
		</div>
	);
}