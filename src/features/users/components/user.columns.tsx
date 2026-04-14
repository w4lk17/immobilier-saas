"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { MoreHorizontal, Edit3, Trash2, Eye } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

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
import { User } from "@/types";
import { Button, buttonVariants } from "@/components/ui/button";
import { useDeleteUser } from '../hooks/useUsers.hooks';
import { DataTableColumnHeader } from "@/components/shared/DataTable/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { formatDate, getRelativeTime } from "@/lib/dateUtils";
import { Switch } from "@/components/ui/switch";
import { getRoleName } from "@/lib";

const roleColors: Record<string, string> = {
	ADMIN: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
	MANAGER: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
	OWNER: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
	TENANT: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
	USER: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
};

function UserActions({ row, table }: { row: Row<User>, table: any }) {
	const user = row.original;
	const { mutate: deleteUser, isPending } = useDeleteUser();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isAlertOpen, setIsAlertOpen] = useState(false);

	const handleDelete = () => {
		deleteUser(user.id);
		setIsDropdownOpen(false);
		setIsAlertOpen(false);
	};

	const openViewModal = () => {
		table?.options?.meta?.viewDetails?.(user);
		setIsDropdownOpen(false);
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
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>

					<DropdownMenuItem onClick={openViewModal} className="cursor-pointer">
						<Eye className="mr-2 h-4 w-4" /> Détails
					</DropdownMenuItem>

					<DropdownMenuItem asChild>
						<Link href={`/admin/users/${user.id}/edit`} className="cursor-pointer">
							<Edit3 className="mr-2 h-4 w-4" /> Modifier
						</Link>
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					<DropdownMenuItem
						className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
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
						<AlertDialogTitle>Supprimer définitivement ?</AlertDialogTitle>
						<AlertDialogDescription>
							Attention : Cette action est irréversible. L'utilisateur sera supprimé de la base de données.
							Pour simplement désactiver l'accès, utilisez le switch "Actif" dans le tableau.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Annuler</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
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

export const userColumns: ColumnDef<User>[] = [
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
		id: "email",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
		accessorFn: row => row.email,
		enableSorting: false,
	},
	{
		accessorKey: "role",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Rôle" />,
		cell: ({ row }) => {
			const role = row.getValue("role") as string;
			return (
				<Badge className={`${roleColors[role] || roleColors.USER}`}>
					{getRoleName(role)}
				</Badge>
			);
		},
		enableSorting: false,
	},
	{
		id: "createdAt",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Créé le" />,
		accessorFn: row => row.createdAt ?? null,
		cell: ({ row }) => {
			const dateValue = row.original.createdAt;
			const relative = formatDate(dateValue);
			return (
				<div className="text-sm text-muted-foreground">
					{relative || "Inconnu"}
				</div>
			);
		},
		enableSorting: false,
	},
	{
		id: "status",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" />,
		cell: ({ row, table }) => {
			const user = row.original;
			const toggleStatus = table.options.meta?.toggleStatus;
			const isUpdatingStatus = table.options.meta?.isUpdatingStatus;

			return (
				<div className="flex items-center gap-2">
					<Switch
						checked={user.isActive}
						onCheckedChange={() => toggleStatus?.(user.id, user.isActive)}
						disabled={isUpdatingStatus}
						aria-label="Changer le statut"
					/>
					<span className="text-xs text-muted-foreground">
						{user.isActive ? "Actif" : "Inactif"}
					</span>
				</div>
			);
		},
		enableSorting: false,
	},
	{
		id: "actions",
		cell: ({ row, table }) => <UserActions row={row} table={table} />,
	},
];