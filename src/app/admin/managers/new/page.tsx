"use client";

import { ArrowLeftCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ManagerForm } from "@/features/managers/components/ManagerForm";
import { useCreateManager } from "@/features/managers/hooks/useManagers.hooks";
import { ManagerFormData, ManagerUpdateFormData } from "@/features/managers/schemas/managerSchemas";
import { useUsers } from "@/features/users/hooks/useUsers.hooks";
import { Button } from "@/components/ui/button";

export default function NewManagerPage() {
	const router = useRouter();
	const createManagerMutation = useCreateManager();
	const { data: users } = useUsers();

	const handleSubmit = async (data: ManagerFormData | ManagerUpdateFormData) => {
		if ('userId' in data && typeof data.userId === 'number' && 'position' in data) {
			await createManagerMutation.mutateAsync(data);
			router.push("/admin/managers");
		} else {
			console.error("Structure de données inattendue pour la création d'un gestionnaire:", data);
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
				usersForSelection={users || []}
			/>
		</div>
	);
}
