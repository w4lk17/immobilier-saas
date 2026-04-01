
"use client";

import { Home, PlusCircle } from "lucide-react";
import { useState } from 'react';
import { FrontendOwner } from "@/types";
import { DataTable } from '@/components/shared/DataTable/DataTable';
import { DataTableEmptyState } from '@/components/shared/DataTable/DataTableEmptyState';
import { ownerColumns } from './owner.columns';
import { OwnnerDetailsModal } from './OwnerDetailsModal';

interface OwnerListProps {
	owners: FrontendOwner[];
}

export function OwnerList({ owners }: OwnerListProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedOwner, setSelectedOwner] = useState<FrontendOwner | null>(null);

	const handleViewDetails = (owner: FrontendOwner) => {
		setSelectedOwner(owner);
		setIsModalOpen(true);
	};

	const emptyState = (
		<DataTableEmptyState
			icon={Home}
			title="Aucun propriétaire trouvé"
			description="Commencez par ajouter un nouveau profil propriétaire."
			actionHref="/owners/new"
			actionLabel="Ajouter un propriétaire"
			actionIcon={PlusCircle}
		/>
	);

	return (
		<div className='grid grid-cols-1 gap-4'>
			<DataTable
				columns={ownerColumns}
				data={owners || []}
				meta={{ viewDetails: handleViewDetails }}
				searchPlaceholder='Rechercher par nom, email'
				searchColumn='name'
				newButtonHref='/owners/new'
				newButtonTitle='Nouveau'
				enableExport={true}
				exportFileName='proprietaires'
				emptyStateContent={emptyState}
			/>

			<OwnnerDetailsModal
				owner={selectedOwner}
				isOpen={isModalOpen}
				onOpenChange={setIsModalOpen}
			/>
		</div>
	);
}