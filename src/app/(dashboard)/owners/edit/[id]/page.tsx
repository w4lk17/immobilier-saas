"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OwnerForm } from "@/features/owners/components/OwnerForm";
import { useOwner, useUpdateOwner } from "@/features/owners/hooks/useOwners.hooks";
import { OwnerUpdateFormData } from "@/features/owners/schemas/ownerSchemas";

export default function EditOwnerPage() {
	const router = useRouter();
	const params = useParams();
	const ownerId = params.id ? parseInt(params.id as string, 10) : null;

	const { data: owner, isLoading: isLoadingOwner, isError, error } = useOwner(ownerId);
	const updateOwnerMutation = useUpdateOwner();

	const handleSubmit = async (data: OwnerUpdateFormData) => {
		if (!ownerId) return;
		// Le hook gère déjà le toast et l'invalidation du cache
		await updateOwnerMutation.mutateAsync({ id: ownerId, data });
		router.push("/owners"); // Rediriger vers la liste après mise à jour
	};

	if (isLoadingOwner) {
		return <div className="flex justify-center items-center h-64"><LoadingSpinner size={32} /></div>;
	}

	if (isError || !owner) {
		return (
			<Alert variant="destructive">
				<Terminal className="h-4 w-4" />
				<AlertTitle>Erreur</AlertTitle>
				<AlertDescription>
					Impossible de charger les données du propriétaire. {error?.message}
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="h-full flex-col gap-8 p-4 md:flex">
			<div className=" flex items-center justify-between gap-2 sm:flex-row sm:items-center sm:gap-0">
				<div className="flex flex-col gap-1">
					<h2 className="text-2xl font-bold tracking-tight">Modifier propriétaire</h2>
				</div>
				<div className="flex items-center gap-2 sm:justify-end">
					<Button variant="outline" asChild>
						<Link href="/owners">
							<ArrowLeft />
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
				initialData={owner}
				onSubmit={handleSubmit}
				isLoading={updateOwnerMutation.isPending}
				submitButtonText="Mettre à jour le Profil"
			/>
		</div>
	);
}