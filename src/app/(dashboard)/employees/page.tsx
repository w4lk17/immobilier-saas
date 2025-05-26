"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmployeeList } from "@/features/employees/components/EmployeeList";
import { useEmployees } from "@/features/employees/hooks/useEmployees.hooks";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export default function EmployeesPage() {
	const { data: employees, isLoading, isError, error } = useEmployees();

	if (isLoading) {
		// Afficher des Skeletons pendant le chargement
		return (
			<div className="space-y-4">
				Loading...
			</div>
		);
	}

	if (isError) {
		return <p className="text-destructive">Erreur de chargement: {error?.message || 'Inconnue'}</p>;
	}

	return (
		<div className="">
			{/* Breadcrumb */}
			<div>Breadcrumb</div>
			{/* Container */}
			<div className="flex flex-col xl:flex-row gap-4 p-4">
					<div className="bg-primary-foreground p-4 rounded-lg">
						<div className="flex items-center justify-between mb-2">
							<h2 className="text-lg font-medium">Liste des Employés</h2>
							<Button variant="outline" size="sm" >
								<PlusIcon />
								<Link href="/employees/new">
									<span className="hidden lg:inline">Nouveau</span>
								</Link>
							</Button>
						</div>
						{/*Composant d'affichage */}
						<div className=""><EmployeeList employees={employees || []} /></div>
					</div>
				</div>
		</div>

	)
}