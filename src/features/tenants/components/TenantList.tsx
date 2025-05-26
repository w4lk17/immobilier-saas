
"use client";

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Contact, PlusCircle } from "lucide-react"; // Icône pour Locataire
import { FrontendTenant } from "@/types";
import { DataTable } from '@/components/shared/DataTable';
import { tenantColumns } from './tenant.columns';

interface TenantListProps {
	tenants: FrontendTenant[];
}

export function TenantList({ tenants }: TenantListProps) {
	const emptyState = (
		<div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
			<Contact className="h-12 w-12 text-muted-foreground" />
			<h3 className="text-xl font-semibold">Aucun locataire trouvé</h3>
			<p className="text-muted-foreground">Commencez par ajouter un nouveau profil locataire.</p>
			<Button asChild>
				<Link href="/tenants/new"> {/* Assurez-vous que cette route existe */}
					<PlusCircle className="mr-2 h-4 w-4" /> Ajouter un locataire
				</Link>
			</Button>
		</div>
	);

	return (
		<DataTable
			columns={tenantColumns}
			data={tenants || []}
			emptyStateContent={emptyState}
		/>
	);
}