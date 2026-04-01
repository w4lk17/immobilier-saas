import { Badge } from "@/components/ui/badge";

// Définition correcte des variantes supportées par Shadcn UI + Custom
type BadgeVariant = "default" | "secondary" | "destructive" | "outline" | "success" | "warning";

/**
 * Get the appropriate badge variant for a status based on entity type
 */
export function getStatusBadge(
	status: string,
	type: 'contract' | 'invoice' | 'property' | 'expense' | 'user' | 'tenant' | 'manager' | 'owner'
) {
	const normalizedStatus = status.toUpperCase();

	switch (type) {
		case 'contract':
			return getContractStatusBadge(normalizedStatus);
		case 'invoice':
			return getPaymentStatusBadge(normalizedStatus);
		case 'property':
			return getPropertyStatusBadge(normalizedStatus);
		case 'expense':
			return getExpenseStatusBadge(normalizedStatus);
		case 'user':
		case 'tenant':
		case 'manager':
		case 'owner':
			return getUserStatusBadge(normalizedStatus);
		default:
			return <Badge variant="secondary" > {status} </Badge>;
	}
}

function getContractStatusBadge(status: string) {
	const variants: Record<string, BadgeVariant> = {
		ACTIVE: "success",
		PENDING: "warning",
		TERMINATED: "secondary",
		RENEWED: "default",
	};

	const variant = variants[status] || "secondary";
	return <Badge variant={variant}> {status} </Badge>;
}

function getPaymentStatusBadge(status: string) {
	const variants: Record<string, BadgeVariant> = {
		PAID: "success",
		SUCCESS: "success",
		PENDING: "warning",
		PARTIAL: "outline",
		OVERDUE: "destructive",
		CANCELLED: "secondary",
	};

	const variant = variants[status] || "secondary";
	return <Badge variant={variant}> {status} </Badge>;
}

function getPropertyStatusBadge(status: string) {
	const variants: Record<string, BadgeVariant> = {
		AVAILABLE: "success",
		RENTED: "success",
		MAINTENANCE: "outline",
		INACTIVE: "secondary",
	};

	const variant = variants[status] || "default";
	return <Badge variant={variant}> {status} </Badge>;
}

function getExpenseStatusBadge(status: string) {
	const variants: Record<string, BadgeVariant> = {
		PAID: "success",
		PENDING: "warning",
		CANCELLED: "secondary",
	};

	const variant = variants[status] || "secondary";
	return <Badge variant={variant}> {status} </Badge>;
}

function getUserStatusBadge(status: string) {
	const variants: Record<string, BadgeVariant> = {
		ACTIVE: "success",
		INACTIVE: "secondary",
	};

	const variant = variants[status] || "default";
	return <Badge variant={variant}> {status} </Badge>;
}

/**
 * Get CSS color class for status styling
 */
export function getStatusTextColor(status: string, type: 'contract' | 'invoice' | 'property' | 'expense' | 'user') {
	const normalizedStatus = status.toUpperCase();

	const colors: Record<string, string> = {
		// Success / Active
		ACTIVE: "text-green-600",
		SUCCESS: "text-green-600",
		PAID: "text-green-600",
		AVAILABLE: "text-green-600",

		// Warning / Pending
		WARNING: "text-yellow-600",
		PENDING: "text-yellow-600",
		MAINTENANCE: "text-yellow-600",

		// Error / Destructive
		ERROR: "text-red-600",
		FAILED: "text-red-600",
		OVERDUE: "text-red-600",
		DESTRUCTIVE: "text-red-600",

		// Neutral
		NEUTRAL: "text-gray-600",
		DEFAULT: "text-gray-600",
		SECONDARY: "text-gray-600",
		INACTIVE: "text-gray-600",
		CANCELLED: "text-gray-600",
		TERMINATED: "text-gray-600",
		EXPIRED: "text-red-600",
		PARTIALLY_PAID: "text-blue-600",
	};

	return colors[normalizedStatus] || colors.DEFAULT;
}
