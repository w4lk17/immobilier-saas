
"use client";

import { ReceiptTextIcon, PlusCircle } from "lucide-react";
import { InvoiceWithRelations } from "@/types";
import { DataTable } from '@/components/shared/DataTable/DataTable';
import { DataTableEmptyState } from '@/components/shared/DataTable/DataTableEmptyState';
import { invoiceColumns } from "./invoice.columns";
import { InvoicePreviewDialog } from "./InvoicePreviewDialog";
import { useState } from "react";

interface InvoiceListProps {
	invoices: InvoiceWithRelations[];
}

export function InvoiceList({ invoices }: InvoiceListProps) {

	const [selectedInvoice, setSelectedInvoice] = useState<InvoiceWithRelations | null>(null);
	const [isPreviewOpen, setIsPreviewOpen] = useState(false);

	const handlePreview = (invoice: InvoiceWithRelations) => {
		setSelectedInvoice(invoice);
		setIsPreviewOpen(true);
	};


	const emptyState = (
		<DataTableEmptyState
			icon={ReceiptTextIcon}
			title="Aucune facture trouvée"
			description="Commencez par enregistrer une nouvelle facture."
			actionHref="/admin/invoices/new"
			actionLabel="Enregistrer une facture"
			actionIcon={PlusCircle}
		/>
	);

	return (
		<>
			<DataTable
				columns={invoiceColumns}
				data={invoices || []}
				meta={{ viewDetails: handlePreview }}
				searchPlaceholder='Rechercher par locataire ou numéro'
				searchColumns={['tenantName']}
				emptyStateContent={emptyState}
				enableExport={true}
				exportFileName='factures'
			/>

			<InvoicePreviewDialog
				invoice={selectedInvoice}
				isOpen={isPreviewOpen}
				onOpenChange={setIsPreviewOpen}
			/>
		</>
	);
}