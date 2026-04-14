"use client";

import { ArrowLeftCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";


import { useCreateManager } from "@/features/managers/hooks/useManagers.hooks";
import { UpdateManagerFormData, CreateManagerFormData } from "@/features/managers/schemas/managerSchemas";
import { Button } from "@/components/ui/button";
import { ManagerForm } from "@/features/managers/components/ManagerForm";

export default function NewManagerPage() {
	const router = useRouter();
	const createManagerMutation = useCreateManager();

	const handleSubmit = async (data: CreateManagerFormData | UpdateManagerFormData) => {
		// VALIDATION CORRECTE pour la nouvelle architecture
		// En mode création, le formulaire DOIT contenir email et password
		if ('email' in data && 'password' in data) {
			// On cast explicitement pour TypeScript car on a vérifié la présence des champs
			await createManagerMutation.mutateAsync(data as CreateManagerFormData);
			router.push("/admin/managers");
		} else {
			// Ce cas ne devrait pas arriver sur cette page car le formulaire est en mode création
			console.error("Structure de données invalide pour la création :", data);
		}
	};

	return (
		<div className="h-full flex-col gap-8 p-4 md:flex">
			<div className="flex items-center justify-between gap-2 sm:flex-row sm:items-center sm:gap-0">
				<div className="flex flex-col gap-1">
					<h2 className="text-2xl font-bold tracking-tight">Nouveau Gestionnaire</h2>
				</div>
				<div className="flex items-center gap-2 sm:justify-end">
					<Button variant="secondary" size="sm" asChild>
						<Link href="/admin/managers">
							<ArrowLeftCircle />
							liste gestionnaires
						</Link>
					</Button>
				</div>
			</div>
			<ManagerForm
				onSubmit={handleSubmit}
				isLoading={createManagerMutation.isPending}
				submitButtonText="Créer le Profil Gestionnaire"
			/>
		</div>
	);
}
