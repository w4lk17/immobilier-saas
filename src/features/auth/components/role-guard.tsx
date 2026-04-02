"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { Spinner } from "@/components/ui/spinner";
import { UserRole } from "@/types/enums";
import { getRoleRedirectPath } from "@/lib/authUtils";

interface RoleGuardProps {
	children: React.ReactNode;
	allowedRoles: UserRole[];
	redirectTo?: string;
	fallback?: React.ReactNode;
}

export function RoleGuard({ children, allowedRoles, redirectTo = "/unauthorized", fallback }: RoleGuardProps) {
	const { user, isAuthenticated, isLoading } = useAuth();
	const router = useRouter();
	const hasRedirected = useRef(false);

	useEffect(() => {
		// Skip while loading or already redirected
		if (isLoading || hasRedirected.current) return;

		// Not authenticated - redirect to login
		if (!isAuthenticated) {
			hasRedirected.current = true;
			router.replace("/login");
			return;
		}

		// Authenticated but wrong role - redirect to appropriate dashboard
		if (user && !allowedRoles.includes(user.role)) {
			hasRedirected.current = true;
			const redirectPath = getRoleRedirectPath(user);
			router.replace(redirectPath);
		}
	}, [isLoading, isAuthenticated, user, allowedRoles, router, redirectTo]);

	// Show loading while checking
	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="flex flex-col items-center gap-4">
					<Spinner className="size-8 text-primary" />
					<p className="text-sm text-muted-foreground">Chargement...</p>
				</div>
			</div>
		);
	}

	// Wrong role - show fallback or nothing while redirecting
	if (!isAuthenticated || (user && !allowedRoles.includes(user.role))) {
		return fallback || null;
	}

	return <>{children}</>;
}

/**
 * Simplified guard that only checks if user is authenticated
 */
export function AuthGuard({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
	const { isAuthenticated, isLoading } = useAuth();

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="flex flex-col items-center gap-4">
					<Spinner className="size-8 text-primary" />
					<p className="text-sm text-muted-foreground">Chargement...</p>
				</div>
			</div>
		);
	}

	if (!isAuthenticated) {
		return fallback || null;
	}

	return <>{children}</>;
}
