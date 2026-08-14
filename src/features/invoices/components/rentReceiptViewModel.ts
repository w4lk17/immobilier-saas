import { InvoiceWithRelations } from "@/types";
import { InvoiceStatus } from "@/types/enums";

export type RentReceiptViewModel = {
	invoiceId: number;
	invoiceNumber: string;
	documentTitle: string;
	isReceipt: boolean;
	status: InvoiceStatus;
	periodLabel: string;
	periodStart: string;
	periodEnd: string;
	monthLabel: string;
	housingAddress: string;
	ownerName: string;
	ownerAddressLines: string[];
	tenantName: string;
	tenantAddressLines: string[];
	rentAmount: number;
	chargesAmount: number;
	totalAmount: number;
	paidAmount: number;
	dueDateLabel: string;
	paidDateLabel: string;
	issuedAtLabel: string;
	issuedCity: string;
};

const EMPTY = "-";

function toNumber(value: unknown): number {
	const numberValue = typeof value === "number" ? value : Number(value ?? 0);
	return Number.isFinite(numberValue) ? numberValue : 0;
}

function toDate(value?: string | Date | null): Date | null {
	if (!value) return null;
	const date = value instanceof Date ? value : new Date(value);
	return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(value?: string | Date | null): string {
	const date = toDate(value);
	if (!date) return EMPTY;

	return new Intl.DateTimeFormat("fr-FR", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	}).format(date);
}

function formatLongMonth(value?: string | Date | null): string {
	const date = toDate(value);
	if (!date) return EMPTY;

	const label = new Intl.DateTimeFormat("fr-FR", {
		month: "long",
		year: "numeric",
	}).format(date);

	return label.charAt(0).toUpperCase() + label.slice(1);
}

function startOfMonth(date: Date): Date {
	return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date): Date {
	return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function fullName(civility?: string | null, lastName?: string | null, firstName?: string | null): string {
	const name = `${civility ?? ""} ${lastName ?? ""} ${firstName ?? ""}`.trim();
	return name || EMPTY;
}

function compactLines(...lines: Array<string | null | undefined>): string[] {
	const compacted = lines.map((line) => line?.trim()).filter(Boolean) as string[];
	return compacted.length > 0 ? compacted : [EMPTY];
}

function inferCity(address: string): string {
	if (!address || address === EMPTY) return EMPTY;
	const parts = address.split(",").map((part) => part.trim()).filter(Boolean);
	return parts.at(-1)?.replace(/^\d{4,6}\s*/, "") || EMPTY;
}

export function formatReceiptCurrency(value: number): string {
	return new Intl.NumberFormat("fr-FR", {
		style: "currency",
		currency: "XOF",
		maximumFractionDigits: 0,
	}).format(value);
}

export function buildRentReceiptViewModel(invoice: InvoiceWithRelations): RentReceiptViewModel {
	const tenantUser = invoice.tenant?.user;
	const ownerUser = invoice.contract?.owner?.user || invoice.contract?.property?.owner?.user;
	const contract = invoice.contract;
	const dueDate = toDate(invoice.dueDate);
	const periodStart = dueDate ? startOfMonth(dueDate) : null;
	const periodEnd = dueDate ? endOfMonth(dueDate) : null;
	const housingAddress = contract?.address || contract?.rental?.property?.address || EMPTY;
	const totalAmount = toNumber(invoice.amountDue);
	const rentAmount = toNumber(contract?.rentAmount);
	const chargesAmount = toNumber(contract?.chargesAmount);
	const fallbackRent = rentAmount > 0 || chargesAmount > 0 ? rentAmount : totalAmount;
	const isReceipt = invoice.status === InvoiceStatus.PAID;

	return {
		invoiceId: invoice.id,
		invoiceNumber: invoice.invoiceNumber?.trim() || EMPTY,
		documentTitle: isReceipt ? "QUITTANCE DE LOYER" : "FACTURE DE LOYER",
		isReceipt,
		status: invoice.status,
		periodLabel: periodStart && periodEnd
			? `du ${formatDate(periodStart)} au ${formatDate(periodEnd)}`
			: EMPTY,
		periodStart: formatDate(periodStart),
		periodEnd: formatDate(periodEnd),
		monthLabel: formatLongMonth(invoice.dueDate),
		housingAddress,
		ownerName: fullName(ownerUser?.civility, ownerUser?.lastName, ownerUser?.firstName),
		ownerAddressLines: compactLines(ownerUser?.address),
		tenantName: fullName(tenantUser?.civility, tenantUser?.lastName, tenantUser?.firstName),
		tenantAddressLines: compactLines(contract?.address),
		// tenantAddressLines: compactLines(tenantUser?.address, contract?.address),
		rentAmount: fallbackRent,
		chargesAmount,
		totalAmount,
		paidAmount: toNumber(invoice.paidAmount),
		dueDateLabel: formatDate(invoice.dueDate),
		paidDateLabel: formatDate(invoice.paidDate),
		issuedAtLabel: formatDate(invoice.paidDate ?? invoice.updatedAt ?? invoice.createdAt),
		issuedCity: inferCity(housingAddress),
	};
}
