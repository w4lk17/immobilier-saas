import { CurrentUser } from "@/types";

/**
 * Get the default redirect path for a user based on their role
 */
export function getRoleRedirectPath(user: CurrentUser | null): string {
	if (!user?.role) {
		return "/accueil";
	}

	switch (user.role) {
		case "ADMIN":
			return "/admin";
		case "MANAGER":
			return "/manager";
		case "OWNER":
			return "/owner-portal";
		case "TENANT":
			return "/tenant-portal";
		default:
			return "/accueil";
	}
}

/**
 * Check if a user can access a specific route based on their role
 */
export function canAccessRoute(userRole: string, allowedRoles: string[]): boolean {
	return allowedRoles.includes(userRole);
}

/**
 * Get user-friendly role name in French
 */
export function getRoleName(role: string): string {
	switch (role) {
		case "ADMIN":
			return "Administrateur";
		case "MANAGER":
			return "Gestionnaire";
		case "OWNER":
			return "Propriétaire";
		case "TENANT":
			return "Locataire";
		default:
			return "Utilisateur";
	}
}
