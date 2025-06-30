
"use client";

import Link from 'next/link';

import { Button } from "@/components/ui/button";
import { Home, PlusCircle } from "lucide-react";
import { FrontendOwner } from "@/types";
import { DataTable } from '@/components/shared/DataTable/DataTable';
import { ownerColumns } from './owner.columns';
import { useState } from 'react';
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
		<div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
			<Home className="h-12 w-12 text-muted-foreground" />
			<h3 className="text-xl font-semibold">Aucun propriétaire trouvé</h3>
			<p className="text-muted-foreground">Commencez par ajouter un nouveau profil propriétaire.</p>
			<Button asChild>
				<Link href="/owners/new">
					<PlusCircle className="mr-2 h-4 w-4" /> Ajouter un propriétaire
				</Link>
			</Button>
		</div>
	);

	return (
		<div className='grid grid-cols-1 gap-4'>
			<DataTable
				columns={ownerColumns}
				data={owners || []}
				meta={{ viewDetails: handleViewDetails }}
				searchColumn={"name"}
				searchPlaceholder={"Rechercher"}
				newButtonHref={'/owners/new'}
				newButtonTitle={"Nouveau"}
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