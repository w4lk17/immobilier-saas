import {
	UserRole,
	PropertyType,
	PropertyStatus,
	ContractStatus,
	EmploymentType,
	ExpenseType,
	ExpenseStatus,
	LeaseType,
	RentalType,
	RentalStatus,
	PaymentProvider,
	PaymentTransactionStatus,
	InvoiceType,
	InvoiceStatus,
} from './enums';

// ==========================================
// BASE PROFILE TYPES
// ==========================================

export interface Owner {
	id: number;
	userId: number;
	user?: User; // Relation
}

export interface Manager {
	id: number;
	userId: number;
	position: string;
	hireDate: string | Date;
	terminationDate?: string | Date | null;
	employmentType: EmploymentType;
	user?: User; // Relation
}

export interface Tenant {
	id: number;
	userId: number;
	oldAddress?: string | null;
	user?: User; // Relation
}

// ==========================================
// MAIN USER TYPE (Optimized Schema)
// ==========================================

export interface User {
	id: number;
	email: string;
	role: UserRole;
	firstName: string | null;
	lastName: string | null;
	phoneNumber: string | null;
	civility: string | null;
	dateOfBirth: Date | string | null;
	address: string | null;
	pictureUrl: string | null;
	workPlace: string | null;
	occupation: string | null;
	identityDocumentNumber: string | null;
	identityDocumentType: string | null;
	identityDeliveryCity: string | null;
	identityDeliveryDate: Date | string | null;
	identityExpiryDate: Date | string | null;
	pacLastName: string | null;
	pacFirstName: string | null;
	pacPhoneNumber: string | null;
	isActive: boolean;
	createdAt: Date | string;
	updatedAt: Date | string;

	// Relations optionnelles (renvoyées par /users/me par exemple)
	ownerProfile?: Owner | null;
	managerProfile?: Manager | null;
	tenantProfile?: Tenant | null;
}

// Type spécifique pour l'utilisateur courant (retour de GET /users/me)
export interface CurrentUser extends User {
	// On s'assure que les profils sont présents même si null
	ownerProfile: Owner | null;
	managerProfile: Manager | null;
	tenantProfile: Tenant | null;
}

// ==========================================
// MAIN ENTITY TYPES
// ==========================================

export interface Property {
	id: number;
	ownerId: number;
	managerId: number | null;
	address: string;
	description: string | null;
	type: PropertyType;
	propertyValue: number;
	status: PropertyStatus;
	createdAt: Date | string;
	updatedAt: Date | string;

	// Relations
	owner?: Owner | null;
	manager?: Manager | null;
	rentals?: Rental[];
}

export interface Rental {
	id: number;
	propertyId: number;
	name: string;
	type: RentalType;
	status: RentalStatus;
	roomCount: number;
	rentalValue: number;
	charges: number;
	createdAt: Date | string;
	updatedAt: Date | string;

	// Relations
	property?: Property;
	contracts?: Contract[];
	expenses?: Expense[];
}

export interface Contract {
	id: number;
	ownerId: number;
	propertyId: number;
	rentalId: number;
	tenantId: number;
	managerId: number | null;
	rentDeposit: number;
	rentAdvance: number;
	startDate: Date | string;
	endDate: Date | string | null;
	dayAddToPaymentDay: number;
	paymentStartAfter: number;
	rentAmount: number;
	depositAmount: number;
	leaseType: LeaseType;
	status: ContractStatus;
	createdAt: Date | string;
	updatedAt: Date | string;

	// Relations
	owner?: Owner;
	property?: Property;
	rental?: Rental;
	tenant?: Tenant;
	manager?: Manager | null;
	invoices?: Invoice[];
}

export interface Invoice {
	id: number;
	invoiceNumber: string;
	contractId: number;
	tenantId: number;
	amountDue: number;
	paidAmount: number;
	type: InvoiceType;
	status: InvoiceStatus;
	dueDate: Date | string;
	paidDate: Date | string | null;
	createdAt: Date | string;
	updatedAt: Date | string;

	// Relations
	contract?: Contract;
	tenant?: Tenant;
	transactions?: PaymentTransaction[];
}

export interface PaymentTransaction {
	id: number;
	invoiceId: number;
	provider: PaymentProvider;
	providerRef: string | null;
	amount: number;
	status: PaymentTransactionStatus;
	rawPayload: any | null;
	createdAt: Date | string;
	updatedAt: Date | string;

	invoice?: Invoice;
}

export interface Expense {
	id: number;
	propertyId: number;
	rentalId: number | null;
	recordedById: number;
	amount: number;
	description: string;
	date: Date | string;
	type: ExpenseType;
	status: ExpenseStatus;
	createdAt: Date | string;
	updatedAt: Date | string;

	// Relations
	property?: Property;
	rental?: Rental | null;
	recordedBy?: User;
}

// ==========================================
// RELATION TYPES (For Lists & Detailed Views)
// ==========================================

// --- Types With User (Essential for displaying names) ---

export type OwnerWithUser = Owner & { user: User };
export type ManagerWithUser = Manager & { user: User };
export type TenantWithUser = Tenant & { user: User };

// --- Types With Relations (For detailed pages) ---

export interface PropertyWithRelations extends Property {
	owner: OwnerWithUser;
	manager: ManagerWithUser | null;
	rentals?: Rental[];
	_count?: { rentals: number; expenses: number };
}

export interface RentalWithRelations extends Rental {
	property: Property;
	contracts?: ContractWithRelations[];
	_count?: { contracts: number; expenses: number };
}

export interface ContractWithRelations extends Contract {
	tenant: TenantWithUser;
	owner: OwnerWithUser;
	manager: ManagerWithUser | null;
	property: Property;
	rental: Rental;
	invoices?: Invoice[];
}

export interface InvoiceWithRelations extends Invoice {
	contract?: ContractWithRelations;
	tenant: TenantWithUser;
	transactions: PaymentTransaction[];
}

export interface ExpenseWithRelations extends Expense {
	property: Property;
	rental: Rental | null;
	recordedBy: User;
}

// ==========================================
// EXTENDED RELATION TYPES (Pour les Dashboards)
// ==========================================

// Propriétaire avec ses biens (Pour le dashboard Owner)
export interface OwnerWithRelations extends OwnerWithUser {
	properties: Property[];
	contracts: Contract[];
}

// Locataire avec ses contrats/factures (Pour le dashboard Tenant)
export interface TenantWithRelations extends TenantWithUser {
	contracts: Contract[];
	invoices: Invoice[];
}

// Employé avec ses assignations (Pour le dashboard Manager)
export interface ManagerWithRelations extends ManagerWithUser {
	managedProperties: Property[];
	managedContracts: Contract[];
}

// ==========================================
// AUTH TYPES
// ==========================================

export interface LoginDto {
	email: string;
	password: string;
}

export interface RegisterDto {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	phoneNumber?: string;
}

// Type pour l'objet request.user (utilisateur courant léger)
export interface RequestUser {
	id: number;
	email: string;
	role: UserRole;
	isActive: boolean;
}

export { UserRole, EmploymentType };
