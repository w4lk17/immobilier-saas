
"use client";

import Link from 'next/link';
import { useState } from 'react';
import { FileText, PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ContractWithRelations, FrontendContract } from "@/types";
import { DataTable } from '@/components/shared/DataTable/DataTable';
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
		<div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
			<FileText className="h-12 w-12 text-muted-foreground" />
			<h3 className="text-xl font-semibold">Aucun contrat trouvé</h3>
			<p className="text-muted-foreground">Commencez par ajouter un nouveau contrat .</p>
			<Button asChild>
				<Link href="/contracts/new"> {/* Assurez-vous que cette route existe */}
					<PlusCircle className="mr-2 h-4 w-4" /> Ajouter un contrat
				</Link>
			</Button>
		</div>
	);

	return (
		<div className='grid grid-cols-1 gap-4'>
			<DataTable
				columns={contractColumns}
				data={contracts || []}
				meta={{ viewDetails: handleViewDetails }}
				searchPlaceholder={'Recherher'}
				searchColumn={'tenantName'}
				newButtonHref={'/contracts/new'}
				newButtonTitle={'Nouveau'}
				emptyStateContent={emptyState} />

			<ContractDetailsModal
				contract={selectedContract}
				isOpen={isModalOpen}
				onOpenChange={setIsModalOpen}
			/>
		</div >
	);
}