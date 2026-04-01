// src/hooks/usePermissions.ts (ou features/auth/hooks/usePermissions.ts)
import { useAuth } from './useAuth';
import { Permission, hasPermission } from '@/lib/permissions';
import { UserRole } from '@/types';
import {
	PropertyWithRelations,
	ContractWithRelations,
	InvoiceWithRelations,
	ExpenseWithRelations,
	RentalWithRelations
} from '@/types';
import { getRoleRedirectPath, getRoleName } from '@/lib/authUtils';

export function usePermissions() {
	const { user } = useAuth();
	const role = user?.role;
	const userId = user?.id;

	return {
		// User info
		user,
		role,
		userId,

		// Navigation helpers
		getDashboardPath: (): string => {
			return getRoleRedirectPath(user);
		},
		roleName: getRoleName(role || ''),

		// Generic permission checker
		can: (permission: Permission): boolean => {
			if (!role) return false;
			return hasPermission(role, permission);
		},

		// Role checks (Mis à jour avec MANAGER)
		isAdmin: role === UserRole.ADMIN,
		isManager: role === UserRole.MANAGER, // Remplace isManager
		isTenant: role === UserRole.TENANT,
		isOwner: role === UserRole.OWNER,

		// ========== PROPERTY PERMISSIONS ==========
		canManageProperty: (property: PropertyWithRelations): boolean => {
			if (role === UserRole.ADMIN) return true;
			// Manager can manage properties assigned to them
			if (role === UserRole.MANAGER && property.managerId === userId) return true;
			return false;
		},

		canViewProperty: (property: PropertyWithRelations): boolean => {
			if (role === UserRole.ADMIN) return true;
			if (role === UserRole.MANAGER && property.managerId === userId) return true;
			// Owner can view their own properties
			if (role === UserRole.OWNER && property.ownerId === userId) return true;
			return false;
		},

		canDeleteProperty: (): boolean => {
			// Only Admin can delete
			return role === UserRole.ADMIN;
		},

		// ========== RENTAL PERMISSIONS (Nouveau) ==========
		canManageRental: (rental: RentalWithRelations): boolean => {
			if (role === UserRole.ADMIN) return true;
			// Manager can manage rentals in properties they manage
			if (role === UserRole.MANAGER && rental.property?.managerId === userId) return true;
			return false;
		},

		canViewRental: (rental: RentalWithRelations): boolean => {
			if (role === UserRole.ADMIN) return true;
			if (role === UserRole.MANAGER && rental.property?.managerId === userId) return true;
			// Owner can view rentals in their properties
			if (role === UserRole.OWNER && rental.property?.ownerId === userId) return true;
			return false;
		},

		// ========== CONTRACT PERMISSIONS ==========
		canManageContract: (contract: ContractWithRelations): boolean => {
			if (role === UserRole.ADMIN) return true;
			// Manager manages contracts on properties they manage
			if (role === UserRole.MANAGER && contract.property?.managerId === userId) return true;
			return false;
		},

		canViewContract: (contract: ContractWithRelations): boolean => {
			if (role === UserRole.ADMIN) return true;
			if (role === UserRole.MANAGER && contract.property?.managerId === userId) return true;
			// Owner views their own contracts
			if (role === UserRole.OWNER && contract.ownerId === userId) return true;
			// Tenant views their own contracts
			if (role === UserRole.TENANT && contract.tenantId === userId) return true;
			return false;
		},

		// ========== INVOICE PERMISSIONS (Anciennement Payment) ==========
		canManageInvoice: (invoice: InvoiceWithRelations): boolean => {
			if (role === UserRole.ADMIN) return true;
			// Manager manages invoices for contracts they manage
			if (role === UserRole.MANAGER && invoice.contract?.property?.managerId === userId) return true;
			return false;
		},

		canViewInvoice: (invoice: InvoiceWithRelations): boolean => {
			if (role === UserRole.ADMIN) return true;
			if (role === UserRole.MANAGER && invoice.contract?.property?.managerId === userId) return true;
			// Owner views invoices linked to their contracts
			if (role === UserRole.OWNER && invoice.contract?.ownerId === userId) return true;
			// Tenant views their own invoices
			if (role === UserRole.TENANT && invoice.tenantId === userId) return true;
			return false;
		},

		// ========== USER PERMISSIONS ==========
		canManageUsers: (): boolean => {
			return role === UserRole.ADMIN;
		},

		canEditUser: (targetUserId: number): boolean => {
			if (role === UserRole.ADMIN) return true;
			// Users can edit themselves (profile)
			if (userId === targetUserId) return true;
			return false;
		},

		// ========== EXPENSE PERMISSIONS ==========
		canManageExpense: (expense: ExpenseWithRelations): boolean => {
			if (role === UserRole.ADMIN) return true;
			// Manager manages expenses for properties they manage
			if (role === UserRole.MANAGER && expense.property?.managerId === userId) return true;
			return false;
		},

		canViewExpense: (expense: ExpenseWithRelations): boolean => {
			if (role === UserRole.ADMIN) return true;
			if (role === UserRole.MANAGER && expense.property?.managerId === userId) return true;
			// Owner views expenses on their properties
			if (role === UserRole.OWNER && expense.property?.ownerId === userId) return true;
			return false;
		},
	};
}