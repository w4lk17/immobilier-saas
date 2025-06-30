
"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
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
import { useState } from "react";
import { DataTableColumnHeader } from "@/components/shared/DataTable/data-table-column-header";
import { table } from "console";

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
function ContractActions({ row, table }: { row: Row<ContractWithRelations>, table: any }) {
	const contract = row.original;
	const { mutate: deleteContract, isPending } = useDeleteContract();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isAlertOpen, setIsAlertOpen] = useState(false);

	const handleDelete = () => {
		deleteContract(contract.id);
		setIsDropdownOpen(false); // close dropdown after deletion
		setIsAlertOpen(false);
	}

	const openViewModal = () => {
		// null check
		if (table?.options?.meta?.viewDetails) {
			table.options.meta.viewDetails(contract);
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
						<Link href={`/contracts/edit/${contract.id}`}
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
						<AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce contrat ?</AlertDialogTitle>
						<AlertDialogDescription>
							Cette action est irréversible et supprimera définitivement ce contrat et ses paiements associés.
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
			</AlertDialog>
		</>
	);
}


export const contractColumns: ColumnDef<ContractWithRelations>[] = [
	{
		accessorKey: "property.address",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Propriété" />,
		cell: ({ row }) => row.original.property?.address || 'N/A',
		enableSorting: false,
	},
	{
		id: "tenantName",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Locataire" />,
		accessorFn: row => `${row.tenant?.user?.firstName || ''} ${row.tenant?.user?.lastName || ''}`.trim() || 'N/A',
		cell: ({ row }) => {
			const tenantUser = row.original.tenant?.user as FrontendUserSnippet | undefined;
			return `${tenantUser?.firstName || ''} ${tenantUser?.lastName || ''}`.trim() || '-';
		}
	},
	// TODO: add column "Locative" 
	// TODO: add column "Type contrat" 
	{
		accessorKey: "startDate",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Date Début" />,
		cell: ({ row }) => format(new Date(row.getValue("startDate")), 'dd MMM yyyy', { locale: fr }),
		enableSorting: false,
	},
	{
		accessorKey: "endDate",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Date Fin" />,
		cell: ({ row }) => {
			const endDate = row.getValue("endDate") as string | Date | null;
			return endDate ? format(new Date(endDate), 'dd MMM yyyy', { locale: fr }) : '-';
		},
		enableSorting: false,
	},
	{
		accessorKey: "updatedAt",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Traité le" />,
		cell: ({ row }) => format(new Date(row.getValue("updatedAt")), 'dd MMM yyyy', { locale: fr }),
		enableSorting: false,
	},
	{
		accessorKey: "rentAmount",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Loyer" />,
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue("rentAmount"));
			return <div className="text-right font-medium">{formatCurrency(amount)}</div>;
		},
		enableSorting: false,
	},
	{
		accessorKey: "status",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" />,
		cell: ({ row }) => {
			const status = row.getValue("status") as string;
			return <Badge variant={getContractStatusVariant(status) as any}>{status}</Badge>;
		},
		enableSorting: false,
	},
	// TODO: add column "Prochain paiement." 
	{
		id: "actions",
		// header: () => <div className="text-right">Actions</div>,
		cell: ({ row, table }) => <ContractActions row={row} table={table} />,
		enableSorting: false,
	},
];