
"use client";

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { UserCog, PlusCircle } from "lucide-react"; // Icône pour Employé
import { FrontendEmployee } from "@/types";
import { DataTable } from '@/components/shared/DataTable';
import { employeeColumns } from './employee.columns';

interface EmployeeListProps {
	employees: FrontendEmployee[];
}

export function EmployeeList({ employees }: EmployeeListProps) {
	const emptyState = (
		<div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
			<UserCog className="h-12 w-12 text-muted-foreground" />
			<h3 className="text-xl font-semibold">Aucun employé trouvé</h3>
			<p className="text-muted-foreground">Commencez par ajouter un nouveau profil employé.</p>
			<Button asChild>
				<Link href="/employees/new"> {/* Assurez-vous que cette route existe */}
					<PlusCircle className="mr-2 h-4 w-4" /> Ajouter un employé
				</Link>
			</Button>
		</div>
	);

	return (
		<DataTable
			columns={employeeColumns}
			data={employees || []}
			setGlobalFilter={(filter: string) => console.log(filter)}
			emptyStateContent={emptyState}
		/>
	);
}