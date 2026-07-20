import { InvoiceStatus, InvoiceType } from "@/types/enums";

export const invoiceTypeLabels: Record<InvoiceType, string> = {
  [InvoiceType.ADVANCE]: "Avance",
  [InvoiceType.CHARGE]: "Charge",
  [InvoiceType.DEPOSIT]: "Caution",
  [InvoiceType.PENALTY]: "Pénalité",
  [InvoiceType.RENT]: "Loyer",
};

export const invoiceStatusLabels: Record<InvoiceStatus, string> = {
  [InvoiceStatus.CANCELLED]: "Annulée",
  [InvoiceStatus.OVERDUE]: "En retard",
  [InvoiceStatus.PAID]: "Payée",
  [InvoiceStatus.PARTIAL]: "Partielle",
  [InvoiceStatus.PENDING]: "En attente",
};
