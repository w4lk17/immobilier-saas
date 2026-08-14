"use client";

import { ArrowLeftCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { TenantFormData } from "@/features/tenants/schemas/tenantSchemas";
import { TenantForm } from "@/features/tenants/components/TenantForm";
import { TENANT_QUERY_KEY, useCreateTenant } from "@/features/tenants/hooks/useTenants.hooks";
import { PageHeader } from "@/components/shared/PageHeader";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function NewTenantPage() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const { mutateAsync: createTenant, isPending, } = useCreateTenant();

	const handleSubmit = async (data: TenantFormData) => {
		await createTenant(data, {
			onSuccess(data) {
				toast.success(
					"Locataire créé avec succès. Un email lui a été envoyé.",
					{
						duration: 8000,
						action: {
							label: "Créer son bail →",
							onClick: () => {
								if (!data.id) {
									toast.error("Profil locataire introuvable pour générer le bail.");
									return;
								}
								router.push(`/admin/contracts/new?tenantId=${data.id}`);
							}
						}
					}
				);
				queryClient.invalidateQueries({ queryKey: TENANT_QUERY_KEY.lists() });
				router.push("/admin/tenants");
			}
		});
	};

	return (
		<div className="space-y-6 p-4">
			<PageHeader
				title="Nouveau locataire"
				description="Remplissez les informations du locataire pour l’ajouter à la plateforme." // et lui permettre d’accéder à son espace locataire."
				actions={
					<Button variant="secondary" size="sm" asChild>
						<Link href="/admin/tenants">
							<ArrowLeftCircle className="mr-2" />
							Liste des locataires
						</Link>
					</Button>
				}
			/>
			<TenantForm
				mode="create"
				onSubmit={handleSubmit}
				isLoading={isPending}
			/>
		</div>

	);
}
