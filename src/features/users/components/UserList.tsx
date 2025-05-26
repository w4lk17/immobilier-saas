
"use client";

// Pas de lien "Ajouter" car l'inscription se fait via /register.
// L'admin peut avoir un bouton spécifique sur sa page pour créer un user avec un rôle précis.
import { Users } from "lucide-react";
import { FrontendUserSnippet } from "@/types";
import { DataTable } from '@/components/shared/DataTable';
import { userColumns } from './user.columns';

interface UserListProps {
	users: FrontendUserSnippet[];
}

export function UserList({ users }: UserListProps) {
	const emptyState = (
		<div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
			<Users className="h-12 w-12 text-muted-foreground" />
			<h3 className="text-xl font-semibold">Aucun utilisateur trouvé</h3>
			<p className="text-muted-foreground">La liste des utilisateurs est actuellement vide.</p>
			{/* L'admin peut avoir un bouton "Créer un utilisateur" sur la page qui ouvre un formulaire spécifique */}
		</div>
	);

	return (
		<DataTable
			columns={userColumns}
			data={users || []}
			emptyStateContent={emptyState}
		/>
	);
}