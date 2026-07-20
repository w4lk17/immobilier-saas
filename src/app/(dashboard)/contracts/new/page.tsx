"use client";

import { ArrowLeftCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ContractForm } from "@/features/contracts/components/ContractForm";
import { ContractFormData, ContractUpdateFormData } from "@/features/contracts/schemas/contractSchemas";
import { useCreateContract } from "@/features/contracts/hooks/useContracts.hooks";

export default function NewContractPage() {
	const router = useRouter();
	const createContractMutation = useCreateContract();

	const handleSubmit = async (data: ContractFormData | ContractUpdateFormData) => {
		await createContractMutation.mutateAsync(data as ContractFormData);
		router.push("/contracts");
	};

	return (
		<div className="h-full flex-col gap-8 p-4 md:flex">
			<div className="flex items-center justify-between gap-2 sm:flex-row sm:items-center sm:gap-0">
				<div className="flex flex-col gap-1">
					<h2 className="text-2xl font-bold tracking-tight">Nouveau Contrat</h2>
				</div>
				<div className="flex items-center gap-2 sm:justify-end">
					<Button variant="secondary" size="sm" asChild>
						<Link href="/contracts">
							<ArrowLeftCircle />
							Liste contrats
						</Link>
					</Button>
				</div>
			</div>
			<ContractForm
			mode="create"
				onSubmit={handleSubmit}
				isLoading={createContractMutation.isPending}
				submitButtonText="Creer le Contrat"
			/>
		</div>
	);
}
