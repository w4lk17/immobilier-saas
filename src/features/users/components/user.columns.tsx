
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FrontendUserSnippet } from "@/types"; // User type, non-sensitive
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Edit3, Trash2, ArrowUpDown, UserCheck, UserX } from "lucide-react";
import Link from "next/link";
import { useDeleteUser, useUpdateUser } from '../hooks/useUsers.hooks';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { UserRole } from "@/types/enums";

// Composant interne pour les actions
function UserActionsCell({ user }: { user: FrontendUserSnippet }) {
	const deleteUserMutation = useDeleteUser();
	// const updateUserMutation = useUpdateUser(); // Si on veut modifier le rôle rapidement par exemple

	const handleDelete = () => {
		deleteUserMutation.mutate(user.id);
	};

	// const handleToggleAdmin = () => {
	//     const newRole = user.role === UserRole.ADMIN ? UserRole.USER : UserRole.ADMIN;
	//     updateUserMutation.mutate({ id: user.id, data: { role: newRole } });
	// };

	return (
		<AlertDialog>
			<DropdownMenu>
				<DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuItem asChild><Link href={`/users/edit/${user.id}`} className="flex items-center w-full cursor-pointer"><Edit3 className="mr-2 h-4 w-4" /> Modifier</Link></DropdownMenuItem>
					{/* Optionnel: Action rapide pour changer rôle (si pas Admin) */}
					{/* {user.role !== UserRole.ADMIN && (
                    <DropdownMenuItem onClick={handleToggleAdmin} className="cursor-pointer">
                        {user.role === UserRole.USER || user.role === UserRole.TENANT || user.role === UserRole.OWNER || user.role === UserRole.EMPLOYEE ? <UserCheck className="mr-2 h-4 w-4" /> : <UserX className="mr-2 h-4 w-4" />}
                        {user.role === UserRole.USER || user.role === UserRole.TENANT || user.role === UserRole.OWNER || user.role === UserRole.EMPLOYEE ? "Promouvoir Admin" : "Rétrograder Admin"}
                    </DropdownMenuItem>
                )} */}
					{user.role !== UserRole.ADMIN && ( // Ne pas permettre de supprimer un admin facilement via cette UI
						<>
							<DropdownMenuSeparator />
							<AlertDialogTrigger asChild>
								<DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10 flex items-center w-full cursor-pointer">
									<Trash2 className="mr-2 h-4 w-4" /> Supprimer
								</DropdownMenuItem>
							</AlertDialogTrigger>
						</>
					)}
				</DropdownMenuContent>
			</DropdownMenu>
			<AlertDialogContent>
				<AlertDialogHeader><AlertDialogTitle>Supprimer cet utilisateur ?</AlertDialogTitle>
					<AlertDialogDescription>Cette action supprimera l'utilisateur et potentiellement ses profils associés (Employé, Propriétaire, Locataire).</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Annuler</AlertDialogCancel>
					<AlertDialogAction onClick={handleDelete} className={buttonVariants({ variant: "destructive" })} disabled={deleteUserMutation.isPending}>
						{deleteUserMutation.isPending ? "Suppression..." : "Confirmer"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}


export const userColumns: ColumnDef<FrontendUserSnippet>[] = [
	{
		id: "name",
		header: "Nom",
		accessorFn: row => `${row.firstName || ''} ${row.lastName || ''}`.trim(),
		cell: ({ row }) => {
			const name = `${row.original.firstName || ''} ${row.original.lastName || ''}`.trim();
			return <div className="font-medium">{name || "-"}</div>;
		}
	},
	{
		accessorKey: "email",
		header: ({ column }) => (
			<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
				
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
	},
	{
		accessorKey: "role",
		header: "Rôle",
		cell: ({ row }) => <Badge variant={row.getValue("role") === UserRole.ADMIN ? "destructive" : "secondary"}>{row.getValue("role")}</Badge>,
	},
	{
		accessorKey: "createdAt",
		header: "Créé le",
		cell: ({ row }) => format(new Date(row.getValue("createdAt")), 'dd MMM yyyy, HH:mm', { locale: fr }),
	},
	{
		id: "actions",
		header: () => <div className="text-right">Actions</div>,
		cell: ({ row }) => <UserActionsCell user={row.original} />,
		enableSorting: false,
	},
];