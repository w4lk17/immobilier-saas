"use client";

import { ArrowLeftCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TenantForm } from "@/features/tenants/components/TenantForm";
import { TenantUpdateFormData } from "@/features/tenants/schemas/tenantSchemas";
import { useTenant, useUpdateTenant } from "@/features/tenants/hooks/useTenants.hooks";
import { PageHeader } from "@/components/shared/PageHeader";

export default function EditTenantPage() {
	const router = useRouter();
	const params = useParams();
	const tenantId =
		typeof params.id === "string"
			? Number(params.id)
			: Array.isArray(params.id)
				? Number(params.id[0])
				: undefined;

	const {
		data: tenant,
		isLoading,
		isError,
		error,
	} = useTenant(tenantId);
	const { mutateAsync: updateTenant, isPending } = useUpdateTenant();

	const handleSubmit = async (data: TenantUpdateFormData) => {
		if (!tenantId) return;
		await updateTenant({ id: tenantId, data });
		router.push("/admin/tenants");
	};

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-64">
				<LoadingSpinner size={32} />
			</div>
		);
	}

	if (isError || !tenant) {
		return (
			<Alert variant="destructive">
				<AlertTitle>Erreur</AlertTitle>
				<AlertDescription>
					Impossible de charger les données du locataire. {error?.message}
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="space-y-6 p-4">
			<PageHeader
				title="Modifier le locataire"
				description=""
				actions={
					<Button variant="secondary" size="sm" asChild>
						<Link href="/admin/tenants">
							<ArrowLeftCircle />
							Liste des locataires
						</Link>
					</Button>
				}
			/>
			<TenantForm
				mode="edit"
				initialData={tenant}
				onSubmit={handleSubmit}
				isLoading={isPending}
				submitButtonText="Mettre à jour le Profil"
			/>
		</div>
	);
}
