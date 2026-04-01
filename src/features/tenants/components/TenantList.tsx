"use client";

import { useState } from 'react';
import { Contact, PlusCircle } from "lucide-react";
import { FrontendTenant } from "@/types";
import { DataTable } from '@/components/shared/DataTable/DataTable';
import { DataTableEmptyState } from '@/components/shared/DataTable/DataTableEmptyState';
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
		<DataTableEmptyState
			icon={Contact}
			title="Aucun locataire trouvé"
			description="Commencez par ajouter un nouveau profil locataire."
			actionHref="/tenants/new"
			actionLabel="Ajouter un locataire"
			actionIcon={PlusCircle}
		/>
	);

	return (
		<div className='grid grid-cols-1 gap-4'>
			<DataTable
				columns={tenantColumns}
				data={tenants || []}
				meta={{ viewDetails: handleViewDetails }}
				searchPlaceholder='Rechercher par nom, email'
				searchColumn='name'
				newButtonHref='/tenants/new'
				newButtonTitle='Nouveau'
				enableExport={true}
				exportFileName='locataires'
				emptyStateContent={emptyState} />

			<TenantDetailsModal
				tenant={selectedTenant}
				isOpen={isModalOpen}
				onOpenChange={setIsModalOpen}
			/>
		</div >
	);
}