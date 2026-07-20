"use client";

import { ArrowLeftCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ContractForm } from "@/features/contracts/components/ContractForm";
import { ContractFormData, ContractUpdateFormData } from "@/features/contracts/schemas/contractSchemas";
import { useCreateContract } from "@/features/contracts/hooks/useContracts.hooks";
import { PageHeader } from "@/components/shared/PageHeader";

export default function NewContractPage() {
	const router = useRouter();
	const createContractMutation = useCreateContract();

	const handleSubmit = async (data: ContractFormData) => {
		await createContractMutation.mutateAsync(data as ContractFormData);
		router.push("/admin/contracts");
	};

	return (
		<div className="space-y-6 p-4">
			<PageHeader
				title="Nouveau Contrat"
				description=""
				actions={
					<Button variant="secondary" size="sm" asChild>
						<Link href="/admin/contracts">
							<ArrowLeftCircle />
							Liste des contrats
						</Link>
					</Button>
				}
			/>
			<ContractForm
				mode="create"
				onSubmit={handleSubmit}
				isLoading={createContractMutation.isPending}
				submitButtonText="Créer le Contrat"
			/>
		</div>

	);
}	
