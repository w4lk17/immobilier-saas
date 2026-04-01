"use client";

import { Download, Terminal } from "lucide-react";

import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { UserList } from "@/features/users/components/UserList";
import { useUsers } from "@/features/users/hooks/useUsers.hooks";
import { FrontendUser } from "@/types";

export default function UsersPage() {
	const { data: usersData, isLoading, isError, error } = useUsers();
	const users: FrontendUser[] = Array.isArray(usersData) ? usersData : [];

	if (isLoading) {
		return <div className="flex justify-center items-center h-64"><LoadingSpinner size={32} /></div>;
	}

	if (isError) {
		return (
			<Alert variant="destructive" className="max-w-2xl mx-auto">
				<Terminal className="h-4 w-4" />
				<AlertTitle>Erreur de chargement</AlertTitle>
				<AlertDescription>
					Impossible de charger la liste des utilisateurs: {error?.message}
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className=" h-full flex-1 flex-col gap-8 p-4 md:flex">
			<div className="flex items-center justify-between gap-2">
				<div className="flex flex-col gap-1">
					<h2 className="text-2xl font-bold tracking-tight">Gestion des utilisateurs</h2>
					<p className="text-muted-foreground">
						Gérez les comptes utilisateurs et assignez les rôles
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button variant="outline"
						onClick={() => { alert("Fonctionnalité d'export PDF à implémenter !"); }}
					>
						<Download /> Exporter
					</Button>
				</div>
			</div>
			<UserList users={users} />
		</div>
	);
}
