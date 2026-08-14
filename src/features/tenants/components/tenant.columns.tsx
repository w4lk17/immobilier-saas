
"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { useState } from "react";
import Link from "next/link";

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
import { MoreVertical, Edit3, Trash2, LucideReceiptText, Eye,  } from "lucide-react";
import { useDeleteTenant } from '../hooks/useTenants.hooks';
import { DataTableColumnHeader } from "@/components/shared/DataTable/data-table-column-header";
// import { TenantActions } from "./tenant-actions";
import { FrontendTenant } from "@/types";
import { formatPhone } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { getStatusBadge, getStatusTextColor } from "@/lib/statusHelpers";
import { Badge } from "@/components/ui/badge";
function TenantActions({ row, table }: { row: Row<FrontendTenant>, table: any }) {
	const tenant = row.original;
	const { mutate: deleteTenant, isPending } = useDeleteTenant();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isAlertOpen, setIsAlertOpen] = useState(false);

	const handleDelete = () => {
		deleteTenant(tenant.id);
		setIsDropdownOpen(false); // close dropdown after deletion
		setIsAlertOpen(false);
	}

	const openViewModal = () => {
		table?.options?.meta?.viewDetails?.(tenant);
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
						<MoreVertical className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end"
					onInteractOutside={() => setIsDropdownOpen(false)}
				>
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuItem onClick={openViewModal} className="flex w-full items-center cursor-pointer">
						<Eye className="mr-2 h-4 w-4" /> Détails
					</DropdownMenuItem>
					
					<DropdownMenuItem asChild>
						<Link href={`/admin/tenants/${tenant.id}/edit`} className="flex w-full items-center cursor-pointer"	>
							<Edit3 className="mr-2 h-4 w-4" /> Modifier
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href={`/admin/tenants/${tenant.id}/payments`} className="flex w-full items-center cursor-pointer"		
						onClick={() => setIsDropdownOpen(false)}>
							<LucideReceiptText className="mr-2 h-4 w-4" /> Paiements
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
						<AlertDialogTitle>Supprimer ce locataire ?</AlertDialogTitle>
						<AlertDialogDescription>Cette action est irréversible et supprimera le profil locataire. Ses contrats et paiements pourraient être affectés.</AlertDialogDescription>
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

type TenantRow = FrontendTenant;

export const tenantColumns: ColumnDef<TenantRow>[] = [
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
		accessorKey: "phoneNumber",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Téléphone" />,
		cell: ({ row }) => formatPhone(row.getValue("phoneNumber")) || '-',
		enableSorting: false,
	},
	// {
	// 	id: "status",
	// 	header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" />,
	// cell: ({ row, table }) => {
	// 	const user = row.original;
	// 	const toggleStatus = table.options.meta?.toggleStatus;
	// 	const isUpdatingStatus = table.options.meta?.isUpdatingStatus;

	// 	return (
	// 		<div className="flex items-center gap-2">
	// 			<Switch
	// 				checked={user.isActive}
	// 				onCheckedChange={() => toggleStatus?.(user.id, user.isActive)}
	// 				disabled={isUpdatingStatus}
	// 				aria-label="Changer le statut"
	// 			/>
	// 			<span className="text-xs text-muted-foreground">
	// 				{user.isActive ? "Actif" : "Inactif"}
	// 			</span>
	// 		</div>
	// 	);
	// },
	// enableSorting: false,
  // },
	{
		id: "status",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" />,
		cell: ({ row }) => {
			const user = row.original;
			const label = user.isActive ? "Actif" : "Inactif";
			let variant: "success" | "outline" = user.isActive ? "success" : "outline";
			return <Badge variant={variant}>{label}</Badge>;
		},
		enableSorting: false,
	},
	
	{
		id: "actions",
		cell: ({ row, table }) => <TenantActions row={row} table={table} />,
	},
];
