// features/auth/components/client-guard.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export function ClientGuard({ children }: { children: React.ReactNode }) {
	const { isAuthenticated, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		// Si le chargement est terminé et l'utilisateur N'EST PAS authentifié, rediriger vers login
		if (!isLoading && !isAuthenticated) {
			console.log("DashboardLayout: User not authenticated, redirecting to login.");
			router.replace("/login"); // Use replace to avoid adding dashboard to history
		}
	}, [isLoading, isAuthenticated, router]);

	// Afficher un loader pendant la vérification initiale ou si la redirection est en cours
	if (isLoading || !isAuthenticated) {
		return (
			<div className="flex items-center justify-center h-screen">
				{/* <LoadingSpinner size={24} /> */}
			</div>
		);
	}
	return <>{children}</>;
}
