
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { PaymentWithRelations, FrontendUserSnippet } from "@/types";
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
import { MoreHorizontal, Eye, Edit3, Trash2, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { useDeletePayment } from '../hooks/usePayments.hooks';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { formatCurrency } from "@/lib/utils";

const getPaymentStatusVariant = (status?: string) => {
	switch (status) {
		case 'PAID': return 'success';
		case 'PENDING': return 'warning';
		case 'LATE': return 'destructive';
		case 'CANCELLED': return 'secondary';
		default: return 'default';
	}
};

function PaymentActionsCell({ paymentId }: { paymentId: number }) {
	const deletePaymentMutation = useDeletePayment();
	const handleDelete = () => deletePaymentMutation.mutate(paymentId);

	return (
		<AlertDialog>
			<DropdownMenu>
				<DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					{/* Un paiement n'a pas toujours une page "Voir" dédiée, mais peut-être un modal de détail */}
					{/* <DropdownMenuItem asChild><Link href={`/payments/${paymentId}`} className="flex items-center w-full cursor-pointer"><Eye className="mr-2 h-4 w-4" /> Détails</Link></DropdownMenuItem> */}
					<DropdownMenuItem asChild><Link href={`/payments/edit/${paymentId}`} className="flex items-center w-full cursor-pointer"><Edit3 className="mr-2 h-4 w-4" /> Modifier Statut</Link></DropdownMenuItem>
					<DropdownMenuSeparator />
					<AlertDialogTrigger asChild>
						<DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10 flex items-center w-full cursor-pointer">
							<Trash2 className="mr-2 h-4 w-4" /> Supprimer
						</DropdownMenuItem>
					</AlertDialogTrigger>
				</DropdownMenuContent>
			</DropdownMenu>
			<AlertDialogContent>
				<AlertDialogHeader><AlertDialogTitle>Supprimer ce paiement ?</AlertDialogTitle></AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Annuler</AlertDialogCancel>
					<AlertDialogAction onClick={handleDelete} className={buttonVariants({ variant: "destructive" })}>Confirmer</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export const paymentColumns: ColumnDef<PaymentWithRelations>[] = [
	{
		id: "contractInfo",
		header: "Contrat (Propriété)",
		accessorFn: row => row.contract?.property?.address || 'N/A',
		cell: ({ row }) => {
			const contract = row.original.contract;
			return (
				<div>
					<div className="font-medium">{contract?.id ? `Contrat ID: ${contract.id}` : ''}</div>
					<div className="text-xs text-muted-foreground">{contract?.property?.address || 'Propriété non spécifiée'}</div>
				</div>
			)
		}
	},
	{
		id: "tenantName",
		header: "Locataire",
		accessorFn: row => `${row.tenant?.user?.firstName || ''} ${row.tenant?.user?.lastName || ''}`.trim() || 'N/A',
		cell: ({ row }) => {
			const tenantUser = row.original.tenant?.user as FrontendUserSnippet | undefined;
			return `${tenantUser?.firstName || ''} ${tenantUser?.lastName || ''}`.trim() || 'N/A';
		}
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
		accessorKey: "type",
		header: "Type",
		cell: ({ row }) => <Badge variant="secondary">{row.getValue("type")}</Badge>,
	},
	{
		accessorKey: "dueDate",
		header: "Échéance",
		cell: ({ row }) => format(new Date(row.getValue("dueDate")), 'dd MMM yyyy', { locale: fr }),
	},
	{
		accessorKey: "paidDate",
		header: "Payé le",
		cell: ({ row }) => {
			const paidDate = row.getValue("paidDate") as string | Date | null;
			return paidDate ? format(new Date(paidDate), 'dd MMM yyyy', { locale: fr }) : '-';
		}
	},
	{
		accessorKey: "status",
		header: "Statut",
		cell: ({ row }) => {
			const status = row.getValue("status") as string;
			return <Badge variant={getPaymentStatusVariant(status) as any}>{status}</Badge>;
		},
	},
	{
		id: "actions",
		header: () => <div className="text-right">Actions</div>,
		cell: ({ row }) => <PaymentActionsCell paymentId={row.original.id} />,
		enableSorting: false,
	},
];
