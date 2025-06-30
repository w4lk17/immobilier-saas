
"use client";

import Link from 'next/link';
import { useState } from 'react';

import { Button } from "@/components/ui/button";
import { PlusCircle, Building2 } from "lucide-react";
import { FrontendProperty, PropertyWithRelations } from "@/types";
import { DataTable } from '@/components/shared/DataTable/DataTable';
import { propertyColumns } from './property.columns';
import { PropertyDetailsModal } from './PropertyDetailsModal';

interface PropertyListProps {
	properties: PropertyWithRelations[];
}

export function PropertyList({ properties /*, isLoading, isError */ }: PropertyListProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedProperty, setSelectedProperty] = useState<FrontendProperty | null>(null);

	const handleViewDetails = (property: FrontendProperty) => {
		setSelectedProperty(property);
		setIsModalOpen(true);
	};


	const emptyState = (
		<div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
			<Building2 className="h-12 w-12 text-muted-foreground" />
			<h3 className="text-xl font-semibold">Aucun bien trouvée</h3>
			<p className="text-muted-foreground">Commencez par ajouter un Bien (propriété).</p>
			<Button asChild>
				<Link href="/properties/new">
					<PlusCircle className="mr-2 h-4 w-4" /> Ajouter un Bien (propriété)
				</Link>
			</Button>
		</div>
	);

	// Si isLoading est vrai (géré par la page parente), vous pourriez afficher un squelette ici
	// if (isLoading) return <PropertyTableSkeleton />; // Composant de squelette à créer

	// Si erreur (gérée par la page parente), afficher un message
	// if (isError) return <p>Erreur de chargement des propriétés.</p>;

	return (
		<div className='grid grid-cols-1 gap-4'>
			<DataTable
				columns={propertyColumns}
				data={properties || []}
				meta={{ viewDetails: handleViewDetails }}
				searchPlaceholder='Rechercher par adresse'
				searchColumn={'address'}
				newButtonHref={'/properties/new'}
				newButtonTitle={'Nouveau'}
				emptyStateContent={emptyState} />

			<PropertyDetailsModal
				property={selectedProperty}
				isOpen={isModalOpen}
				onOpenChange={setIsModalOpen}
			/>
		</div>
	);
}