"use client";

import { ArrowLeftCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useUsers } from "@/features/users/hooks/useUsers.hooks";
import { ContractForm } from "@/features/contracts/components/ContractForm";
import { ContractFormData, ContractUpdateFormData } from "@/features/contracts/schemas/contractSchemas";
import { useCreateContract } from "@/features/contracts/hooks/useContracts.hooks";

export default function NewContractPage() {
	const router = useRouter();
	const createContractMutation = useCreateContract();
	const { data: users, isLoading: isLoadingUsers } = useUsers(); // Pour la sélection d'utilisateur

	const handleSubmit = async (data: ContractFormData | ContractUpdateFormData) => {
		if ('propertyId' in data && typeof data.propertyId === 'number') {
				// TypeScript sait maintenant que 'data' est ContractFormData dans ce bloc
				await createContractMutation.mutateAsync(data);
				router.push("/contracts");
			} else {
				console.error("Structure de données inattendue pour la création d'un Locataire:", data);
			}
	};
	
	return (
		<div className="h-full flex-col gap-8 p-4 md:flex">
			<div className=" flex items-center justify-between gap-2 sm:flex-row sm:items-center sm:gap-0">
				<div className="flex flex-col gap-1">
					<h2 className="text-2xl font-bold tracking-tight">Nouveau Contrat</h2>
				</div>
				<div className="flex items-center gap-2 sm:justify-end">
					<Button variant="secondary" size="sm" asChild>
						<Link href="/contracts">
							<ArrowLeftCircle />
							liste contrats
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
			<ContractForm
				onSubmit={handleSubmit}
				isLoading={createContractMutation.isPending}
				submitButtonText="Créer le Contrat"
				usersForSelection={users?.filter(u => u.role !== 'USER') || []} // Exemple de filtre pour ComboBox
			/>
		</div>

	);
}