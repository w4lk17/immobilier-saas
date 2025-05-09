import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils"; // L'utilitaire pour fusionner les classes

interface LoadingSpinnerProps {
	size?: number;      // Taille de l'icône en pixels
	className?: string; // Pour ajouter des classes Tailwind supplémentaires
}

export function LoadingSpinner({ size = 24, className }: LoadingSpinnerProps) {
	return (
		<Loader2
			className={cn(
				"animate-spin text-primary", // Animation de spin et couleur primaire par défaut
				className // Permet de surcharger ou d'ajouter des classes
			)}
			style={{ width: size, height: size }} // Appliquer la taille dynamiquement
			aria-label="Chargement en cours" // Pour l'accessibilité
		/>
	);
}