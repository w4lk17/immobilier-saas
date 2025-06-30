
"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { useState } from "react";
import Link from "next/link";
import { MoreHorizontal, Edit3, Trash2, Eye, Receipt, LucideReceiptText } from "lucide-react";

import { FrontendOwner, FrontendUserSnippet } from "@/types";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteOwner } from '../hooks/useOwners.hooks';
import { DataTableColumnHeader } from "@/components/shared/DataTable/data-table-column-header";

function OwnerActions({ row, table }: { row: Row<FrontendOwner>, table: any }) {
	const owner = row.original;
	const { mutate: deleteOwner, isPending } = useDeleteOwner();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isAlertOpen, setIsAlertOpen] = useState(false);

	const handleDelete = () => {
		deleteOwner(owner.id);
		setIsDropdownOpen(false); // close dropdown after deletion
		setIsAlertOpen(false);
	}

	const openViewModal = () => {
		// null check
		if (table?.options?.meta?.viewDetails) {
			table.options.meta.viewDetails(owner);
			setIsDropdownOpen(false);
		} else {
			console.warn('viewDetails function not found in table meta');
		}
	};

	return (
		<>
			<DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						className="h-8 w-8 p-0"
						onClick={(e) => { e.stopPropagation() }}
					>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					align="end"
					onInteractOutside={() => setIsDropdownOpen(false)}
				>
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuItem
						onClick={(e) => {
							e.preventDefault();
							openViewModal();
						}}
						className="flex items-center w-full cursor-pointer"
					>
						<Eye className="mr-2 h-4 w-4" /> Détails
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href={`/owners/edit/${owner.id}`}
							className="flex items-center w-full cursor-pointer"
							onClick={() => setIsDropdownOpen(false)}
						>
							<Edit3 className="mr-2 h-4 w-4" /> Modifier
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href={`/owners/${owner.id}/payments`}
							className="flex items-center w-full cursor-pointer"
							onClick={() => setIsDropdownOpen(false)}
						>
							<LucideReceiptText className="mr-2 h-4 w-4" /> Paiements
						</Link>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="text-destructive focus:text-destructive focus:bg-destructive/10 flex items-center w-full cursor-pointer"
						onClick={() => {
							setIsAlertOpen(true);
							setIsDropdownOpen(false);
						}}
					>
						<Trash2 className="mr-2 h-4 w-4" /> Supprimer
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Supprimer ce propriétaire ?</AlertDialogTitle>
						<AlertDialogDescription>Cette action est irréversible et supprimera le profil propriétaire ainsi que toutes ses propriétés associées.</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Annuler</AlertDialogCancel>
						<AlertDialogAction onClick={handleDelete}
							className={buttonVariants({ variant: "destructive" })}
							disabled={isPending}
						>
							{isPending ? "Suppression..." : "Confirmer"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}

export const ownerColumns: ColumnDef<FrontendOwner>[] = [
	{
		id: "name",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Nom" />,
		accessorFn: row => `${row.user?.firstName || ''} ${row.user?.lastName || ''}`.trim() || 'N/A',
		cell: ({ row }) => {
			const user = row.original.user as FrontendUserSnippet | undefined;
			return <div className="font-medium">{`${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'N/A'}</div>;
		}
	},
	// TODO: Ajoutez d'autres colonnes(nombre de Bien, Status user(actif-inactif), date ajout )
	{
		id: "email",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
		accessorFn: row => row.user?.email || 'N/A',
		enableSorting: false,
	},
	{
		accessorKey: "phoneNumber",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Téléphone" />,
		cell: ({ row }) => row.getValue("phoneNumber") || '-',
		enableSorting: false,
	},
	{
		id: "actions",
		// header: () => <div className="text-right">Actions</div>,
		cell: ({ row, table }) => <OwnerActions row={row} table={table} />,
		enableSorting: false,
	},
];