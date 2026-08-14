"use client";

import { useState } from 'react';
import { Contact } from "lucide-react";
import { FrontendTenant } from "@/types";
import { DataTable } from '@/components/shared/DataTable/DataTable';
import { DataTableEmptyState } from '@/components/shared/DataTable/DataTableEmptyState';
import { tenantColumns } from './tenant.columns';
import { TenantDetailsModal } from './TenantDetailsModal';
import { useUpdateTenantStatus } from '../hooks/useTenants.hooks';

interface TenantListProps {
	tenants: FrontendTenant[];
}

export function TenantList({ tenants }: TenantListProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedTenant, setSelectedTenant] = useState<FrontendTenant | null>(null);

	// Hook pour gérer le switch Actif/Inactif
	const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateTenantStatus();

	const handleViewDetails = (tenant: FrontendTenant) => {
		setSelectedTenant(tenant);
		setIsModalOpen(true);
	};

	// Fonction passée aux colonnes pour le Switch
	const handleToggleStatus = (userId: number, currentStatus: boolean) => {
		updateStatus({ id: userId, isActive: !currentStatus });
	};

	const emptyState = (
		<DataTableEmptyState
			icon={Contact}
			title="Aucun locataire trouvé"
			description="Commencez par ajouter un nouveau locataire."
		/>
	);

	return (
		<div className='grid grid-cols-1 gap-4'>
			<DataTable
				columns={tenantColumns}
				data={tenants || []}
				meta={{
					viewDetails: handleViewDetails,
					toggleStatus: handleToggleStatus,
					isUpdatingStatus: isUpdatingStatus,
				}}
				searchPlaceholder='Rechercher par nom'
				searchColumn='name'
				newButtonHref='/admin/tenants/new'
				newButtonTitle='Nouveau Locataire'
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
