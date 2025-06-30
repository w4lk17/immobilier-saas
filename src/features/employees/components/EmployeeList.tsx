
"use client";

import Link from 'next/link';
import { useState } from 'react';
import React from 'react';
import { UserCog, PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FrontendEmployee } from "@/types";
import { DataTable } from '@/components/shared/DataTable/DataTable';
import { employeeColumns } from './employee.columns';
import { EmployeeDetailsModal } from './EmployeeDetailsModal';

interface EmployeeListProps {
	employees: FrontendEmployee[];
}

export function EmployeeList({ employees }: EmployeeListProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedEmployee, setSelectedEmployee] = useState<FrontendEmployee | null>(null);

	const handleViewDetails = (employee: FrontendEmployee) => {
		setSelectedEmployee(employee);
		setIsModalOpen(true);
	};

	const emptyState = (
		<div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
			<UserCog className="h-12 w-12 text-muted-foreground" />
			<h3 className="text-xl font-semibold">Aucun employé trouvé</h3>
			<p className="text-muted-foreground">Commencez par ajouter un nouveau profil employé.</p>
			<Button asChild>
				<Link href="/employees/new">
					<PlusCircle className="mr-2 h-4 w-4" /> Ajouter un employé
				</Link>
			</Button>
		</div>
	);

	return (
		<div className=" grid grid-cols-1 gap-4">
			<DataTable
				columns={employeeColumns}
				data={employees || []}
				meta={{ viewDetails: handleViewDetails }}
				searchColumn={"name"}
				searchPlaceholder={"Rechercher"}
				newButtonHref={'/employees/new'}
				newButtonTitle={"Nouveau"}
				emptyStateContent={emptyState}
			/>

			<EmployeeDetailsModal
				employee={selectedEmployee}
				isOpen={isModalOpen}
				onOpenChange={setIsModalOpen}
			/>
		</div>
	);
}