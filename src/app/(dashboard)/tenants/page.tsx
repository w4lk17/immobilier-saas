"use client";

import { Download, Terminal } from "lucide-react";
import Link from "next/link";

import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { TenantList } from "@/features/tenants/components/TenantList";
import { useTenantsWithUser } from "@/features/tenants/hooks/useTenants.hooks";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Permission, hasPermission } from "@/lib/permissions";

export default function TenantsPage() {
	const { data: tenants, isLoading, isError, error } = useTenantsWithUser();
	const { user } = useAuth();

	const canRead = user && hasPermission(user.role, Permission.TENANTS_READ);
	const canCreate = user && hasPermission(user.role, Permission.TENANTS_CREATE);

	if (!canRead) {
		return (
			<Alert variant="destructive" className="max-w-2xl mx-auto">
				<Terminal className="h-4 w-4" />
				<AlertTitle>Accès refusé</AlertTitle>
				<AlertDescription>
					Vous n'avez pas la permission d'accéder à cette page.
				</AlertDescription>
			</Alert>
		);
	}

	if (isLoading) {
		return <div className="flex justify-center items-center h-64"><LoadingSpinner size={32} /></div>;
	}

	if (isError) {
		return (
			<Alert variant="destructive" className="max-w-2xl mx-auto">
				<Terminal className="h-4 w-4" />
				<AlertTitle>Erreur de chargement</AlertTitle>
				<AlertDescription>
					Impossible de charger la liste des locataires: {error?.message}
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className=" h-full flex-1 flex-col gap-8 p-4 md:flex">
			{/* TODO: change this div to reusable component */}
			<div className="flex items-center justify-between gap-2">
				<div className="flex flex-col gap-1">
					<h2 className="text-2xl font-bold tracking-tight">Liste des locataires </h2>
					<p className="text-muted-foreground">
						Here&apos;s a list of your tasks for this month!
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button variant="outline"
						onClick={() => { alert("Fonctionnalité d'export PDF à implémenter !"); }}
					>
						<Download /> Exporter
					</Button>
					{canCreate && (
						<Button asChild>
							<Link href="/tenants/new">
								Ajouter un locataire
							</Link>
						</Button>
					)}
				</div>
			</div>
			<TenantList tenants={tenants || []} />
		</div>
	);
}