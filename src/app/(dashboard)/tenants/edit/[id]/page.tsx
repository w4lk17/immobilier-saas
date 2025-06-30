"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTenant, useUpdateTenant } from "@/features/tenants/hooks/useTenants.hooks";
import { TenantUpdateFormData } from "@/features/tenants/schemas/tenantSchemas";
import { TenantForm } from "@/features/tenants/components/TenantForm";

export default function EditTenantPage() {
	const router = useRouter();
	const params = useParams();
	const tenantId = params.id ? parseInt(params.id as string, 10) : null;

	const { data: tenant, isLoading: isLoadingOwner, isError, error } = useTenant(tenantId);
	const updateTenantMutation = useUpdateTenant();

	const handleSubmit = async (data: TenantUpdateFormData) => {
		if (!tenantId) return;
		// Le hook gère déjà le toast et l'invalidation du cache
		await updateTenantMutation.mutateAsync({ id: tenantId, data });
		router.push("/tenants"); // Rediriger vers la liste après mise à jour
	};

	if (isLoadingOwner) {
		return <div className="flex justify-center items-center h-64"><LoadingSpinner size={32} /></div>;
	}

	if (isError || !tenant) {
		return (
			<Alert variant="destructive">
				<Terminal className="h-4 w-4" />
				<AlertTitle>Erreur</AlertTitle>
				<AlertDescription>
					Impossible de charger les données du locataire. {error?.message}
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="h-full flex-col gap-8 p-4 md:flex">
			<div className=" flex items-center justify-between gap-2 sm:flex-row sm:items-center sm:gap-0">
				<div className="flex flex-col gap-1">
					<h2 className="text-2xl font-bold tracking-tight">Modifier locataire</h2>
				</div>
				<div className="flex items-center gap-2 sm:justify-end">
					<Button variant="outline" asChild>
						<Link href="/tenants">
							<ArrowLeft />
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
				initialData={tenant}
				onSubmit={handleSubmit}
				isLoading={updateTenantMutation.isPending}
				submitButtonText="Mettre à jour le Profil"
			/>
		</div>
	);
}