"use client";

import { ArrowLeftCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { TenantFormData, TenantUpdateFormData } from "@/features/tenants/schemas/tenantSchemas";
import { useUsers } from "@/features/users/hooks/useUsers.hooks";
import { TenantForm } from "@/features/tenants/components/TenantForm";
import { useCreateTenant } from "@/features/tenants/hooks/useTenants.hooks";

export default function NewTenantPage() {
	const router = useRouter();
	const createTenantMutation = useCreateTenant();
	const { data: users, isLoading: isLoadingUsers } = useUsers(); // Pour la sélection d'utilisateur

	const handleSubmit = async (data: TenantFormData | TenantUpdateFormData) => {
			if ('userId' in data && typeof data.userId === 'number') {
				// TypeScript sait maintenant que 'data' est TenantFormData dans ce bloc
				await createTenantMutation.mutateAsync(data);
				router.push("/tenants");
			} else {
				console.error("Structure de données inattendue pour la création d'un Locataire:", data);
			}
	};
	
	return (
		<div className="h-full flex-col gap-8 p-4 md:flex">
			<div className=" flex items-center justify-between gap-2 sm:flex-row sm:items-center sm:gap-0">
				<div className="flex flex-col gap-1">
					<h2 className="text-2xl font-bold tracking-tight">Nouveau Locataire</h2>
				</div>
				<div className="flex items-center gap-2 sm:justify-end">
					<Button variant="secondary" size="sm" asChild>
						<Link href="/tenants">
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
			<TenantForm
				onSubmit={handleSubmit}
				isLoading={createTenantMutation.isPending}
				submitButtonText="Créer le Profil Locataire"
				usersForSelection={users?.filter(u => u.role === 'TENANT') || []} // Exemple de filtre pour ComboBox
			/>
		</div>

	);
}