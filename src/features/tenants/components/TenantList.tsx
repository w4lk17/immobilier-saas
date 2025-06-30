"use client";

import { useState } from 'react';
import Link from 'next/link';

import { Button } from "@/components/ui/button";
import { Contact, PlusCircle } from "lucide-react";
import { FrontendTenant } from "@/types";
import { DataTable } from '@/components/shared/DataTable/DataTable';
import { tenantColumns } from './tenant.columns';
import { TenantDetailsModal } from './TenantDetailsModal';

interface TenantListProps {
	tenants: FrontendTenant[];
}

export function TenantList({ tenants }: TenantListProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedTenant, setSelectedTenant] = useState<FrontendTenant | null>(null);

	const handleViewDetails = (tenant: FrontendTenant) => {
		setSelectedTenant(tenant);
		setIsModalOpen(true);
	};


	const emptyState = (
		<div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
			<Contact className="h-12 w-12 text-muted-foreground" />
			<h3 className="text-xl font-semibold">Aucun locataire trouvé</h3>
			<p className="text-muted-foreground">Commencez par ajouter un nouveau profil locataire.</p>
			<Button asChild>
				<Link href="/tenants/new">
					<PlusCircle className="mr-2 h-4 w-4" /> Ajouter un locataire
				</Link>
			</Button>
		</div>
	);

	return (
		<div className='grid grid-cols-1 gap-4'>
			<DataTable
				columns={tenantColumns}
				data={tenants || []}
				meta={{ viewDetails: handleViewDetails }}
				searchColumn={'name'}
				searchPlaceholder={'Rechercher'}
				newButtonHref={'/tenants/new'}
				newButtonTitle={'Nouveau'}
				emptyStateContent={emptyState} />

			<TenantDetailsModal
				tenant={selectedTenant}
				isOpen={isModalOpen}
				onOpenChange={setIsModalOpen}
			/>
		</div >
	);
}