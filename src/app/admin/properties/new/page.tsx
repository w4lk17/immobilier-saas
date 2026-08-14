"use client";

import { ArrowLeftCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useUsers } from "@/features/users/hooks/useUsers.hooks";
import { PropertyForm } from "@/features/properties/components/PropertyForm";
import { PropertyFormData, PropertyUpdateFormData } from "@/features/properties/schemas/propertySchemas";
import { useCreateProperty } from "@/features/properties/hooks/useProperties.hooks";
import { PageHeader } from "@/components/shared/PageHeader";

export default function NewPropertyPage() {
	const router = useRouter();
	const createPropertyMutation = useCreateProperty();
	const { data: users, isLoading: isLoadingUsers } = useUsers(); 

	const handleSubmit = async (data: PropertyFormData | PropertyUpdateFormData) => {
		if ('ownerId' in data && typeof data.ownerId === 'number') {
				await createPropertyMutation.mutateAsync(data as unknown as PropertyFormData);
				router.push("/admin/properties");
			} else {
				console.error("Structure de données inattendue pour la création d'un Bien:", data);
			}
	};
	
	return (
		<div className="space-y-6 p-4">
			<PageHeader
				title="Nouvelle Propriété"
				description="Remplissez ce formulaire pour ajouter une nouvelle propriété au système."
				actions={
					<Button variant="secondary" size="sm" asChild>
						<Link href="/admin/properties">
							<ArrowLeftCircle />
							Liste des propriétés
						</Link>
					</Button>
				}
			/>
			<PropertyForm
				onSubmit={handleSubmit}
				isLoading={createPropertyMutation.isPending}
				submitButtonText="Enregistrer la propriété"
				usersForSelection={users?.filter(u => u.role === 'USER') || []} 
			/>
		</div>

	);
}