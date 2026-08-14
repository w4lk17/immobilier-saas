import { InvoiceStatus, InvoiceType } from "@/types/enums";

export const invoiceTypeLabels: Record<InvoiceType, string> = {
  [InvoiceType.ADVANCE]: "Avance",
  [InvoiceType.CHARGE]: "Charge",
  [InvoiceType.DEPOSIT]: "Caution",
  [InvoiceType.PENALTY]: "Pénalité",
  [InvoiceType.RENT]: "Loyer",
};

export const invoiceStatusLabels: Record<InvoiceStatus, string> = {
  [InvoiceStatus.PENDING]: "En attente",
  [InvoiceStatus.PARTIAL]: "Partielle",
  [InvoiceStatus.PAID]: "Payée",
  [InvoiceStatus.OVERDUE]: "En retard",
  [InvoiceStatus.CANCELLED]: "Annulée",
};
