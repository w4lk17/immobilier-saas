
"use client";

import Link from 'next/link';
import { useState } from 'react';

import { Button } from "@/components/ui/button";
import { PlusCircle, Building2 } from "lucide-react";
import { FrontendProperty, PropertyWithRelations } from "@/types";
import { DataTable } from '@/components/shared/DataTable/DataTable';
import { DataTableEmptyState } from '@/components/shared/DataTable/DataTableEmptyState';
import { propertyColumns } from './property.columns';
import { PropertyDetailsModal } from './PropertyDetailsModal';

interface PropertyListProps {
	properties: PropertyWithRelations[];
}

export function PropertyList({ properties }: PropertyListProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedProperty, setSelectedProperty] = useState<FrontendProperty | null>(null);

	const handleViewDetails = (property: FrontendProperty) => {
		setSelectedProperty(property);
		setIsModalOpen(true);
	};

	const emptyState = (
		<DataTableEmptyState
			icon={Building2}
			title="Aucun bien trouvé"
			description="Commencez par ajouter un bien immobilier."
			actionHref="/properties/new"
			actionLabel="Ajouter un bien"
			actionIcon={PlusCircle}
		/>
	);

	return (
		<div className='grid grid-cols-1 gap-4'>
			<DataTable
				columns={propertyColumns}
				data={properties || []}
				meta={{ viewDetails: handleViewDetails }}
				searchPlaceholder='Rechercher par adresse'
				searchColumn='address'
				newButtonHref='/properties/new'
				newButtonTitle='Nouveau'
				enableExport={true}
				exportFileName='biens-immobiliers'
				emptyStateContent={emptyState} />

			<PropertyDetailsModal
				property={selectedProperty}
				isOpen={isModalOpen}
				onOpenChange={setIsModalOpen}
			/>
		</div>
	);
}