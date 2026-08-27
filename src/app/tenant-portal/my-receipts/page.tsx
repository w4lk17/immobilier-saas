"use client";

import { Terminal, Download, Eye } from "lucide-react";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Permission, hasPermission } from "@/lib/permissions";
import { useInvoicesWithRelations } from "@/features/invoices/hooks/useInvoices.hooks";
import { PageHeader } from "@/components/shared/PageHeader";
import { InvoiceStatus } from "@/types/enums";
import {
	formatReceiptCurrency,
	RentReceiptViewModel,
	buildRentReceiptViewModel,
} from "@/features/invoices/components/rentReceiptViewModel";
import { Button } from "@/components/ui/button";
import { InvoiceWithRelations } from "@/types";
import { useState, useMemo } from "react";
import { RentReceiptPdfDocument } from "@/features/invoices/components/RentReceiptPdfDocument";
import { pdf } from "@react-pdf/renderer";
import { InvoicePreviewDialog } from "@/features/invoices/components/InvoicePreviewDialog";


// Modern receipt card component
function ReceiptCard({
	receipt,
	invoice,
}: {
	receipt: RentReceiptViewModel;
	invoice: InvoiceWithRelations;
}) {
	const [isPreviewOpen, setIsPreviewOpen] = useState(false);
	const [downloadingId, setDownloadingId] = useState<number | null>(null);

	const openPreview = () => {
		setIsPreviewOpen(true);
	};

	async function downloadReceipt(receipt: RentReceiptViewModel) {
		const blob = await pdf(
			<RentReceiptPdfDocument receipt={receipt} />
		).toBlob();
		const url = URL.createObjectURL(blob);
		const anchor = document.createElement("a");
		anchor.href = url;
		anchor.download = `quittance-${receipt.monthLabel}.pdf`;
		anchor.click();
		URL.revokeObjectURL(url);
	}

	const handleDownload = async (receipt: RentReceiptViewModel) => {
		try {
			setDownloadingId(receipt.invoiceId);
			await downloadReceipt(receipt);
		} finally {
			setDownloadingId(null);
		}
	};

	return (
		<div className="bg-card text-card-foreground border rounded-lg shadow-sm hover:shadow transition-shadow p-5 flex flex-col gap-2">
			<div className="flex items-baseline justify-between gap-4">
				<div>
					<div className="font-semibold text-base flex items-center gap-2">
						<Download className="w-4 h-4 text-green-500" />
						{receipt.isReceiptType
							? "Caution / Avance"
							: `Quittance ${receipt.monthLabel || ""}`}
					</div>
					<div className="text-xs text-gray-500 mt-1">
						Période&nbsp;: {receipt.periodLabel}
					</div>
				</div>
				<div className="text-xs bg-green-100 px-2 py-0.5 rounded text-green-800 font-semibold">
					{invoice.type === "RENT" ? "Loyer" : "Caution/Avance"}
				</div>
			</div>
			<div className="flex flex-row gap-9 mt-2 mb-1 text-xs text-gray-600">
				<div>
					<span className="font-medium">Montant&nbsp;: </span>
					<span className="font-mono font-semibold ">
						{formatReceiptCurrency(receipt.totalAmount || 0)}
					</span>
				</div>
				<div>
					<span className="font-medium">Payée le&nbsp;: </span>
					{receipt.paidDateLabel
						? receipt.paidDateLabel
						: "-"}
				</div>
			</div>
			<div className="flex gap-2 mt-2">
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={openPreview}
				>
					<Eye className="size-4" />
					Voir
				</Button>
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={() => handleDownload(receipt)}
					disabled={downloadingId === receipt.invoiceId}
				>
					<Download className="size-4" />
					{downloadingId === receipt.invoiceId
						? "Préparation..."
						: "Télécharger"}
				</Button>
			</div>

			<InvoicePreviewDialog
				invoice={invoice}
				isOpen={isPreviewOpen}
				onOpenChange={setIsPreviewOpen}
			/>
		</div>
	);
}

const ITEMS_PER_PAGE = 6;

export default function TenantReceiptPage() {
	const {
		data: invoices,
		isLoading,
		isError,
		error,
	} = useInvoicesWithRelations();
	const { user } = useAuth();
	const [page, setPage] = useState(1);

	const receiptTuples = useMemo(() => {
		const paidInvoices = (invoices || []).filter(
			(inv) => inv.status === InvoiceStatus.PAID
		);
		return paidInvoices.map((invoice) => ({
			receipt: buildRentReceiptViewModel(invoice),
			invoice,
		}));
	}, [invoices]);

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
					Impossible de charger vos quittances&nbsp;: {error?.message}
				</AlertDescription>
			</Alert>
		);
	}

	// Filtrer uniquement les factures payées = quittances
	// const paidInvoices: InvoiceWithRelations[] =
	// 	(invoices || []).filter(
	// 		(inv) => inv.status === InvoiceStatus.PAID
	// 	);

	// // Transforme chaque facture en RentReceiptViewModel pour la card
	// const receiptTuples: Array<{
	// 	receipt: RentReceiptViewModel;
	// 	invoice: InvoiceWithRelations;
	// }> = useMemo(
	// 	() =>
	// 		paidInvoices.map((invoice) => ({
	// 			receipt: buildRentReceiptViewModel(invoice),
	// 			invoice,
	// 		})),
	// 	[paidInvoices]
	// );

	const pageCount = Math.ceil(receiptTuples.length / ITEMS_PER_PAGE);

	const paginatedReceiptTuples =
		receiptTuples.length > ITEMS_PER_PAGE
			? receiptTuples.slice(
				(page - 1) * ITEMS_PER_PAGE,
				page * ITEMS_PER_PAGE
			)
			: receiptTuples;

	return (
		<div className="space-y-6 p-4">
			<PageHeader
				title="Mes quittances"
				description="Accédez à toutes vos quittances de loyer reçues après paiement."
			/>
			{receiptTuples.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-24">
					<Download className="w-12 h-12 text-muted-foreground mb-4" />
					<p className="text-muted-foreground text-lg">
						Aucune quittance disponible.
					</p>
				</div>
			) : (
				<>
					<div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{paginatedReceiptTuples.map(({ receipt, invoice }) => (
							<ReceiptCard key={receipt.invoiceId} receipt={receipt} invoice={invoice} />
						))}
					</div>
					{/* pagination */}
					{receiptTuples.length > ITEMS_PER_PAGE && (
						<div className="flex justify-center mt-6">
							<nav className="flex items-center gap-2" aria-label="Pagination">
								<Button
									size="icon"
									variant="outline"
									disabled={page === 1}
									onClick={() => setPage(page - 1)}
								>
									<span aria-hidden="true">&larr;</span>
								</Button>
								{Array.from({ length: pageCount }).map((_, i) => (
									<Button
										key={i + 1}
										size="icon"
										variant={page === i + 1 ? "default" : "outline"}
										onClick={() => setPage(i + 1)}
										aria-current={page === i + 1 ? "page" : undefined}
									>
										{i + 1}
									</Button>
								))}
								<Button
									size="icon"
									variant="outline"
									disabled={page === pageCount}
									onClick={() => setPage(page + 1)}
								>
									<span aria-hidden="true">&rarr;</span>
								</Button>
							</nav>
						</div>
					)}
				</>
			)}
		</div>
	);
}
