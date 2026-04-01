import { usePermissions } from '@/features/auth/hooks/usePermissions';
import { Permission } from '@/lib/permissions';
import { ReactNode } from 'react';

interface PermissionGuardProps {
	permission: Permission;
	fallback?: ReactNode;
	children: ReactNode;
}

/**
 * Conditionally renders children based on user permissions.
 * If user doesn't have the permission, shows fallback (default: null).
 *
 * @example
 * <PermissionGuard permission={Permission.USERS_DELETE}>
 *   <Button onClick={handleDelete}>Delete User</Button>
 * </PermissionGuard>
 */
export function PermissionGuard({ permission, fallback = null, children }: PermissionGuardProps) {
	const { can } = usePermissions();

	if (!can(permission)) {
		return <>{fallback}</>;
	}

	return <>{children}</>;
}
