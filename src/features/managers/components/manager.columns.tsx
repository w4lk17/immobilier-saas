"use client";

import { MoreHorizontal, Edit3, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { useDeleteManager } from '../hooks/useManagers.hooks';
import { useState } from "react";
import { ColumnDef, Row } from "@tanstack/react-table";

import { Manager } from "@/types";
import { Button, buttonVariants } from "@/components/ui/button";
import { formatDate, getRelativeTime } from "@/lib/dateUtils";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Permission, hasPermission } from "@/lib/permissions";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	AlertDialog, AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DataTableColumnHeader } from "@/components/shared/DataTable/data-table-column-header";
import { Switch } from "@/components/ui/switch";


function ManagerActions({ row, table }: { row: Row<Manager>, table: any }) {
	const manager = row.original;
	const { user } = useAuth();
	const { mutate: deleteManager, isPending } = useDeleteManager();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isAlertOpen, setIsAlertOpen] = useState(false);

	const canEdit = user && hasPermission(user.role, Permission.MANAGERS_UPDATE);
	const canDelete = user && hasPermission(user.role, Permission.MANAGERS_DELETE);

	const handleDelete = () => {
		deleteManager(manager.id);
		setIsDropdownOpen(false);
		setIsAlertOpen(false);
	}

	const openViewModal = () => {
		table?.options?.meta?.viewDetails?.(manager);
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
					{canEdit && (
						<DropdownMenuItem asChild>
							<Link
								href={`/admin/managers/${manager.id}/edit`}
								className="flex items-center w-full cursor-pointer"
								onClick={() => setIsDropdownOpen(false)}
							>
								<Edit3 className="mr-2 h-4 w-4" /> Modifier
							</Link>
						</DropdownMenuItem>
					)}
					{canDelete && (
						<>
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
						</>
					)}
				</DropdownMenuContent>
			</DropdownMenu>

			{canDelete && (
				<AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Supprimer ce gestionnaire ?</AlertDialogTitle>
							<AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
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
			)}
		</>
	);
}

export const managerColumns: ColumnDef<Manager>[] = [
	{
		id: "name",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Nom" />,
		accessorFn: row => `${row.user?.firstName || ''} ${row.user?.lastName || ''}`.trim() || 'N/A',
		cell: ({ row }) => {
			const user = row.original.user;
			const name = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'N/A';
			return <div className="font-medium">{name}</div>;
		},
	},
	{
		id: "email",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
		accessorFn: row => row.user?.email || 'N/A',
		enableSorting: false,
	},
	// {
	// 	accessorKey: "position",
	// 	header: ({ column }) => <DataTableColumnHeader column={column} title="Position" />,
	// 	accessorFn:row =>row.position,
	// 	enableSorting: false,
	// },
	
		{
			id: "phoneNumber",
			header: ({ column }) => <DataTableColumnHeader column={column} title="Téléphone" />,
			accessorFn: row => row.user?.phoneNumber || '-',
			cell: ({ row }) => {
				const user = row.original.user;
				return <span>{user?.phoneNumber || '-'}</span>;
			},
			enableSorting: false,
		},
	{
		accessorKey: "status",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" />,
		cell: ({ row, table }) => {
			const manager = row.original;
			const toggleStatus = table.options.meta?.toggleStatus;
			const isUpdatingStatus = table.options.meta?.isUpdatingStatus;

			return (
				<div className="flex items-center gap-2">
					<Switch
						checked={manager.user?.isActive}
						onCheckedChange={() => toggleStatus?.(manager.id, !!manager.user?.isActive)}
						disabled={isUpdatingStatus}
						aria-label="Changer le statut"
					/>
					<span className="text-xs text-muted-foreground">
						{manager.user?.isActive ? "Actif" : "Inactif"}
					</span>
				</div>
			);
		},
		enableSorting: false,
	},
	{
		id: "createdAt",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Créé le" />,
		accessorFn: row => row.user?.createdAt ?? null,
		cell: ({ row }) => {
			const dateValue = row.original.user?.createdAt;
			const relative = formatDate(dateValue);
			return (
				<div className="text-sm text-muted-foreground">
					{relative || "-"}
				</div>
			);
		},
		enableSorting: false,
	},
	// {
	// 	accessorKey: "hireDate",
	// 	header: ({ column }) => <DataTableColumnHeader column={column} title="Date d'embauche" />,
	// 	cell: ({ row }) => formatDate(row.getValue("hireDate")),
	// 	enableSorting: false,
	// },
	// {
	// 	accessorKey: "terminationDate",
	// 	header: ({ column }) => <DataTableColumnHeader column={column} title="Date de fin" />,
	// 	cell: ({ row }) => formatDate(row.getValue("terminationDate") || '-'),
	// 	enableSorting: false,
	// },
	{
		id: "actions",
		cell: ({ row, table }) => <ManagerActions row={row} table={table} />,
	},
];