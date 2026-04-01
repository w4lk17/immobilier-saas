
"use client";

import { Toaster } from "@/components/ui/sonner"

export function ToasterProvider() {
	// Vous pouvez ajouter des options par défaut ici si nécessaire
	// Consultez la doc du composant Shadcn
	return <Toaster position="bottom-right" />;
}