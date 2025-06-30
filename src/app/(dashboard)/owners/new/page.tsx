"use client";

import { ArrowLeftCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useCreateOwner } from "@/features/owners/hooks/useOwners.hooks";
import { OwnerFormData, OwnerUpdateFormData } from "@/features/owners/schemas/ownerSchemas";
import { useUsers } from "@/features/users/hooks/useUsers.hooks";
import { OwnerForm } from "@/features/owners/components/OwnerForm";

export default function NewOwnerPage() {
	const router = useRouter();
	const createOwnerMutation = useCreateOwner();
	const { data: users, isLoading: isLoadingUsers } = useUsers(); // Pour la sélection d'utilisateur

	const handleSubmit = async (data: OwnerFormData | OwnerUpdateFormData) => {
			if ('userId' in data && typeof data.userId === 'number') {
				// TypeScript sait maintenant que 'data' est OwnerFormData dans ce bloc
				await createOwnerMutation.mutateAsync(data);
				router.push("/owners");
			} else {
				console.error("Structure de données inattendue pour la création d'un Propriétaire:", data);
			}
	};
	
	return (
		<div className="h-full flex-col gap-8 p-4 md:flex">
			<div className=" flex items-center justify-between gap-2 sm:flex-row sm:items-center sm:gap-0">
				<div className="flex flex-col gap-1">
					<h2 className="text-2xl font-bold tracking-tight">Nouveau Propriétaire</h2>
				</div>
				<div className="flex items-center gap-2 sm:justify-end">
					<Button variant="secondary" size="sm" asChild>
						<Link href="/owners">
							<ArrowLeftCircle />
							liste propriétaire
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
			<OwnerForm
				onSubmit={handleSubmit}
				isLoading={createOwnerMutation.isPending}
				submitButtonText="Créer le Profil Propriétaire"
				usersForSelection={users?.filter(u => u.role !== 'USER') || []} // Exemple de filtre pour ComboBox
			/>
		</div>

	);
}