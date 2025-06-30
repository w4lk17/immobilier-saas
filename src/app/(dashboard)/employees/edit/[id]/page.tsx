"use client";

import { EmployeeForm } from "@/features/employees/components/EmployeeForm";
import { useEmployee, useUpdateEmployee } from "@/features/employees/hooks/useEmployees.hooks";
import { EmployeeUpdateFormData } from "@/features/employees/schemas/employeeSchemas";
import { useParams, useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, ArrowLeftSquare, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function EditEmployeePage() {
	const router = useRouter();
	const params = useParams();
	const employeeId = params.id ? parseInt(params.id as string, 10) : null;

	const { data: employee, isLoading: isLoadingEmployee, isError, error } = useEmployee(employeeId);
	const updateEmployeeMutation = useUpdateEmployee();

	const handleSubmit = async (data: EmployeeUpdateFormData) => {
		if (!employeeId) return;
		// Le hook gère déjà le toast et l'invalidation du cache
		await updateEmployeeMutation.mutateAsync({ id: employeeId, data });
		router.push("/employees"); // Rediriger vers la liste après mise à jour
	};

	if (isLoadingEmployee) {
		return <div className="flex justify-center items-center h-64"><LoadingSpinner size={32} /></div>;
	}

	if (isError || !employee) {
		return (
			<Alert variant="destructive">
				<Terminal className="h-4 w-4" />
				<AlertTitle>Erreur</AlertTitle>
				<AlertDescription>
					Impossible de charger les données de l'employé. {error?.message}
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="h-full flex-col gap-8 p-4 md:flex">
			<div className=" flex items-center justify-between gap-2 sm:flex-row sm:items-center sm:gap-0">
				<div className="flex flex-col gap-1">
					<h2 className="text-2xl font-bold tracking-tight">Modifier Employé</h2>
				</div>
				<div className="flex items-center gap-2 sm:justify-end">
					<Button variant="outline" asChild>
						<Link href="/employees">
							<ArrowLeft />
							liste employé
						</Link>
					</Button>
					{/* <PresetSelector presets={presets} />
					<PresetSave />
					<div className="hidden space-x-2 md:flex">
						<CodeViewer />
						<PresetShare />
					</div>
					<PresetActions /> */}
				</div>
			</div>
			<EmployeeForm
				initialData={employee}
				onSubmit={handleSubmit}
				isLoading={updateEmployeeMutation.isPending}
				submitButtonText="Mettre à jour le Profil"
			/>
		</div>
	);
}