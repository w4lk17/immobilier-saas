
"use client";

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { PlusCircle, Building2 } from "lucide-react";
import { PropertyWithRelations } from "@/types";
import { DataTable } from '@/components/shared/DataTable'; // Importer le DataTable générique
import { propertyColumns } from './property.columns'; // Importer les colonnes spécifiques

interface PropertyListProps {
	properties: PropertyWithRelations[];
	// Vous pourriez passer isLoading/isError ici si vous voulez que DataTable gère aussi le squelette/erreur
	// isLoading: boolean;
	// isError: boolean;
}

export function PropertyList({ properties /*, isLoading, isError */ }: PropertyListProps) {
	// L'état vide avec bouton d'ajout
	const emptyState = (
		<div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
			<Building2 className="h-12 w-12 text-muted-foreground" />
			<h3 className="text-xl font-semibold">Aucune propriété trouvée</h3>
			<p className="text-muted-foreground">Commencez par ajouter votre première propriété.</p>
			<Button asChild>
				<Link href="/properties/new">
					<PlusCircle className="mr-2 h-4 w-4" /> Ajouter une propriété
				</Link>
			</Button>
		</div>
	);

	// Si isLoading est vrai (géré par la page parente), vous pourriez afficher un squelette ici
	// if (isLoading) return <PropertyTableSkeleton />; // Composant de squelette à créer

	// Si erreur (gérée par la page parente), afficher un message
	// if (isError) return <p>Erreur de chargement des propriétés.</p>;

	return (
		<DataTable
			columns={propertyColumns}
			data={properties || []} 
			emptyStateContent={emptyState}
		// Vous pouvez ajouter des props pour la recherche globale ici si DataTable le gère
		// globalFilter={...}
		// setGlobalFilter={...}
		/>
	);
}