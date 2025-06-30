
"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { useState } from "react";
import Link from "next/link";

import { FrontendTenant, FrontendUserSnippet } from "@/types";
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
import { MoreHorizontal, Edit3, Trash2, LucideReceiptText, Eye } from "lucide-react";
import { useDeleteTenant } from '../hooks/useTenants.hooks';
import { DataTableColumnHeader } from "@/components/shared/DataTable/data-table-column-header";

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
		// null check
		if (table?.options?.meta?.viewDetails) {
			table.options.meta.viewDetails(tenant);
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
						<Link href={`/tenants/edit/${tenant.id}`}
							className="flex items-center w-full cursor-pointer"
						>
							<Edit3 className="mr-2 h-4 w-4" /> Modifier
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href={`/tenants/${tenant.id}/payments`}
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

export const tenantColumns: ColumnDef<FrontendTenant>[] = [
	{
		id: "name",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Nom" />,
		accessorFn: row => `${row.user?.firstName || ''} ${row.user?.lastName || ''}`.trim() || 'N/A',
		cell: ({ row }) => {
			const user = row.original.user as FrontendUserSnippet | undefined;
			return <div className="font-medium">{`${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'N/A'}</div>;
		}
	},
	// TODO: add column "Locative occupee"
	{
		id: "email",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
		accessorFn: row => row.user?.email || 'N/A',
		enableSorting: false,
	},
	// TODO: add column "type" de locataire(particulier-professionel)
	{
		accessorKey: "phoneNumber",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Téléphone" />,
		cell: ({ row }) => row.getValue("phoneNumber") || '-',
		enableSorting: false,
	},
	// TODO: Ajoutez d'autres colonnes (nombre de contrats actifs, ,status (actif-inactif), date ajout)
	{
		id: "actions",
		// header: () => <div className="text-right">Actions</div>,
		cell: ({ row, table }) => <TenantActions row={row} table={table} />,
		enableSorting: false,
	},
];