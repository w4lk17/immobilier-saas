
"use client";

import { useState } from 'react';
import { FileText, PlusCircle } from "lucide-react";

import { ContractWithRelations, FrontendContract } from "@/types";
import { DataTable } from '@/components/shared/DataTable/DataTable';
import { DataTableEmptyState } from '@/components/shared/DataTable/DataTableEmptyState';
import { contractColumns } from './contract.columns';
import { ContractDetailsModal } from './ContractDetailsModal';

interface ContractListProps {
	contracts: ContractWithRelations[];
}

export function ContractList({ contracts }: ContractListProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedContract, setSelectedContract] = useState<ContractWithRelations | null>(null);

	const handleViewDetails = (contract: FrontendContract) => {
		setSelectedContract(contract);
		setIsModalOpen(true);
	};

	const emptyState = (
		<DataTableEmptyState
			icon={FileText}
			title="Aucun contrat trouvé"
			description="Commencez par ajouter un nouveau contrat."
			actionHref="/contracts/new"
			actionLabel="Ajouter un contrat"
			actionIcon={PlusCircle}
		/>
	);

	return (
		<div className='grid grid-cols-1 gap-4'>
			<DataTable
				columns={contractColumns}
				data={contracts || []}
				meta={{ viewDetails: handleViewDetails }}
				searchPlaceholder='Rechercher par locataire ou propriété'
				searchColumn='tenantName'
				newButtonHref='/contracts/new'
				newButtonTitle='Nouveau'
				enableExport={true}
				exportFileName='contrats'
				emptyStateContent={emptyState} />

			<ContractDetailsModal
				contract={selectedContract}
				isOpen={isModalOpen}
				onOpenChange={setIsModalOpen}
			/>
		</div >
	);
}