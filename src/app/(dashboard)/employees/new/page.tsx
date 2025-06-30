"use client";

import { ArrowLeftCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { EmployeeForm } from "@/features/employees/components/EmployeeForm";
import { useCreateEmployee } from "@/features/employees/hooks/useEmployees.hooks";
import { EmployeeFormData, EmployeeUpdateFormData } from "@/features/employees/schemas/employeeSchemas";
import { useUsers } from "@/features/users/hooks/useUsers.hooks";
import { Button } from "@/components/ui/button";

export default function NewEmployeePage() {
	const router = useRouter();
	const createEmployeeMutation = useCreateEmployee();
	const { data: users, isLoading: isLoadingUsers } = useUsers(); // Pour la sélection d'utilisateur

	const handleSubmit = async (data: EmployeeFormData | EmployeeUpdateFormData) => {
		if ('userId' in data && typeof data.userId === 'number' && 'position' in data) {
			// TypeScript sait maintenant que 'data' est EmployeeFormData dans ce bloc
			await createEmployeeMutation.mutateAsync(data);
			router.push("/employees");
		} else {
			console.error("Structure de données inattendue pour la création d'un employé:", data);
		}
	};

	return (
		<div className="h-full flex-col gap-8 p-4 md:flex">
			<div className=" flex items-center justify-between gap-2 sm:flex-row sm:items-center sm:gap-0">
				<div className="flex flex-col gap-1">
					<h2 className="text-2xl font-bold tracking-tight">Nouvel Employé</h2>
				</div>
				<div className="flex items-center gap-2 sm:justify-end">
					<Button variant="secondary" size="sm" asChild>
						<Link href="/employees">
							<ArrowLeftCircle/>
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
				onSubmit={handleSubmit}
				isLoading={createEmployeeMutation.isPending}
				submitButtonText="Créer le Profil Employé"
				usersForSelection={users?.filter(u => u.role !== 'USER') || []} // Exemple de filtre pour ComboBox
			/>
		</div>
	);
}