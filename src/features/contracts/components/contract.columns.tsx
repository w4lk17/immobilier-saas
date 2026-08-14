
"use client";

import Link from "next/link";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useState } from "react";
import { ColumnDef, Row } from "@tanstack/react-table";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
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
import { ContractWithRelations } from "@/types";
import { Button, buttonVariants } from "@/components/ui/button";
import { MoreVertical, Eye, Edit3, Trash2, BookXIcon, } from "lucide-react";
import { useDeleteContract, useTerminateContract } from '../hooks/useContracts.hooks';
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/shared/DataTable/data-table-column-header";
import { getStatusBadge } from "@/lib/statusHelpers";
import { ContractStatus, LeaseType } from "@/types/enums";
import { hasPermission, Permission } from "@/lib/permissions";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { contractStatusLabels, leaseTypeLabels } from "../lib/contractLabels";


function ContractActions({ row, table }: { row: Row<ContractWithRelations>, table: any }) {
	const contract = row.original;
	const { mutate: deleteContract, isPending } = useDeleteContract();
	const { mutate: terminateContract, isPending: isTerminating } = useTerminateContract();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isAlertOpen, setIsAlertOpen] = useState(false);

	const { user } = useAuth();

	const canRead = user && hasPermission(user.role, Permission.CONTRACTS_READ);
	const canEdit = user && hasPermission(user.role, Permission.CONTRACTS_UPDATE);
	const canDelete = user && hasPermission(user.role, Permission.CONTRACTS_DELETE);
	const canTerminate = user && hasPermission(user.role, Permission.CONTRACTS_TERMINATE);

	const handleDelete = () => {
		deleteContract(contract.id);
		setIsDropdownOpen(false); // close dropdown after deletion
		setIsAlertOpen(false);
	}

	const handleStop = () => {
		terminateContract(contract.id);
		setIsDropdownOpen(false); // close dropdown after deletion
		setIsAlertOpen(false);
	}

	const openViewModal = () => {
		table?.options?.meta?.viewDetails?.(contract);
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
				<DropdownMenuContent
					align="end"
					onInteractOutside={() => setIsDropdownOpen(false)}
				>
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					{/* "Voir" est toujours disponible */}
					<DropdownMenuItem
						onClick={(e) => {
							e.preventDefault();
							openViewModal();
						}}
						className="flex items-center w-full cursor-pointer"
					>
						<Eye className="mr-2 h-4 w-4" /> Détails
					</DropdownMenuItem>

					{/* "Modifier" : PENDING ou EXPIRED */}
					{(contract.status === ContractStatus.PENDING || contract.status === ContractStatus.EXPIRED) && canEdit && (
						<DropdownMenuItem asChild>
							<Link
								href={`/admin/contracts/${contract.id}/edit`}
								className="flex items-center w-full cursor-pointer"
							>
								<Edit3 className="mr-2 h-4 w-4" /> Modifier
							</Link>
						</DropdownMenuItem>
					)}

					{/* "Terminer" : ACTIVE ou EXPIRED, + permission */}
					{(contract.status === ContractStatus.ACTIVE || contract.status === ContractStatus.EXPIRED) && canTerminate && (
						<DropdownMenuItem
							className="text-destructive focus:text-destructive focus:bg-destructive/10 flex items-center w-full cursor-pointer"
							onClick={() => {
								setIsAlertOpen(true);
								setIsDropdownOpen(false);
							}}
						>
							<BookXIcon className="mr-2 h-4 w-4" /> Terminer
						</DropdownMenuItem>
					)}

					{/* "Supprimer" : PENDING */}
					{(contract.status === ContractStatus.PENDING) && canDelete && (
						<DropdownMenuItem
							className="text-destructive focus:text-destructive focus:bg-destructive/10 flex items-center w-full cursor-pointer"
							onClick={() => {
								setIsAlertOpen(true);
								setIsDropdownOpen(false);
							}}
						>
							<Trash2 className="mr-2 h-4 w-4" /> Supprimer
						</DropdownMenuItem>
					)}
				</DropdownMenuContent>
			</DropdownMenu>
			{/* DELETE/TERMINATION ALERT DIALOG */}
			<AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							{(contract.status === ContractStatus.ACTIVE || contract.status === ContractStatus.EXPIRED)
								? "Arrêt du contrat"
								: "Suppression du contrat"}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{(contract.status === ContractStatus.ACTIVE || contract.status === ContractStatus.EXPIRED) ? (
								<>Confirmer l&apos;arrêt du contrat <span className="text-sm font-bold">({contract.reference})</span>.</>
							) : (
								<>Confirmer la suppression du contrat <span className="text-sm font-bold">({contract.reference})</span>.</>
							)}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<span className="text-destructive text-sm italic">
						{(contract.status === ContractStatus.ACTIVE || contract.status === ContractStatus.EXPIRED)
							? "Cette action est irréversible et mettra fin définitivement à ce contrat."
							: "Cette action est irréversible et supprimera définitivement ce contrat et ses paiements associés."}
					</span>
					<AlertDialogFooter>
						<AlertDialogCancel>Annuler</AlertDialogCancel>
						<AlertDialogAction
							onClick={
								(contract.status === ContractStatus.ACTIVE || contract.status === ContractStatus.EXPIRED)
									? handleStop
									: handleDelete
							}
							className={buttonVariants({ variant: "destructive" })}
							disabled={isPending}
						>
							{isPending
								? (contract.status === ContractStatus.ACTIVE || contract.status === ContractStatus.EXPIRED
									? "Arrêt en cours..."
									: "Suppression...")
								: "Confirmer"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}


export const contractColumns: ColumnDef<ContractWithRelations>[] = [
	{
		accessorKey: "reference",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Référence" />,
		cell: ({ row }) => row.getValue("reference") || '-',
		enableSorting: false,
	},
	{
		id: "tenantName",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Locataire" />,
		accessorFn: row => `${row.tenant?.user?.firstName || ''} ${row.tenant?.user?.lastName || ''}`.trim() || '-',
		cell: ({ row }) => {
			const tenantUser = row.original.tenant?.user;
			return `${tenantUser?.firstName || ''} ${tenantUser?.lastName || ''}`.trim() || '-';
		}
	},
	{
		id: "local",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Locative" />,
		accessorFn: row => row.rental?.name,
		cell: ({ row }) => row.original.rental?.name || '-',
		enableSorting: false,
	},
	{
		accessorKey: "leaseType",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Type de bail" />,
		cell: ({ row }) => {
			const type = row.getValue("leaseType") as LeaseType;
			return <Badge variant="outline">{leaseTypeLabels[type] || type}</Badge>;
		},
		enableSorting: false,
	},
	{
		accessorKey: "startDate",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Date de Début" />,
		cell: ({ row }) => format(new Date(row.getValue("startDate")), 'dd MMM yyyy', { locale: fr }),
		enableSorting: false,
	},
	{
		accessorKey: "endDate",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Date de Fin" />,
		cell: ({ row }) => {
			const endDate = row.getValue("endDate") as string | Date | null;
			return endDate ? format(new Date(endDate), 'dd MMM yyyy', { locale: fr }) : '-';
		},
		enableSorting: false,
	},
	{
		accessorKey: "status",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" />,
		cell: ({ row }) => {
			
			const status = row.getValue("status") as ContractStatus;
			const label = contractStatusLabels[status] || status;

			let variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" = "secondary";
			if (status === ContractStatus.ACTIVE) variant = "success";
			else if (status === ContractStatus.PENDING) variant = "warning";
			else if (status === ContractStatus.TERMINATED) variant = "default";
			else if (status === ContractStatus.EXPIRED) variant = "outline";

			return <Badge variant={variant}>{label}</Badge>
		},
		enableSorting: false,
	},
	// TODO: add column "Prochain paiement." 
	{
		id: "actions",
		cell: ({ row, table }) => <ContractActions row={row} table={table} />,
		enableSorting: false,
	},
];
