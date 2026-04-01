"use client";

import { Terminal } from "lucide-react";

import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UserList } from "@/features/users/components/UserList";
import { useUsers } from "@/features/users/hooks/useUsers.hooks";
import { User } from "@/types";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Permission, hasPermission } from "@/lib/permissions";
import { PageHeader } from "@/components/shared/PageHeader";

export default function UsersPage() {
	const { data: usersData, isLoading:isDataLoading, isError, error } = useUsers();
	const { user: currentUser, isLoading: isAuthLoading } = useAuth();

	const users: User[] = Array.isArray(usersData) ? usersData : [];

	const canRead = currentUser && hasPermission(currentUser.role, Permission.USERS_READ);
	
	if (isAuthLoading) {
		return <div className="flex justify-center items-center h-screen"><LoadingSpinner size={32} /></div>;
	}

	if (!canRead) {
		return (
			<div className="p-4">
				<Alert variant="destructive" className="max-w-2xl mx-auto">
					<Terminal className="h-4 w-4" />
					<AlertTitle>Accès refusé</AlertTitle>
					<AlertDescription>
						Vous n'avez pas la permission d'accéder à cette page.
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	if (isDataLoading) {
		return <div className="flex justify-center items-center h-64"><LoadingSpinner size={32} /></div>;
	}

	if (isError) {
		return (
			<div className="p-4">
				<Alert variant="destructive" className="max-w-2xl mx-auto">
					<Terminal className="h-4 w-4" />
					<AlertTitle>Erreur de chargement</AlertTitle>
					<AlertDescription>
						Impossible de charger la liste des utilisateurs: {error?.message}
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	return (
		<div className="space-y-6 p-4">
			<PageHeader
			title="Gestion des utilisateurs"
			description="Gérez les comptes utilisateurs et assignez les rôles"
			/>
			
			<UserList users={users} />
		</div>
	);
}
