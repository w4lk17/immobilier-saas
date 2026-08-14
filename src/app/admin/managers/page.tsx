"use client";

import { Terminal } from "lucide-react";
import Link from "next/link";

import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ManagerList } from "@/features/managers/components/ManagerList";
import { useManagersWithUser } from "@/features/managers/hooks/useManagers.hooks";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Permission, hasPermission } from "@/lib/permissions";

export default function ManagersPage() {
	const { data: managers, isLoading, isError, error } = useManagersWithUser();
	const { user } = useAuth();

	const canRead = user && hasPermission(user.role, Permission.MANAGERS_READ);
	const canCreate = user && hasPermission(user.role, Permission.MANAGERS_CREATE);

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
					Impossible de charger la liste des gestionnaires. {error?.message}
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="h-full flex-1 flex-col gap-8 p-4 md:flex">
			<div className="flex items-center justify-between gap-2">
				<div className="flex flex-col gap-1">
					<h2 className="text-2xl font-bold tracking-tight">Gestion des Gestionnaires</h2>
					<p className="text-muted-foreground">
						Gérez les gestionnaires et leurs informations
					</p>
				</div>
				{canCreate && (
					<Button asChild>
						<Link href="/admin/managers/new">
							Ajouter un gestionnaire
						</Link>
					</Button>
				)}
			</div>
			<ManagerList managers={managers || []} />
		</div>
	);
}
