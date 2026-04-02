
"use client";

import { ReceiptTextIcon, PlusCircle } from "lucide-react";
import { InvoiceWithRelations } from "@/types";
import { DataTable } from '@/components/shared/DataTable/DataTable';
import { DataTableEmptyState } from '@/components/shared/DataTable/DataTableEmptyState';
import { invoiceColumns } from './invoice.columns';

interface InvoiceListProps {
	invoices: InvoiceWithRelations[];
}

export function InvoiceList({ invoices }: InvoiceListProps) {
	const emptyState = (
		<DataTableEmptyState
			icon={ReceiptTextIcon}
			title="Aucune facture trouvée"
			description="Commencez par enregistrer une nouvelle facture."
			actionHref="/manager/invoices/new"
			actionLabel="Enregistrer une facture"
			actionIcon={PlusCircle}
		/>
	);

	return (
		<DataTable
			columns={invoiceColumns}
			data={invoices || []}
			searchPlaceholder='Rechercher par locataire ou numéro'
			searchColumn='invoiceNumber'
			emptyStateContent={emptyState}
			enableExport={true}
			exportFileName='factures'
		/>
	);
}