
"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import Link from "next/link";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import { ExpenseWithRelations } from "@/types";
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
import { MoreHorizontal, Edit3, Trash2, Eye } from "lucide-react";
import { useDeleteExpense } from '../hooks/useExpenses.hooks';
import { formatCurrency } from "@/lib/utils";
import { DataTableColumnHeader } from "@/components/shared/DataTable/data-table-column-header";
import { useState } from "react";
import { getStatusBadge } from "@/lib/statusHelpers";

function ExpenseActions({ row, table }: { row: Row<ExpenseWithRelations>, table: any }) {
	const expense = row.original;
	const { mutate: deleteExpense, isPending } = useDeleteExpense();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isAlertOpen, setIsAlertOpen] = useState(false);

	const handleDelete = () => {
		deleteExpense(expense.id);
		setIsDropdownOpen(false); // close dropdown after deletion
		setIsAlertOpen(false);
	};

	const openViewModal = () => {
		// null check
		if (table?.options?.meta?.viewDetails) {
			table.options.meta.viewDetails(expense);
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
						<Link
							href={`/expenses/edit/${expense.id}`}
							className="flex items-center w-full cursor-pointer">
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
						<AlertDialogTitle>Supprimer cette dépense ?</AlertDialogTitle>
					</AlertDialogHeader>
					<AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
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
			</AlertDialog >
		</>
	);
}

export const expenseColumns: ColumnDef<ExpenseWithRelations>[] = [
	{
		accessorKey: "property.address",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Propriété" />,
		cell: ({ row }) => row.original.property?.address || 'N/A',
		enableSorting: false,
	},
	{
		accessorKey: "description",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
		cell: ({ row }) => <div className="truncate max-w-xs">{row.getValue("description")}</div>,
	},
	{
		accessorKey: "amount",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Montant" />,
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue("amount"));
			return <div className=" font-medium">{formatCurrency(amount)}</div>;
		},
		enableSorting: false,
	},
	{
		accessorKey: "date",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
		cell: ({ row }) => format(new Date(row.getValue("date")), 'dd MMM yyyy', { locale: fr }),
		enableSorting: false,
	},
	// TODO: add Column "ajouter par"
	{
		accessorKey: "type",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
		cell: ({ row }) => <Badge variant="outline">{row.getValue("type")}</Badge>,
	},
	{
		accessorKey: "status",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" />,
		cell: ({ row }) => {
			const status = row.getValue("status") as string;
			return getStatusBadge(status, 'expense');
		},
	},
	{
		id: "actions",
		cell: ({ row, table }) => <ExpenseActions row={row} table={table} />,
		enableSorting: false,
	},
];