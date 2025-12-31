
"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

import { FrontendUser } from "@/types";
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
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Edit3, Trash2, Eye } from "lucide-react";
import { useDeleteUser } from '../hooks/useUsers.hooks';
import { DataTableColumnHeader } from "@/components/shared/DataTable/data-table-column-header";
import { Badge } from "@/components/ui/badge";

const roleColors: Record<string, string> = {
	ADMIN: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
	EMPLOYEE: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
	OWNER: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
	TENANT: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
	USER: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
};

function UserActions({ row, table }: { row: Row<FrontendUser>, table: any }) {
	const user = row.original;
	const { mutate: deleteUser, isPending } = useDeleteUser();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isAlertOpen, setIsAlertOpen] = useState(false);

	const handleDelete = () => {
		deleteUser(user.id);
		setIsDropdownOpen(false);
		setIsAlertOpen(false);
	}

	const openViewModal = () => {
		if (table?.options?.meta?.viewDetails) {
			table.options.meta.viewDetails(user);
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
						<Link href={`/users/edit/${user.id}`}
							className="flex items-center w-full cursor-pointer"
						>
							<Edit3 className="mr-2 h-4 w-4" /> Modifier
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
						<AlertDialogTitle>Supprimer cet utilisateur ?</AlertDialogTitle>
						<AlertDialogDescription>Cette action marquera l'utilisateur comme inactif. Ses données seront conservées à titre d'historique.</AlertDialogDescription>
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

export const userColumns: ColumnDef<FrontendUser>[] = [
	{
		id: "email",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
		accessorFn: row => row.email,
		enableSorting: true,
	},
	{
		id: "name",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Nom" />,
		accessorFn: row => `${row.firstName || ''} ${row.lastName || ''}`.trim() || 'N/A',
		cell: ({ row }) => {
			const name = `${row.original.firstName || ''} ${row.original.lastName || ''}`.trim() || 'N/A';
			return <div className="font-medium">{name}</div>;
		}
	},
	{
		accessorKey: "role",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Rôle" />,
		cell: ({ row }) => {
			const role = row.getValue("role") as string;
			return (
				<Badge className={`${roleColors[role] || roleColors.USER}`}>
					{role}
				</Badge>
			);
		},
	},
	{
		id: "createdAt",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Créé le" />,
		accessorFn: row => new Date(row.createdAt),
		cell: ({ row }) => {
			const date = new Date(row.original.createdAt);
			return <div className="text-sm text-muted-foreground">{formatDistanceToNow(date, { addSuffix: true, locale: fr })}</div>;
		},
	},
	{
		id: "status",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" />,
		cell: ({ row }) => {
			const isActive = row.original.isActive;
			return (
				<Badge variant={isActive ? "default" : "secondary"}>
					{isActive ? "Actif" : "Inactif"}
				</Badge>
			);
		},
	},
	{
		id: "actions",
		cell: ({ row, table }) => <UserActions row={row} table={table} />,
	},
];