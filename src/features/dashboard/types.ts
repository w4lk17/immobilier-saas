export type DashboardActivity = {
	id: string;
	action: string;
	user?: string;
	type: "success" | "warning" | "info" | "error";
	occurredAt: string;
};

export type AdminDashboardData = {
	totalTenants: number;
	activeTenants: number;
	totalManagers: number;
	totalProperties: number;
	totalContracts: number;
	activeContracts: number;
	monthlyRevenue: number;
	pendingInvoices: number;
	recentInvoices: any[];
	recentActivity: DashboardActivity[];
};

export type ManagerDashboardData = {
	totalProperties: number;
	occupiedProperties: number;
	vacantProperties: number;
	totalContracts: number;
	activeContracts: number;
	totalTenants: number;
	monthlyRevenue: number;
	monthlyExpenses: number;
	pendingInvoices: number;
	recentInvoices: any[];
	recentExpenses: any[];
};

export type OwnerDashboardData = {
	monthlyRevenue: number;
	annualRevenue: number;
	totalProperties: number;
	occupiedProperties: number;
	vacantProperties: number;
	occupancyRate: number;
	activeTenants: number;
	activeContracts: number;
	recentPayments: any[];
	recentExpenses: any[];
	propertySummary: any[];
};

export type TenantDashboardData = {
	monthlyRent: number;
	currentMonthRentDue?: number;
	nextInvoice: any | null;
	nextRentInvoice?: any | null;
	daysRemaining: number | null;
	paymentStatus: string | null;
	activeContract: any | null;
	currentHousing: {
		title: string;
		address: string;
		owner?: { name: string; phone?: string | null };
		leaseStart: string;
		leaseEnd?: string | null;
	} | null;
	recentPayments: any[];
	documentSummary: {
		contract: number;
		receipts: number;
		insurance: number;
	};
	maintenanceSummary: {
		total: number;
		pending: number;
		inProgress: number;
		completed: number;
	};
	unreadMessages: number;
};
