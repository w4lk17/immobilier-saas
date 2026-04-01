import { UserRole } from '@/types/enums';

/**
 * Permission enumeration for RBAC (Role-Based Access Control)
 */
export enum Permission {
	// Users
	USERS_READ = 'users:read',
	USERS_CREATE = 'users:create',
	USERS_UPDATE = 'users:update',
	USERS_DELETE = 'users:delete',

	// Properties
	PROPERTIES_READ = 'properties:read',
	PROPERTIES_CREATE = 'properties:create',
	PROPERTIES_UPDATE = 'properties:update',
	PROPERTIES_DELETE = 'properties:delete',

	// Rentals (Nouveau)
	RENTALS_READ = 'rentals:read',
	RENTALS_CREATE = 'rentals:create',
	RENTALS_UPDATE = 'rentals:update',
	RENTALS_DELETE = 'rentals:delete',

	// Contracts
	CONTRACTS_READ = 'contracts:read',
	CONTRACTS_CREATE = 'contracts:create',
	CONTRACTS_APPROVE = 'contracts:approve',
	CONTRACTS_DELETE = 'contracts:delete',

	// Owners
	OWNERS_READ = 'owners:read',
	OWNERS_CREATE = 'owners:create',
	OWNERS_UPDATE = 'owners:update',
	OWNERS_DELETE = 'owners:delete',

	// Tenants
	TENANTS_READ = 'tenants:read',
	TENANTS_CREATE = 'tenants:create',
	TENANTS_UPDATE = 'tenants:update',
	TENANTS_DELETE = 'tenants:delete',

	// Managers 
	MANAGERS_READ = 'managers:read',
	MANAGERS_CREATE = 'managers:create',
	MANAGERS_UPDATE = 'managers:update',
	MANAGERS_DELETE = 'managers:delete',

	// Expenses
	EXPENSES_READ = 'expenses:read',
	EXPENSES_CREATE = 'expenses:create',
	EXPENSES_UPDATE = 'expenses:update',
	EXPENSES_DELETE = 'expenses:delete',

	// Invoices (Anciennement Payments)
	INVOICES_READ = 'invoices:read',
	INVOICES_CREATE = 'invoices:create',
	INVOICES_UPDATE = 'invoices:update',
	INVOICES_DELETE = 'invoices:delete',

	// Reports
	REPORTS_VIEW = 'reports:view',
	REPORTS_EXPORT = 'reports:export',
}


/**
 * Role-based permission mapping
 */
const rolePermissions: Record<UserRole, Permission[]> = {
	[UserRole.ADMIN]: [
		// Admins have all permissions
		...Object.values(Permission),
	],
	[UserRole.MANAGER]: [
		// Manager (Manager) can manage properties, rentals, contracts, tenants, expenses, invoices,...
		Permission.PROPERTIES_READ,
		Permission.PROPERTIES_CREATE,
		Permission.PROPERTIES_UPDATE,
		Permission.PROPERTIES_DELETE, // Selon ta matrice, ils peuvent supprimer

		Permission.RENTALS_READ,
		Permission.RENTALS_CREATE,
		Permission.RENTALS_UPDATE,
		Permission.RENTALS_DELETE,

		Permission.CONTRACTS_READ,
		Permission.CONTRACTS_CREATE,
		Permission.CONTRACTS_APPROVE,
		Permission.CONTRACTS_DELETE,

		Permission.OWNERS_READ, // Read only sur les owners
		Permission.TENANTS_READ,
		Permission.TENANTS_CREATE,
		Permission.TENANTS_UPDATE,

		Permission.EXPENSES_READ,
		Permission.EXPENSES_CREATE,
		Permission.EXPENSES_UPDATE,
		Permission.EXPENSES_DELETE,

		Permission.INVOICES_READ,
		Permission.INVOICES_CREATE,
		Permission.INVOICES_UPDATE,

		Permission.REPORTS_VIEW,
	],
	[UserRole.OWNER]: [
		// Owners can only view their own properties, contracts, expenses and invoices
		Permission.PROPERTIES_READ,
		Permission.CONTRACTS_READ,
		Permission.EXPENSES_READ,
		Permission.INVOICES_READ,
		Permission.REPORTS_VIEW,
	],
	[UserRole.TENANT]: [
		// Tenants can only view their own contracts and invoices
		Permission.CONTRACTS_READ,
		Permission.INVOICES_READ,
	],
	[UserRole.USER]: [
		// Regular users have no permissions by default
	],
};

/**
 * Check if a role has a specific permission
 * @param role User role
 * @param permission Permission to check
 * @returns True if role has permission
 */
export function hasPermission(role: UserRole | undefined, permission: Permission): boolean {
	if (!role) return false;
	return rolePermissions[role]?.includes(permission) ?? false;
}

/**
 * Get all permissions for a specific role
 * @param role User role
 * @returns Array of permissions for the role
 */
export function getPermissionsForRole(role: UserRole): Permission[] {
	return rolePermissions[role] ?? [];
}

/**
 * Check if a role has any of the given permissions
 * @param role User role
 * @param permissions Array of permissions to check
 * @returns True if role has at least one permission
 */
export function hasAnyPermission(
	role: UserRole,
	permissions: Permission[]
): boolean {
	return permissions.some((permission) => hasPermission(role, permission));
}

/**
 * Check if a role has all of the given permissions
 * @param role User role
 * @param permissions Array of permissions to check
 * @returns True if role has all permissions
 */
export function hasAllPermissions(
	role: UserRole,
	permissions: Permission[]
): boolean {
	return permissions.every((permission) => hasPermission(role, permission));
}
