"use client";

import { Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "../hooks/useAuth";
import { getRoleName } from "@/lib/authUtils";

interface ClientGuardProps {
	children: React.ReactNode;
	allow?: {
		roles?: string[];
	};
	fallback?: React.ReactNode;
	showUnauthorized?: boolean;
}

/**
 * Client-side guard for showing unauthorized UI instead of redirecting.
 * Use this when you want to show an inline "access denied" message.
 */
export function ClientGuard({ children, allow, fallback, showUnauthorized = false }: ClientGuardProps) {
	const { user, isAuthenticated, isLoading } = useAuth();

	// Show nothing while loading
	if (isLoading) {
		return null;
	}

	// Not authenticated
	if (!isAuthenticated) {
		return fallback || null;
	}

	// Check role-based access
	if (allow?.roles && user?.role && !allow.roles.includes(user.role)) {
		if (showUnauthorized) {
			return (
				<Card className="border-yellow-200 bg-yellow-50">
					<CardContent className="flex items-center gap-4 p-6">
						<div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full">
							<Shield className="h-6 w-6 text-yellow-600" />
						</div>
						<div className="flex-1">
							<h3 className="font-semibold text-yellow-800">Accès Restreint</h3>
							<p className="text-sm text-yellow-700">
								Votre compte ({getRoleName(user.role)}) n&apos;a pas la permission d&apos;accéder à cette ressource.
							</p>
						</div>
					</CardContent>
				</Card>
			);
		}
		return fallback || null;
	}

	return <>{children}</>;
}