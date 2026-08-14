import { useAuth } from '@/features/auth/hooks/useAuth';
import { UserRole } from '@/types/enums';
import { ReactNode } from 'react';

interface RoleGuardProps {
	allowedRoles: UserRole[];
	fallback?: ReactNode;
	children: ReactNode;
}

/**
 * Conditionally renders children based on user role.
 * If user doesn't have one of the allowed roles, shows fallback (default: null).
 *
 * @example
 * <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.MANAGER]}>
 *   <Button>Create Property</Button>
 * </RoleGuard>
 */
export function RoleGuard({ allowedRoles, fallback = null, children }: RoleGuardProps) {
	const { user } = useAuth();

	if (!user || !allowedRoles.includes(user.role)) {
		return <>{fallback}</>;
	}

	return <>{children}</>;
}
