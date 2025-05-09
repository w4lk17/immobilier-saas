// features/auth/components/client-guard.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
// import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

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
				{/* <LoadingSpinner size={48} /> */}
			</div>
		);
	}

	// Si authentifié, afficher le layout et les enfants
	// return (
	// 	<div className="flex h-screen bg-muted/40">
	// 		{/* <DashboardSidebar /> */} {/* Votre sidebar */}
	// 		<div className="flex flex-col flex-1">
	// 			{/* <DashboardHeader /> */} {/* Votre header */}
	// 			<main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
	// 				{children} {/* Le contenu de la page actuelle (ex: /properties, /contracts) */}
	// 			</main>
	// 		</div>
	// 	</div>
	// );

	return <>{children}</>;
}
