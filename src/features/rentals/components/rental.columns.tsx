"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { MoreVertical, Eye, Edit3, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { RentalWithRelations } from "@/types";
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
} from "@/components/ui/alert-dialog";
import { useDeleteRental } from "../hooks/useRentals.hooks";
import { DataTableColumnHeader } from "@/components/shared/DataTable/data-table-column-header";
import { rentalStatusLabels, rentalTypeLabels } from "../lib/rentalLabels";
import { RentalStatus, RentalType } from "@/types/enums";
import { formatCurrency } from "@/lib/utils";

function RentalActions({ row, table }: { row: Row<RentalWithRelations>; table: any }) {
	const rental = row.original;
	const { mutate: deleteRental, isPending } = useDeleteRental();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isAlertOpen, setIsAlertOpen] = useState(false);

	const handleDelete = () => {
		deleteRental(rental.id);
		setIsDropdownOpen(false);
		setIsAlertOpen(false);
	};

	const openViewModal = () => {
		if (table?.options?.meta?.viewDetails) {
			table.options.meta.viewDetails(rental);
			setIsDropdownOpen(false);
		} else {
			console.warn("viewDetails function not found in table meta");
		}
	};

	return (
		<>
			<DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						className="h-8 w-8 p-0"
						onClick={(e) => { e.stopPropagation(); }}
					>
						<MoreVertical className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" onInteractOutside={() => setIsDropdownOpen(false)}>
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
						<Link
							href={`/admin/rentals/${rental.id}/edit`}
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
							Cette action est irréversible et supprimera définitivement ce local
							et toutes les données associées.
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

export const rentalColumns: ColumnDef<RentalWithRelations>[] = [
	{
		id: "name",
		accessorFn: row => row.name,
		header: ({ column }) => <DataTableColumnHeader column={column} title="Référence / Nom" />,
		cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
	},
	{
		id: "propertyName",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Propriété" />,
		accessorFn: row => row.property.name || row.property.address,
		cell: ({ row }) => {
			const property = row.original.property;
			return <div>{property?.name || property?.address || "N/A"}</div>;
		},
		enableSorting: false,
	},
	{
		accessorKey: "type",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
		cell: ({ row }) => {
			const type = row.getValue("type") as RentalType;
			return <Badge variant="outline">{rentalTypeLabels[type] || type}</Badge>;
		},
		enableSorting: false,
	},
	{
		accessorKey: "rentalValue",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Loyer" />,
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue("rentalValue"));
			return (
				// <div className="font-medium text-emerald-600">
				<div className="font-medium ">
					{formatCurrency(amount)}
				</div>
			);
		},
		enableSorting: false,
	},
	{
		accessorKey: "charges",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Charges" />,
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue("charges") || "0");
			return (
				// <div className="font-medium text-slate-500">
				<div className="font-medium">
					{formatCurrency(amount)}
				</div>
			);
		},
		enableSorting: false,
	},
	{
		accessorKey: "status",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" />,
		cell: ({ row }) => {
			const status = row.getValue("status") as RentalStatus;
			const label = rentalStatusLabels[status] || status;

			let variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" = "secondary";
			if (status === RentalStatus.AVAILABLE) variant = "outline";
			else if (status === RentalStatus.OCCUPIED) variant = "success";
			else if (status === RentalStatus.MAINTENANCE) variant = "warning";
			else if (status === RentalStatus.BOOKED) variant = "default";

			return <Badge variant={variant}>{label}</Badge>;
		},
		enableSorting: false,
	},
	{
		id: "actions",
		cell: ({ row, table }) => <RentalActions row={row} table={table} />,
		enableSorting: false,
		enableHiding: false,
	},
];
