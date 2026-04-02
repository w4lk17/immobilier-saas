"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Terminal } from "lucide-react";
import Link from "next/link";

import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ManagerForm } from "@/features/managers/components/ManagerForm";
import { useManager, useUpdateManager } from "@/features/managers/hooks/useManagers.hooks";
import { ManagerUpdateFormData } from "@/features/managers/schemas/managerSchemas";
import { Button } from "@/components/ui/button";

export default function EditManagerPage() {
	const router = useRouter();
	const params = useParams();
	const managerId = params.id ? parseInt(params.id as string, 10) : null;

	const { data: manager, isLoading: isLoadingManager, isError, error } = useManager(managerId);
	const updateManagerMutation = useUpdateManager();

	const handleSubmit = async (data: ManagerUpdateFormData) => {
		if (!managerId) return;
		await updateManagerMutation.mutateAsync({ id: managerId, data });
		router.push("/admin/managers");
	};

	if (isLoadingManager) {
		return <div className="flex justify-center items-center h-64"><LoadingSpinner size={32} /></div>;
	}

	if (isError || !manager) {
		return (
			<Alert variant="destructive">
				<Terminal className="h-4 w-4" />
				<AlertTitle>Erreur</AlertTitle>
				<AlertDescription>
					Impossible de charger les données du gestionnaire. {error?.message}
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="h-full flex-col gap-8 p-4 md:flex">
			<div className="flex items-center justify-between gap-2 sm:flex-row sm:items-center sm:gap-0">
				<div className="flex flex-col gap-1">
					<h2 className="text-2xl font-bold tracking-tight">Modifier Gestionnaire</h2>
				</div>
				<div className="flex items-center gap-2 sm:justify-end">
					<Button variant="outline" asChild>
						<Link href="/admin/managers">
							<ArrowLeft />
							Liste des gestionnaires
						</Link>
					</Button>
				</div>
			</div>
			<ManagerForm
				initialData={manager}
				onSubmit={handleSubmit}
				isLoading={updateManagerMutation.isPending}
				submitButtonText="Mettre à jour le gestionnaire"
			/>
		</div>
	);
}
