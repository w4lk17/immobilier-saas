
// Miroir des enums définis dans le fichier schema.prisma du backend.

export enum UserRole {
	ADMIN = 'ADMIN',
	EMPLOYEE = 'EMPLOYEE',
	OWNER = 'OWNER',
	TENANT = 'TENANT',
	USER = 'USER',
}

export enum PropertyType {
	HOUSE = 'HOUSE',
	APARTMENT = 'APARTMENT',
	COMMERCIAL = 'COMMERCIAL',
	LAND = 'LAND',
}

export enum PropertyStatus {
	AVAILABLE = 'AVAILABLE',
	RENTED = 'RENTED',
	MAINTENANCE = 'MAINTENANCE',
	UNAVAILABLE = 'UNAVAILABLE',
}

export enum ContractStatus {
	DRAFT = 'DRAFT',
	ACTIVE = 'ACTIVE',
	TERMINATED = 'TERMINATED',
	EXPIRED = 'EXPIRED',
}

export enum PaymentType {
	RENT = 'RENT',
	DEPOSIT = 'DEPOSIT',
	CHARGES = 'CHARGES',
}

export enum PaymentStatus {
	PENDING = 'PENDING',
	PAID = 'PAID',
	LATE = 'LATE',
	CANCELLED = 'CANCELLED',
}

export enum ExpenseType {
	MAINTENANCE = 'MAINTENANCE',
	REPAIR = 'REPAIR',
	TAXES = 'TAXES',
	INSURANCE = 'INSURANCE',
	UTILITIES = 'UTILITIES',
	OTHER = 'OTHER',
}

export enum ExpenseStatus {
	PENDING = 'PENDING',
	PAID = 'PAID',
	CANCELLED = 'CANCELLED',
}