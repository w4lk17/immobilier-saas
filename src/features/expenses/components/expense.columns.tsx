
"use client";

import { ColumnDef } from "@tanstack/react-table";
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
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Edit3, Trash2 } from "lucide-react";
import Link from "next/link";
import { useDeleteExpense } from '../hooks/useExpenses.hooks';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { formatCurrency } from "@/lib/utils";

const getExpenseStatusVariant = (status?: string) => {
	switch (status) {
		case 'PAID': return 'success';
		case 'PENDING': return 'warning';
		case 'CANCELLED': return 'secondary';
		default: return 'default';
	}
};

function ExpenseActionsCell({ expenseId }: { expenseId: number }) {
	const deleteExpenseMutation = useDeleteExpense();
	const handleDelete = () => deleteExpenseMutation.mutate(expenseId);

	return (
		<AlertDialog>
			<DropdownMenu>
				<DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuItem asChild><Link href={`/expenses/edit/${expenseId}`} className="flex items-center w-full cursor-pointer"><Edit3 className="mr-2 h-4 w-4" /> Modifier</Link></DropdownMenuItem>
					<DropdownMenuSeparator />
					<AlertDialogTrigger asChild>
						<DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10 flex items-center w-full cursor-pointer">
							<Trash2 className="mr-2 h-4 w-4" /> Supprimer
						</DropdownMenuItem>
					</AlertDialogTrigger>
				</DropdownMenuContent>
			</DropdownMenu>
			<AlertDialogContent>
				<AlertDialogHeader><AlertDialogTitle>Supprimer cette dépense ?</AlertDialogTitle></AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Annuler</AlertDialogCancel>
					<AlertDialogAction onClick={handleDelete} className={buttonVariants({ variant: "destructive" })}>Confirmer</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export const expenseColumns: ColumnDef<ExpenseWithRelations>[] = [
	{
		accessorKey: "property.address",
		header: "Propriété",
		cell: ({ row }) => row.original.property?.address || 'N/A',
	},
	{
		accessorKey: "description",
		header: "Description",
		cell: ({ row }) => <div className="truncate max-w-xs">{row.getValue("description")}</div>,
	},
	{
		accessorKey: "amount",
		header: "Montant",
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue("amount"));
			return <div className="text-right font-medium">{formatCurrency(amount)}</div>;
		},
	},
	{
		accessorKey: "date",
		header: "Date",
		cell: ({ row }) => format(new Date(row.getValue("date")), 'dd MMM yyyy', { locale: fr }),
	},
	{
		accessorKey: "type",
		header: "Type",
		cell: ({ row }) => <Badge variant="outline">{row.getValue("type")}</Badge>,
	},
	{
		accessorKey: "status",
		header: "Statut",
		cell: ({ row }) => {
			const status = row.getValue("status") as string;
			return <Badge variant={getExpenseStatusVariant(status) as any}>{status}</Badge>;
		},
	},
	{
		id: "actions",
		header: () => <div className="text-right">Actions</div>,
		cell: ({ row }) => <ExpenseActionsCell expenseId={row.original.id} />,
		enableSorting: false,
	},
];