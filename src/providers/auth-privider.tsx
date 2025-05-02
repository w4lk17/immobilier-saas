
"use client";

import React, { useEffect } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth'; // Hook qu'on créera

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const { checkAuthStatus, isLoading } = useAuth(); // Fonctions du store/hook

	useEffect(() => {
		// Vérifier le statut d'authentification au chargement initial de l'app
		checkAuthStatus();
	}, [checkAuthStatus]);

	// Optionnel : Afficher un loader pendant la vérification initiale ?
	if (isLoading) {
		// return <FullscreenLoader />; // Ou un autre indicateur
	}

	return <>{children}</>; // Retourne les enfants une fois prêt
}