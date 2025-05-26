
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FrontendOwner, FrontendUserSnippet } from "@/types";
import { Button, buttonVariants } from "@/components/ui/button";
// ... (imports DropdownMenu, AlertDialog, icons, Link, hook delete) ...
import {
	DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Edit3, Trash2, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { useDeleteOwner } from '../hooks/useOwners.hooks';

function OwnerActionsCell({ ownerId }: { ownerId: number }) {
	const deleteOwnerMutation = useDeleteOwner();
	const handleDelete = () => deleteOwnerMutation.mutate(ownerId);

	return (
		<AlertDialog>
			<DropdownMenu>
				<DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuItem asChild><Link href={`/owners/edit/${ownerId}`} className="flex items-center w-full cursor-pointer"><Edit3 className="mr-2 h-4 w-4" /> Modifier</Link></DropdownMenuItem>
					<DropdownMenuSeparator />
					<AlertDialogTrigger asChild>
						<DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10 flex items-center w-full cursor-pointer">
							<Trash2 className="mr-2 h-4 w-4" /> Supprimer
						</DropdownMenuItem>
					</AlertDialogTrigger>
				</DropdownMenuContent>
			</DropdownMenu>
			<AlertDialogContent>
				<AlertDialogHeader><AlertDialogTitle>Supprimer ce propriétaire ?</AlertDialogTitle>
					<AlertDialogDescription>Cette action est irréversible et supprimera le profil propriétaire ainsi que toutes ses propriétés associées.</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Annuler</AlertDialogCancel>
					<AlertDialogAction onClick={handleDelete} className={buttonVariants({ variant: "destructive" })} disabled={deleteOwnerMutation.isPending}>
						{deleteOwnerMutation.isPending ? "Suppression..." : "Confirmer"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export const ownerColumns: ColumnDef<FrontendOwner>[] = [
	{
		id: "name",
		header: "Nom",
		accessorFn: row => `${row.user?.firstName || ''} ${row.user?.lastName || ''}`.trim() || 'N/A',
		cell: ({ row }) => {
			const user = row.original.user as FrontendUserSnippet | undefined;
			return <div className="font-medium">{`${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'N/A'}</div>;
		}
	},
	{
		id: "email",
		header: "Email",
		accessorFn: row => row.user?.email || 'N/A',
	},
	{
		accessorKey: "phoneNumber",
		header: "Téléphone",
		cell: ({ row }) => row.getValue("phoneNumber") || '-',
	},
	// Ajoutez d'autres colonnes si nécessaire (ex: nombre de propriétés)
	{
		id: "actions",
		header: () => <div className="text-right">Actions</div>,
		cell: ({ row }) => <OwnerActionsCell ownerId={row.original.id} />,
		enableSorting: false,
	},
];