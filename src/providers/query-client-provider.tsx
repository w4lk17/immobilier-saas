
"use client";

import React from 'react';
import { QueryClient, QueryClientProvider as TanstackQueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; // Optionnel pour le dev

// Créez une instance de client (une seule fois)
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// Options par défaut pour les queries (ex: staleTime, gcTime)
			refetchOnWindowFocus: false, // Peut être utile pour éviter les refetchs excessifs
			retry: 1, // Réessayer une fois en cas d'erreur
		},
	},
});


export function QueryClientProvider({ children }: { children: React.ReactNode }) {
	return (
		<TanstackQueryClientProvider client={queryClient}>
			{children}
			{/* Outils de dev pour React Query (uniquement en dév) */}
			{process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
		</TanstackQueryClientProvider>
	);
}