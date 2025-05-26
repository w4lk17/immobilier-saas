
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ContractWithRelations, FrontendUserSnippet } from "@/types";
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
import { useDeleteContract } from '../hooks/useContracts.hooks';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { formatCurrency } from "@/lib/utils";

// Helper pour le statut du contrat
const getContractStatusVariant = (status?: string) => {
	switch (status) {
		case 'ACTIVE': return 'success';
		case 'EXPIRED': return 'outline';
		case 'TERMINATED': return 'destructive';
		case 'DRAFT': return 'secondary';
		default: return 'default';
	}
};

// Composant interne pour les actions pour utiliser les hooks
function ContractActionsCell({ contractId }: { contractId: number }) {
	const deleteContractMutation = useDeleteContract();

	const handleDelete = () => {
		deleteContractMutation.mutate(contractId);
	};

	return (
		<AlertDialog>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-8 w-8 p-0">
						<span className="sr-only">Ouvrir menu</span>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuItem asChild>
						<Link href={`/contracts/${contractId}`} className="flex items-center w-full cursor-pointer">
							<Eye className="mr-2 h-4 w-4" /> Voir
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href={`/contracts/edit/${contractId}`} className="flex items-center w-full cursor-pointer">
							<Edit3 className="mr-2 h-4 w-4" /> Modifier
						</Link>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<AlertDialogTrigger asChild>
						<DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10 flex items-center w-full cursor-pointer">
							<Trash2 className="mr-2 h-4 w-4" /> Supprimer
						</DropdownMenuItem>
					</AlertDialogTrigger>
				</DropdownMenuContent>
			</DropdownMenu>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce contrat ?</AlertDialogTitle>
					<AlertDialogDescription>
						Cette action est irréversible et supprimera définitivement ce contrat et ses paiements associés.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Annuler</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleDelete}
						className={buttonVariants({ variant: "destructive" })}
						disabled={deleteContractMutation.isPending}
					>
						{deleteContractMutation.isPending ? "Suppression..." : "Confirmer"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}


export const contractColumns: ColumnDef<ContractWithRelations>[] = [
	{
		accessorKey: "property.address",
		header: "Propriété",
		cell: ({ row }) => row.original.property?.address || 'N/A',
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
		accessorKey: "startDate",
		header: "Date Début",
		cell: ({ row }) => format(new Date(row.getValue("startDate")), 'dd MMM yyyy', { locale: fr }),
	},
	{
		accessorKey: "endDate",
		header: "Date Fin",
		cell: ({ row }) => {
			const endDate = row.getValue("endDate") as string | Date | null;
			return endDate ? format(new Date(endDate), 'dd MMM yyyy', { locale: fr }) : 'En cours';
		}
	},
	{
		accessorKey: "rentAmount",
		header: "Loyer",
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue("rentAmount"));
			return <div className="text-right font-medium">{formatCurrency(amount)}</div>;
		},
	},
	{
		accessorKey: "status",
		header: "Statut",
		cell: ({ row }) => {
			const status = row.getValue("status") as string;
			return <Badge variant={getContractStatusVariant(status) as any}>{status}</Badge>;
		},
	},
	{
		id: "actions",
		header: () => <div className="text-right">Actions</div>,
		cell: ({ row }) => <ContractActionsCell contractId={row.original.id} />,
		enableSorting: false,
	},
];