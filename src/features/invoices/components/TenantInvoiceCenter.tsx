"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CalendarClock,
  CheckCircle2,
  Download,
  Eye,
  FileText,
  ReceiptText,
  Wallet,
} from "lucide-react";
import { pdf } from "@react-pdf/renderer";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { InvoiceWithRelations } from "@/types";
import { InvoiceStatus } from "@/types/enums";
import { cn } from "@/lib/utils";
import {
  RentReceiptViewModel,
  buildRentReceiptViewModel,
  formatReceiptCurrency,
} from "./rentReceiptViewModel";
import { InvoicePreviewDialog } from "./InvoicePreviewDialog";
import { RentReceiptPdfDocument } from "./RentReceiptPdfDocument";
import { invoiceStatusLabels } from "../lib/invoiceLabels";

type TenantInvoiceCenterProps = {
  invoices: InvoiceWithRelations[];
};

type FilterKey = "all" | "paid" | "pending" | "overdue";

const FILTERS: Array<{ key: FilterKey; label: string }> = [
  { key: "all", label: "Toutes les factures" },
  { key: "paid", label: "Payées" },
  { key: "pending", label: "En attente" },
  { key: "overdue", label: "En retard" },
];

const statusClasses: Record<InvoiceStatus, string> = {
  [InvoiceStatus.PAID]:
    "border-green-200 bg-green-50 text-green-700",
  [InvoiceStatus.PENDING]:
    "border-yellow-200 bg-yellow-50 text-yellow-700",
  [InvoiceStatus.PARTIAL]:
    "border-orange-200 bg-orange-50 text-orange-700",
  [InvoiceStatus.OVERDUE]: "",
  [InvoiceStatus.CANCELLED]:
    "border-zinc-200 bg-zinc-50 text-zinc-600",
};

function statusMatchesFilter(status: InvoiceStatus, filter: FilterKey): boolean {
  if (filter === "all") return true;
  if (filter === "paid") return status === InvoiceStatus.PAID;
  if (filter === "pending") {
    return status === InvoiceStatus.PENDING || status === InvoiceStatus.PARTIAL;
  }
  return status === InvoiceStatus.OVERDUE;
}

function sortInvoices(
  invoices: InvoiceWithRelations[]
): InvoiceWithRelations[] {
  return [...invoices].sort((a, b) => {
    const aTime = new Date(a.dueDate).getTime();
    const bTime = new Date(b.dueDate).getTime();
    return (Number.isNaN(bTime) ? 0 : bTime) - (Number.isNaN(aTime) ? 0 : aTime);
  });
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  tone = "default",
}: {
  icon: typeof ReceiptText;
  label: string;
  value: string;
  tone?: "default" | "success" | "warning" | "danger";
}) {
  const toneClass = {
    default: "bg-muted text-muted-foreground",
    success: "bg-green-50 text-green-700",
    warning: "bg-yellow-50 text-yellow-700",
    danger: "bg-red-50 text-red-700",
  }[tone];

  return (
    <Card className="gap-3 rounded-lg py-4">
      <CardContent className="flex items-center gap-3 px-4">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-md",
            toneClass
          )}
        >
          <Icon className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="truncate text-xl font-semibold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

async function downloadInvoice(receipt: RentReceiptViewModel) {
  const blob = await pdf(
    <RentReceiptPdfDocument receipt={receipt} />
  ).toBlob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `facture-${receipt.monthLabel}.pdf`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function TenantInvoiceCenter({ invoices }: TenantInvoiceCenterProps) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceWithRelations | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  // Pagination
  const ITEMS_PER_PAGE = 4;
  const [page, setPage] = useState(1);

  const sortedInvoices = useMemo(() => sortInvoices(invoices), [invoices]);
  // Uniquement factures : on ne garde que les items dont receipt.isReceipt === false
  const receipts = useMemo(
    () =>
      sortedInvoices
        .map((invoice) => ({
          invoice,
          receipt: buildRentReceiptViewModel(invoice),
        }))
        .filter(({ invoice }) => invoice.type === "RENT"),
    // .filter(({ receipt }) => !receipt.isReceipt),
    [sortedInvoices]
  );

  const filteredReceipts = receipts.filter(({ invoice }) =>
    statusMatchesFilter(invoice.status, filter)
  );
  const paidReceipts = receipts.filter(
    ({ invoice }) => invoice.status === InvoiceStatus.PAID
  );
  const pendingReceipts = receipts.filter(
    ({ invoice }) =>
      invoice.status === InvoiceStatus.PENDING ||
      invoice.status === InvoiceStatus.PARTIAL ||
      invoice.status === InvoiceStatus.OVERDUE
  );
  const totalDue = pendingReceipts.reduce(
    (sum, { receipt }) => sum + receipt.totalAmount - receipt.paidAmount,
    0
  );
  const nextPayment =
    pendingReceipts.at(-1)?.receipt ?? pendingReceipts[0]?.receipt;
  const latestInvoice = paidReceipts[0]?.receipt;

  const openPreview = (invoice: InvoiceWithRelations) => {
    setSelectedInvoice(invoice);
    setIsPreviewOpen(true);
  };

  const handleDownload = async (receipt: RentReceiptViewModel) => {
    try {
      setDownloadingId(receipt.invoiceId);
      await downloadInvoice(receipt);
    } finally {
      setDownloadingId(null);
    }
  };

  if (invoices.length === 0) {
    return (
      <Card className="rounded-lg py-12">
        <CardContent className="flex flex-col items-center px-6 text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-md bg-muted">
            <FileText className="size-7 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold">
            Aucune facture disponible
          </h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Vos factures apparaîtront ici dès leur émission.
          </p>
        </CardContent>
      </Card>
    );
  }

  const paginatedReceipts =
    filteredReceipts.length > ITEMS_PER_PAGE
      ? filteredReceipts.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
      )
      : filteredReceipts;

  const pageCount = Math.ceil(filteredReceipts.length / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={CheckCircle2}
          label="Reste à payer"
          value={formatReceiptCurrency(totalDue)}
          tone={totalDue > 0 ? "danger" : "success"}
        />
        <SummaryCard
          icon={AlertCircle}
          label="Factures à régler"
          value={`${pendingReceipts.length}`}
          tone={pendingReceipts.length > 0 ? "warning" : "default"}
        />
        <SummaryCard
          icon={FileText}
          label="Dernière facture payée"
          value={latestInvoice?.monthLabel ?? "-"}
          tone="success"
        />
        <SummaryCard
          icon={CalendarClock}
          label="Prochaine échéance"
          value={nextPayment ? nextPayment.dueDateLabel : "-"}
          tone={nextPayment ? "danger" : "default"}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            Factures de loyer
          </h2>
          <p className="text-sm text-muted-foreground">
            Consultez vos factures et téléchargez-les.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {FILTERS.map((item) => (
            <Button
              key={item.key}
              type="button"
              variant={filter === item.key ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setFilter(item.key);
                setPage(1);
              }}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-3">
        {filteredReceipts.length > 0 ? (
          paginatedReceipts.map(
            ({
              invoice,
              receipt,
            }: {
              invoice: InvoiceWithRelations;
              receipt: RentReceiptViewModel;
            }) => (
              <Card key={invoice.id} className="rounded-lg py-0">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 gap-4">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary-foreground">
                        <FileText className="size-6 text-foreground" />
                      </div>

                      <div className="min-w-0 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-semibold">
                            <span className="flex items-center gap-2">
                              Facture - {receipt.monthLabel}
                              <Badge variant="secondary" className="ml-2">
                                Facture
                              </Badge>
                            </span>
                          </h3>
                          <Badge
                            variant={
                              invoice.status === "OVERDUE"
                                ? "destructive"
                                : "outline"
                            }
                            className={statusClasses[invoice.status]}
                          >
                            {invoiceStatusLabels[invoice.status] ??
                              invoice.status}
                          </Badge>
                        </div>

                        <div className="grid gap-1 text-sm text-muted-foreground md:grid-cols-2">
                          <span>
                            Référence: {receipt.invoiceNumber}
                          </span>
                          {invoice.type === "RENT" && (
                            <span>
                              Période: {receipt.periodLabel}
                            </span>
                          )}
                          <span className="md:col-span-2">
                            Logement: {receipt.housingAddress}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 lg:min-w-[300px]">
                      <div className="flex items-end justify-between gap-4 lg:justify-end">
                        <div className="lg:text-right">
                          <p className="text-xs text-muted-foreground">
                            Échéance
                          </p>
                          <p className="text-sm font-medium">
                            {receipt.dueDateLabel}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            Montant
                          </p>
                          <p className="text-lg font-semibold">
                            {formatReceiptCurrency(receipt.totalAmount)}
                          </p>
                        </div>
                      </div>

                      <Separator className="lg:hidden" />

                      <div className="flex flex-wrap gap-2 lg:justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => openPreview(invoice)}
                        >
                          <Eye className="size-4" />
                          Voir
                        </Button>
                        {invoice.status !== InvoiceStatus.PAID && (
                          <>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload(receipt)}
                              disabled={
                                downloadingId === receipt.invoiceId
                              }
                            >
                              <Download className="size-4" />
                              {downloadingId === receipt.invoiceId
                                ? "Préparation..."
                                : "Télécharger"}
                            </Button>

                            <Button size="sm" asChild>
                              <Link href="/tenant-portal/my-payments">
                                <Wallet className="size-4" />
                                Payer
                              </Link>
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          )
        ) : (
          <Card className="rounded-lg py-10">
            <CardContent className="text-center text-sm text-muted-foreground">
              Aucune facture ne correspond à ce filtre.
            </CardContent>
          </Card>
        )}
      </div>
      {/* pagination */}
      {filteredReceipts.length > ITEMS_PER_PAGE && (
        <div className="flex justify-center mt-4">
          <nav
            className="flex items-center gap-2"
            aria-label="Pagination"
          >
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

      <InvoicePreviewDialog
        invoice={selectedInvoice}
        isOpen={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
      />
    </div>
  );
}