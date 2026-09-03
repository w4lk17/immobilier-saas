
"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { InvoiceWithRelations } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { MoreVertical, Edit3, Trash2, Eye, BookXIcon } from "lucide-react";
import Link from "next/link";
import { useDeleteInvoice } from '../hooks/useInvoices.hooks';
import { formatCurrency } from "@/lib/utils";
import { DataTableColumnHeader } from "@/components/shared/DataTable/data-table-column-header";
import { formatDate, hasPermission, Permission } from "@/lib";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useState } from "react";
import { InvoiceStatus, InvoiceType } from "@/types/enums";
import { invoiceStatusLabels, invoiceTypeLabels } from "../lib/invoiceLabels";


function InvoiceActions({ row, table }: { row: Row<InvoiceWithRelations>, table: any }) {
	const invoice = row.original;
	const { mutate: deleteInvoice, isPending } = useDeleteInvoice();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isAlertOpen, setIsAlertOpen] = useState(false);
	const [isPreviewOpen, setIsPreviewOpen] = useState(false);

	const { user } = useAuth();

	const canEdit = user && hasPermission(user.role, Permission.INVOICES_UPDATE);
	const canDelete = user && hasPermission(user.role, Permission.INVOICES_DELETE);
	const canCancel = user && hasPermission(user.role, Permission.INVOICES_CANCEL);

	const handleDelete = () => {
		deleteInvoice(invoice.id);
		setIsDropdownOpen(false); // close dropdown after deletion
		setIsAlertOpen(false);
	}

	const handleCancel = () => {
		// cancelInvoice(invoice.id);
		setIsDropdownOpen(false); // close dropdown after deletion
		setIsAlertOpen(false);
	}

	const openViewModal = () => {
		table?.options?.meta?.viewDetails?.(invoice);
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

					{/* "Modifier" : PENDING */}
					{(invoice.status === InvoiceStatus.PENDING) && canEdit && (
						<DropdownMenuItem asChild>
							<Link
								href={`/admin/invoices/${invoice.id}/edit`}
								className="flex items-center w-full cursor-pointer"
							>
								<Edit3 className="mr-2 h-4 w-4" /> Modifier
							</Link>
						</DropdownMenuItem>
					)}

					{/* "Annuler" : CANCEL, PAID , + permission */}
					{(invoice.status === InvoiceStatus.PENDING || invoice.status === InvoiceStatus.PAID) && canCancel && (
						<DropdownMenuItem
							className="text-destructive focus:text-destructive focus:bg-destructive/10 flex items-center w-full cursor-pointer"
							onClick={() => {
								setIsAlertOpen(true);
								setIsDropdownOpen(false);
							}}
						>
							<BookXIcon className="mr-2 h-4 w-4" /> Annuler
						</DropdownMenuItem>
					)}

					{/* "Supprimer" : PENDING */}
					{(invoice.status === InvoiceStatus.PENDING) && canDelete && (
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
			{/* DELETE/CANCELED ALERT DIALOG */}
			<AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							{(invoice.status === InvoiceStatus.PENDING || invoice.status === InvoiceStatus.PAID)
								? "Annulation de la facture"
								: "Suppression de la facture"}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{(invoice.status === InvoiceStatus.PENDING || invoice.status === InvoiceStatus.PAID) ? (
								<>Confirmer l&apos;annulation de la facture <span className="text-sm font-bold">({invoice.invoiceNumber})</span>.</>
							) : (
								<>Confirmer la suppression de la facture <span className="text-sm font-bold">({invoice.invoiceNumber})</span>.</>
							)}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<span className="text-destructive text-sm italic">
						{(invoice.status === InvoiceStatus.PENDING || invoice.status === InvoiceStatus.PAID)
							? "Cette action est irréversible et annulera définitivement cette facture."
							: "Cette action est irréversible et supprimera définitivement cette facture et ses paiements associés."}
					</span>
					<AlertDialogFooter>
						<AlertDialogCancel>Annuler</AlertDialogCancel>
						<AlertDialogAction
							onClick={
								(invoice.status === InvoiceStatus.PENDING || invoice.status === InvoiceStatus.PAID)
									? handleCancel
									: handleDelete
							}
							className={buttonVariants({ variant: "destructive" })}
							disabled={isPending}
						>
							{isPending
								? (invoice.status === InvoiceStatus.PENDING || invoice.status === InvoiceStatus.PAID
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

export const invoiceColumns: ColumnDef<InvoiceWithRelations>[] = [
	// {
	// 	id: "invoiceNumber",
	// 	header: ({ column }) => <DataTableColumnHeader column={column} title="Référence" />,
	// 	accessorFn: row => row.invoiceNumber?.trim() || 'N/A',
	// 	cell: ({ row }) => {
	// 		const invoiceNumber = row.original.invoiceNumber?.trim();
	// 		return (
	// 			<div className="font-medium">
	// 				{invoiceNumber && invoiceNumber !== '' ? invoiceNumber : <span className="text-muted-foreground italic">N/A</span>}
	// 			</div>
	// 		);
	// 	},
	// 	enableSorting: false,
	// },
	{
		id: "tenantName",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Locataire" />,
		accessorFn: row => {
			const firstName = row.tenant?.user?.firstName?.trim() || "";
			const lastName = row.tenant?.user?.lastName?.trim() || "";
			const fullName = `${firstName} ${lastName}`.trim();
			return fullName !== "" ? fullName : "N/A";
		},
		cell: ({ row }) => {
			const tenantUser = row.original.tenant?.user;
			const firstName = tenantUser?.firstName?.trim() || "";
			const lastName = tenantUser?.lastName?.trim() || "";
			const fullName = `${firstName} ${lastName}`.trim();
			return fullName !== "" ? fullName : <span className="text-muted-foreground italic">N/A</span>;
		},
		enableSorting: false,
	},
	{
		accessorKey: "amount",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Montant" />,
		cell: ({ row }) => {
			const raw = row.original.amountDue;
			const amount = typeof raw === "number" ? raw : parseFloat(raw);
			return (
				<div className="font-medium">
					{!isNaN(amount) ? formatCurrency(amount) : <span className="text-muted-foreground italic">N/A</span>}
				</div>
			);
		},
		enableSorting: false,
	},
	{
		accessorKey: "type",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
		cell: ({ row }) => {
			const type = row.getValue("type") as InvoiceType;
			return (
				<Badge variant="outline">	{invoiceTypeLabels[type] || type} </Badge>
			);
		},
		enableSorting: false,
	},
	{
		accessorKey: "dueDate",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Échéance" />,
		cell: ({ row }) => {
			const dueDate = row.getValue("dueDate") as string | Date | null;
			return (
				<div className="whitespace-nowrap">
					{dueDate ? formatDate(dueDate) : <span className="text-muted-foreground italic">N/A</span>}
				</div>
			);
		},
		enableSorting: true,
	},
	// {
	// 	accessorKey: "paidDate",
	// 	header: ({ column }) => <DataTableColumnHeader column={column} title="Payé le" />,
	// 	cell: ({ row }) => {
	// 		const paidDate = row.getValue("paidDate") as string | Date | null;
	// 		return (
	// 			<div className="">
	// 				{paidDate ? formatDate(paidDate) : <span className="text-muted-foreground italic">-</span>}
	// 			</div>
	// 		);
	// 	},
	// 	enableSorting: false,
	// },
	{
		accessorKey: "status",
		header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" />,
		cell: ({ row }) => {
			const status = row.getValue("status") as InvoiceStatus;
			const label = invoiceStatusLabels[status] || status;

			let variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" = "secondary";
			if (status === InvoiceStatus.PAID) variant = "success";
			else if (status === InvoiceStatus.PARTIAL) variant = "default";
			else if (status === InvoiceStatus.OVERDUE) variant = "destructive";
			else if (status === InvoiceStatus.PENDING) variant = "warning";
			else if (status === InvoiceStatus.CANCELLED) variant = "outline";

			return <Badge variant={variant}>{label}</Badge>;
		},
		enableSorting: false,
	},
	{
		id: "actions",
		// header: () => <div className="text-right">Actions</div>,
		cell: ({ row, table }) => <InvoiceActions row={row} table={table} />,
		enableSorting: false,
	},
];
