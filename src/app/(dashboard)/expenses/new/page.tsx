"use client";

import { ArrowLeftCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useUsers } from "@/features/users/hooks/useUsers.hooks";
import { Button } from "@/components/ui/button";
import { ExpenseFormData, ExpenseUpdateFormData } from "@/features/expenses/schemas/expenseSchemas";
import { ExpenseForm } from "@/features/expenses/components/ExpenseForm";
import { useCreateExpense } from "@/features/expenses/hooks/useExpenses.hooks";
import { useProperties } from "@/features/properties/hooks/useProperties.hooks";

export default function NewExpensePage() {
	const router = useRouter();
	const createExpenseMutation = useCreateExpense();
	const { data: users, isLoading: isLoadingUsers } = useUsers(); // Pour la sélection d'utilisateur
	const { data: properties, isLoading: isLoadingProperties } = useProperties(); // Pour la sélection d'utilisateur

	const handleSubmit = async (data: ExpenseFormData | ExpenseUpdateFormData) => {
		if ('propertyId' in data && typeof data.propertyId === 'number') {
			// TypeScript sait maintenant que 'data' est ExpenseFormData dans ce bloc
			await createExpenseMutation.mutateAsync(data);
			router.push("/expenses");
		} else {
			console.error("Structure de données inattendue pour la création d'une depense:", data);
		}
	};

	return (
		<div className="h-full flex-col gap-8 p-4 md:flex">
			<div className=" flex items-center justify-between gap-2 sm:flex-row sm:items-center sm:gap-0">
				<div className="flex flex-col gap-1">
					<h2 className="text-2xl font-bold tracking-tight">Nouvel Depense</h2>
				</div>
				<div className="flex items-center gap-2 sm:justify-end">
					<Button variant="secondary" size="sm" asChild>
						<Link href="/expenses">
							<ArrowLeftCircle/>
							liste des depenses
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
			<ExpenseForm
				onSubmit={handleSubmit}
				isLoading={createExpenseMutation.isPending}
				submitButtonText="Créer une dépense"
				usersForSelection={users?.data?.filter(u => u.role !== 'USER') || []} // Exemple de filtre pour ComboBox
				propertiesForSelection={properties || []}
			/>
		</div>
	);
}