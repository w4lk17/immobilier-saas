"use client";

import { MoreHorizontal, Edit3, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { useDeleteEmployee } from '../hooks/useEmployees.hooks';
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { ColumnDef, Row } from "@tanstack/react-table";

import { FrontendEmployee, FrontendUserSnippet } from "@/types";
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
	AlertDialog, AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DataTableColumnHeader } from "@/components/shared/DataTable/data-table-column-header";

// Étendre TableMeta pour inclure notre fonction
declare module '@tanstack/react-table' {
	interface TableMeta<TData extends unknown> {
		viewDetails?: (rowData: TData) => void;
	}
}

function EmployeeActions({ row, table }: { row: Row<FrontendEmployee>, table: any }) {
	const employee = row.original;
	const { mutate: deleteEmployee, isPending } = useDeleteEmployee();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isAlertOpen, setIsAlertOpen] = useState(false);

	const handleDelete = () => {
		deleteEmployee(employee.id);
		setIsDropdownOpen(false); // close dropdown after deletion
		setIsAlertOpen(false);
	}

	const openViewModal = () => {
		// null check
		if (table?.options?.meta?.viewDetails) {
			table.options.meta.viewDetails(employee);
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
							href={`/employees/edit/${employee.id}`}
							className="flex items-center w-full cursor-pointer"
							onClick={() => setIsDropdownOpen(false)}
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
						<AlertDialogTitle>Supprimer cet employé ?</AlertDialogTitle>
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
		</>
	);
}

export const employeeColumns: ColumnDef<FrontendEmployee>[] = [
	{
		id: "name",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Nom" />,
		accessorFn: row => `${row.user?.firstName || ''} ${row.user?.lastName || ''}`.trim() || 'N/A',
		cell: ({ row }) => {
			const user = row.original.user as FrontendUserSnippet | undefined;
			return <div className="font-medium">{`${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'N/A'}</div>;
		},
	},
	{
		id: "email",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
		accessorFn: row => row.user?.email || 'N/A',
		enableSorting: false,
	},
	{
		accessorKey: "position",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Position" />,
	},
	{
		accessorKey: "phoneNumber",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Téléphone" />,
		cell: ({ row }) => row.getValue("phoneNumber") || '-',
		enableSorting: false,
	},
	// TODO: add status of USER "actif or inactif"
	{
		accessorKey: "status",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" />,
		cell: ({ row }) => row.getValue("status") || '-',
		enableSorting: false,
	},
	{
		accessorKey: "hireDate",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Date d'embauche" />,
		cell: ({ row }) => format(new Date(row.getValue("hireDate")), 'dd MMM yyyy', { locale: fr }),
		enableSorting: false,
	},
	{
		id: "actions",
		// header: () => <div className="text-right">Actions</div>,
		cell: ({ row, table }) => <EmployeeActions row={row} table={table} />,
		enableSorting: false,
	},
];