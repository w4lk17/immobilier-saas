
// Miroir des enums définis dans le fichier schema.prisma du backend.

export enum UserRole {
	ADMIN = 'ADMIN',
	MANAGER = 'MANAGER',
	OWNER = 'OWNER',
	TENANT = 'TENANT',
	USER = 'USER',
}

export enum PropertyType {
	APARTMENT = 'APARTMENT',
	BUILDING = 'BUILDING',
	BUNGALOW = 'BUNGALOW',
	DUPLEX = 'DUPLEX',
	HOUSE = 'HOUSE',
	LAND = 'LAND',
	VILLA = 'VILLA',
	OTHER = 'OTHER',
}

export enum PropertyStatus {
	AVAILABLE = 'AVAILABLE',
	FOR_RENT = 'FOR_RENT',
	MAINTENANCE = 'MAINTENANCE',
	UNAVAILABLE = 'UNAVAILABLE',
}

export enum RentalType {
	APARTMENT = 'APARTMENT',
	STUDIO = 'STUDIO',
	STORE = 'STORE',
	VILLA = 'VILLA',
}

export enum RentalStatus {
	AVAILABLE = 'AVAILABLE',
	BOOKED = 'BOOKED',
	MAINTENANCE = 'MAINTENANCE',
	OCCUPIED = 'OCCUPIED',
}

/** Nature juridique du contrat de location */
export enum LeaseType {
	RESIDENTIAL_LEASE = 'RESIDENTIAL_LEASE',
	COMMERCIAL_LEASE = 'COMMERCIAL_LEASE',
	PROFESSIONAL_LEASE = 'PROFESSIONAL_LEASE',
	FURNISHED_LEASE = 'FURNISHED_LEASE',
}

export enum ContractStatus {
	PENDING = 'PENDING',
	ACTIVE = 'ACTIVE',
	TERMINATED = 'TERMINATED',
	EXPIRED = 'EXPIRED',
}

export enum InvoiceType {
	RENT = 'RENT',
	CHARGE = 'CHARGE',
	DEPOSIT = 'DEPOSIT',
	PENALTY = 'PENALTY',
}

export enum InvoiceStatus {
	PENDING = 'PENDING',
	PAID = 'PAID',
	PARTIAL = 'PARTIAL',
	OVERDUE = 'OVERDUE',
	CANCELLED = 'CANCELLED',
}

export enum PaymentProvider {
	STRIPE='STRIPE',
	MOBILE_MONEY = 'MOBILE_MONEY',
}

export enum PaymentTransactionStatus {
	PENDING = 'PENDING',
	SUCCESS = 'SUCCESS',
	FAILED = 'FAILED',
	REFUNDED = 'REFUNDED',
}

export enum ExpenseType {
	MAINTENANCE = 'MAINTENANCE',
	REPAIR = 'REPAIR',
	TAX = 'TAX',
	INSURANCE = 'INSURANCE',
	UTILITY = 'UTILITY',
	OTHER = 'OTHER',
}

export enum ExpenseStatus {
	PENDING = 'PENDING',
	PAID = 'PAID',
	CANCELLED = 'CANCELLED',
}

/** Type de contrat pour les EMPLOYÉS (RH) */
export enum EmploymentType {
	CDI = 'CDI',
	CDD = 'CDD',
	INTERIM = 'INTERIM',
	STAGE = 'STAGE',
	OTHER = 'OTHER',
}

