
"use client";

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Home, PlusCircle } from "lucide-react"; // Icône pour Propriétaire
import { FrontendOwner } from "@/types";
import { DataTable } from '@/components/shared/DataTable';
import { ownerColumns } from './owner.columns';

interface OwnerListProps {
	owners: FrontendOwner[];
}

export function OwnerList({ owners }: OwnerListProps) {
	const emptyState = (
		<div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
			<Home className="h-12 w-12 text-muted-foreground" />
			<h3 className="text-xl font-semibold">Aucun propriétaire trouvé</h3>
			<p className="text-muted-foreground">Commencez par ajouter un nouveau profil propriétaire.</p>
			<Button asChild>
				<Link href="/owners/new"> {/* Assurez-vous que cette route existe */}
					<PlusCircle className="mr-2 h-4 w-4" /> Ajouter un propriétaire
				</Link>
			</Button>
		</div>
	);

	return (
		<DataTable
			columns={ownerColumns}
			data={owners || []}
			emptyStateContent={emptyState}
		/>
	);
}