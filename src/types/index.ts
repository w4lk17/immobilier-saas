import {
	UserRole,
	PropertyType,
	PropertyStatus,
	ContractStatus,
	PaymentType,
	PaymentStatus,
	ExpenseType,
	ExpenseStatus,
} from './enums'; // Assurez-vous que le chemin vers vos enums est correct

// --- Types de base pour les utilisateurs (sans données sensibles) ---

export interface FrontendUserSnippet {
	id: number;
	email: string;
	role: UserRole;
	firstName?: string | null;
	lastName?: string | null;
	createdAt: Date | string;
	updatedAt: Date | string;
	// PAS de password ou hashedRefreshToken ici
}

// --- Types pour les profils liés aux utilisateurs ---

export interface FrontendOwner {
	id: number;
	userId: number;
	phoneNumber?: string | null;
	// Relation optionnelle (si incluse par l'API)
	user?: FrontendUserSnippet | null;
	// Relation optionnelle pour la liste des propriétés (généralement chargée séparément)
	// properties?: FrontendProperty[];
}

export interface FrontendEmployee {
	id: number;
	userId: number;
	position: string;
	phoneNumber?: string | null;
	hireDate: Date | string;
	// Relation optionnelle (si incluse par l'API)
	user?: FrontendUserSnippet | null;
	// Relations optionnelles (généralement chargées séparément)
	// managedProperties?: FrontendProperty[];
	// managedContracts?: FrontendContract[];
}

export interface FrontendTenant {
	id: number;
	userId: number;
	phoneNumber?: string | null;
	// Relation optionnelle (si incluse par l'API)
	user?: FrontendUserSnippet | null;
	// Relations optionnelles (généralement chargées séparément)
	// contracts?: FrontendContract[];
	// payments?: FrontendPayment[];
}


// --- Types pour les entités principales ---

export interface FrontendProperty {
	id: number;
	ownerId: number;
	managerId?: number | null;
	address: string;
	type: PropertyType;
	description?: string | null;
	rentAmount: number;
	charges: number;
	status: PropertyStatus;
	createdAt: Date | string;
	updatedAt: Date | string;
}

export interface FrontendContract {
	id: number;
	propertyId: number;
	tenantId: number;
	managerId: number;
	startDate: Date | string;
	endDate?: Date | string | null;
	rentAmount: number;
	depositAmount: number;
	status: ContractStatus;
	createdAt: Date | string;
	updatedAt: Date | string;
}

export interface FrontendPayment {
	id: number;
	contractId: number;
	tenantId: number;
	amount: number;
	type: PaymentType;
	status: PaymentStatus;
	dueDate: Date | string;
	paidDate?: Date | string | null;
	createdAt: Date | string;
	updatedAt: Date | string;
}

export interface FrontendExpense {
	id: number;
	propertyId: number;
	amount: number;
	description: string;
	date: Date | string;
	type: ExpenseType;
	status: ExpenseStatus;
	createdAt: Date | string;
	updatedAt: Date | string;
}


// --- Types combinés avec relations (utilisés pour les GET / GET by ID) ---

export interface PropertyWithRelations extends FrontendProperty {
	owner?: FrontendOwner | null;
	manager?: FrontendEmployee | null; // Manager est un Employee
	// Ajoutez contracts/expenses ici si l'API les retourne systématiquement avec la propriété
	// contracts?: FrontendContract[];
	// expenses?: FrontendExpense[];
}

export interface ContractWithRelations extends FrontendContract {
	property?: FrontendProperty | null; // Relation vers la propriété de base
	tenant?: FrontendTenant | null;
	manager?: FrontendEmployee | null; // Manager est un Employee
	// Ajoutez payments ici si nécessaire
	// payments?: FrontendPayment[];
}

export interface PaymentWithRelations extends FrontendPayment {
	contract?: FrontendContract | null; // Relation vers le contrat de base
	tenant?: FrontendTenant | null;
}

export interface ExpenseWithRelations extends FrontendExpense {
	property?: FrontendProperty | null; // Relation vers la propriété de base
}

// Potentiellement des types pour les autres entités avec leurs relations si vos endpoints API
// sont conçus pour retourner ces données imbriquées (moins courant pour les listes)
export interface OwnerWithRelations extends FrontendOwner { properties: FrontendProperty[] }
// export interface TenantWithRelations extends FrontendTenant { contracts: FrontendContract[], payments: FrontendPayment[] }
// export interface EmployeeWithRelations extends FrontendEmployee { managedProperties: FrontendProperty[], managedContracts: FrontendContract[] }

// --- Type pour le Store d'Authentification ---
// (Correspond à FrontendUserSnippet mais on lui donne un nom spécifique au store)
export interface AuthUser extends FrontendUserSnippet { }