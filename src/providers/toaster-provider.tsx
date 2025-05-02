
"use client";

import { Toaster } from "@/components/ui/sonner" //  Toaster de Shadcn

export function ToasterProvider() {
	// Vous pouvez ajouter des options par défaut ici si nécessaire
	// Consultez la doc de react-hot-toast ou du composant Shadcn
	return <Toaster position="bottom-right" />;
}