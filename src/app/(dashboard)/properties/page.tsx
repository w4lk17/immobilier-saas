
"use client"; // Nécessite le client pour utiliser le hook

import { useProperties } from "@/features/properties/hooks/useProperties.hooks";
// import { PropertyList } from "@/features/properties/components/PropertyList"; // Composant à créer
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function PropertiesPage() {
	const { data: properties, isLoading, isError, error } = useProperties();

	if (isLoading) {
		// Afficher des Skeletons pendant le chargement
		return (
			<div className="space-y-4">
				<div className="flex justify-between items-center">
					<Skeleton className="h-8 w-32" />
					<Skeleton className="h-10 w-24" />
				</div>
				<Skeleton className="h-20 w-full" />
				<Skeleton className="h-20 w-full" />
				<Skeleton className="h-20 w-full" />
			</div>
		);
	}

	if (isError) {
		return <p className="text-destructive">Erreur de chargement: {error?.message || 'Inconnue'}</p>;
	}

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">Gestion des Propriétés</h1>
				<Button asChild>
					<Link href="/properties/new">Ajouter une Propriété</Link>
				</Button>
			</div>
			{/* Passer les données au composant d'affichage */}
			{/* <PropertyList properties={properties || []} /> */}
		</div>
	);
}