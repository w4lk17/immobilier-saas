"use client";

import { ArrowLeftCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useUsers } from "@/features/users/hooks/useUsers.hooks";
import { PropertyForm } from "@/features/properties/components/PropertyForm";
import { PropertyFormData, PropertyUpdateFormData } from "@/features/properties/schemas/propertySchemas";
import { useCreateProperty } from "@/features/properties/hooks/useProperties.hooks";

export default function NewPropertyPage() {
	const router = useRouter();
	const createPropertyMutation = useCreateProperty();
	const { data: users, isLoading: isLoadingUsers } = useUsers(); // Pour la sélection d'utilisateur

	const handleSubmit = async (data: PropertyFormData | PropertyUpdateFormData) => {
		if ('ownerId' in data && typeof data.ownerId === 'number') {
				// TypeScript sait maintenant que 'data' est PropertyFormData dans ce bloc
				await createPropertyMutation.mutateAsync(data);
				router.push("/properties");
			} else {
				console.error("Structure de données inattendue pour la création d'un Bien:", data);
			}
	};
	
	return (
		<div className="h-full flex-col gap-8 p-4 md:flex">
			<div className=" flex items-center justify-between gap-2 sm:flex-row sm:items-center sm:gap-0">
				<div className="flex flex-col gap-1">
					<h2 className="text-2xl font-bold tracking-tight">Nouveau Bien</h2>
				</div>
				<div className="flex items-center gap-2 sm:justify-end">
					<Button variant="secondary" size="sm" asChild>
						<Link href="/properties">
							<ArrowLeftCircle />
							liste locataire
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
			<PropertyForm
				onSubmit={handleSubmit}
				isLoading={createPropertyMutation.isPending}
				submitButtonText="Créer le Profil Bien"
				usersForSelection={users?.filter(u => u.role === 'USER') || []} // Exemple de filtre pour ComboBox
			/>
		</div>

	);
}