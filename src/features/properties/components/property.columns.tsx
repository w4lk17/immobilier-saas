
"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { MoreHorizontal, Eye, Edit3, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { FrontendProperty, PropertyWithRelations } from "@/types"; // Votre type frontend
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
} from "@/components/ui/alert-dialog"
import { useDeleteProperty } from '../hooks/useProperties.hooks'; // Hook de suppression
import { DataTableColumnHeader } from "@/components/shared/DataTable/data-table-column-header";
import { getStatusBadge } from "@/lib/statusHelpers";

// Composant interne pour les actions pour pouvoir utiliser le hook
function PropertyActions({ row, table }: { row: Row<FrontendProperty>, table: any }) {
	const property = row.original;
	const { mutate: deleteProperty, isPending } = useDeleteProperty();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isAlertOpen, setIsAlertOpen] = useState(false);

	const handleDelete = () => {
		deleteProperty(property.id);
		setIsDropdownOpen(false); // close dropdown after deletion
		setIsAlertOpen(false);
	};

	const openViewModal = () => {
		// null check
		if (table?.options?.meta?.viewDetails) {
			table.options.meta.viewDetails(property);
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
						<Link href={`/properties/edit/${property.id}`}
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
						<AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
						<AlertDialogDescription>
							Cette action est irréversible et supprimera définitivement cette propriété
							et toutes les données associées.
						</AlertDialogDescription>
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
			</AlertDialog >
		</>
	);
}


export const propertyColumns: ColumnDef<PropertyWithRelations>[] = [
	{
		accessorKey: "address",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Adresse" />,
		cell: ({ row }) => <div className="font-medium">{row.getValue("address")}</div>,
		enableSorting: false,
	},
	// TODO: add column "Designation ou Nom du bien"
	{
		accessorKey: "type",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
		cell: ({ row }) => <Badge variant="outline">{row.getValue("type")}</Badge>,
	},
	{
		accessorKey: "rentAmount",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Loyer" />,
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue("rentAmount"));
			return <div className="font-medium">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount)}</div>;
		},
		enableSorting: false,
	},
	// TODO: add column "Valeur"
	{
		accessorKey: "status",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" />,
		cell: ({ row }) => {
			const status = row.getValue("status") as string;
			return getStatusBadge(status, 'property');
		},
	},
	{
		accessorKey: "owner", // Pour le tri, si l'API le permet, sinon trier sur owner.user.lastName
		header: ({ column }) => <DataTableColumnHeader column={column} title="Propriétaire" />,
		cell: ({ row }) => {
			const owner = row.original.owner; // Accéder à l'objet owner complet
			return <div>{owner?.user?.firstName || 'N/A'} {owner?.user?.lastName || ''}</div>;
		},
	},
	{
		accessorKey: "manager",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Gestionnaire" />,
		cell: ({ row }) => {
			const manager = row.original.manager;
			return <div>{manager?.user?.firstName || 'N/A'} {manager?.user?.lastName || ''}</div>;
		},
		enableSorting: false,
	},
	{
		id: "actions",
		// header: () => <div className="text-right">Actions</div>,
		cell: ({ row, table }) => <PropertyActions row={row} table={table} />,
		enableSorting: false,
		enableHiding: false,
	},
];