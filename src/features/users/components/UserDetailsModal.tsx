"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/types";
import { Badge } from "@/components/ui/badge";
import { format, formatDate } from "date-fns";
import { fr } from "date-fns/locale";
import { formatDateTime } from "@/lib/dateUtils";

interface UserDetailsModalProps {
	user: User | null;
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
}

const roleColors: Record<string, string> = {
	ADMIN: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
	Manager: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
	OWNER: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
	TENANT: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
	USER: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
};

export function UserDetailsModal({ user, isOpen, onOpenChange }: UserDetailsModalProps) {
	if (!user) return null;

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Détails utilisateur</DialogTitle>
					<DialogDescription>
						Informations du profil {user.firstName && user.lastName ? `de ${user.firstName} ${user.lastName}` : ""}
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 py-4">
					<div className="grid grid-cols-1 gap-4">
						<div>
							<label className="text-sm font-medium text-muted-foreground">Email</label>
							<p className="text-sm font-medium">{user.email}</p>
						</div>
						<div>
							<label className="text-sm font-medium text-muted-foreground">Nom complet</label>
							<p className="text-sm font-medium">
								{user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : ""}
							</p>
						</div>
						<div>
							<label className="text-sm font-medium text-muted-foreground">Rôle</label>
							<div className="mt-1">
								<Badge className={`${roleColors[user.role] || roleColors.USER}`}>
									{user.role}
								</Badge>
							</div>
						</div>
						<div>
							<label className="text-sm font-medium text-muted-foreground">Statut</label>
							<div className="mt-1">
								<Badge variant={user.isActive ? "default" : "secondary"}>
									{user.isActive ? "Actif" : "Inactif"}
								</Badge>
							</div>
						</div>
						<div>
							<label className="text-sm font-medium text-muted-foreground">Téléphone</label>
							<p className="text-sm font-medium">{user.phoneNumber || "Non renseigné"}</p>
						</div>
						<div>
							<label className="text-sm font-medium text-muted-foreground">Créé le</label>
							<p className="text-sm font-medium">
								{user.createdAt
									? format(new Date(user.createdAt), "dd MMMM yyyy 'à' HH:mm", { locale: fr })
									: "Inconnu"}
							</p>
						</div>
						<div>
							<label className="text-sm font-medium text-muted-foreground">Modifié le</label>
							<p className="text-sm font-medium">
								{user.updatedAt
									? format(new Date(user.updatedAt), "dd MMMM yyyy 'à' HH:mm", { locale: fr })
									: "Inconnu"}
							</p>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
