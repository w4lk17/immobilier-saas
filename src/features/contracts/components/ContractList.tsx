
"use client";

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { FileText, PlusCircle } from "lucide-react"; // Icône pour Contrat
import { ContractWithRelations } from "@/types";
import { DataTable } from '@/components/shared/DataTable';
import { contractColumns } from './contract.columns';

interface ContractListProps {
	contracts: ContractWithRelations[];
}

export function ContractList({ contracts }: ContractListProps) {
	const emptyState = (
		<div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
			<FileText className="h-12 w-12 text-muted-foreground" />
			<h3 className="text-xl font-semibold">Aucun contrat trouvé</h3>
			<p className="text-muted-foreground">Commencez par ajouter un nouveau contrat de location.</p>
			<Button asChild>
				<Link href="/contracts/new"> {/* Assurez-vous que cette route existe */}
					<PlusCircle className="mr-2 h-4 w-4" /> Ajouter un contrat
				</Link>
			</Button>
		</div>
	);

	return (
		<DataTable
			columns={contractColumns}
			data={contracts || []}
			emptyStateContent={emptyState}
		/>
	);
}