
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FrontendTenant, FrontendUserSnippet } from "@/types";
import { Button, buttonVariants } from "@/components/ui/button";
// ... (imports DropdownMenu, AlertDialog, icons, Link, hook delete) ...
import {
	DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Edit3, Trash2, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { useDeleteTenant } from '../hooks/useTenants.hooks';

function TenantActionsCell({ tenantId }: { tenantId: number }) {
	const deleteTenantMutation = useDeleteTenant();
	const handleDelete = () => deleteTenantMutation.mutate(tenantId);

	return (
		<AlertDialog>
			<DropdownMenu>
				<DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuItem asChild><Link href={`/tenants/edit/${tenantId}`} className="flex items-center w-full cursor-pointer"><Edit3 className="mr-2 h-4 w-4" /> Modifier</Link></DropdownMenuItem>
					<DropdownMenuSeparator />
					<AlertDialogTrigger asChild>
						<DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10 flex items-center w-full cursor-pointer">
							<Trash2 className="mr-2 h-4 w-4" /> Supprimer
						</DropdownMenuItem>
					</AlertDialogTrigger>
				</DropdownMenuContent>
			</DropdownMenu>
			<AlertDialogContent>
				<AlertDialogHeader><AlertDialogTitle>Supprimer ce locataire ?</AlertDialogTitle>
					<AlertDialogDescription>Cette action est irréversible et supprimera le profil locataire. Ses contrats et paiements pourraient être affectés.</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Annuler</AlertDialogCancel>
					<AlertDialogAction onClick={handleDelete} className={buttonVariants({ variant: "destructive" })} disabled={deleteTenantMutation.isPending}>
						{deleteTenantMutation.isPending ? "Suppression..." : "Confirmer"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export const tenantColumns: ColumnDef<FrontendTenant>[] = [
	{
		id: "name",
		header: "Nom",
		accessorFn: row => `${row.user?.firstName || ''} ${row.user?.lastName || ''}`.trim() || 'N/A',
		cell: ({ row }) => {
			const user = row.original.user as FrontendUserSnippet | undefined;
			return <div className="font-medium">{`${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'N/A'}</div>;
		}
	},
	{
		id: "email",
		header: "Email",
		accessorFn: row => row.user?.email || 'N/A',
	},
	{
		accessorKey: "phoneNumber",
		header: "Téléphone",
		cell: ({ row }) => row.getValue("phoneNumber") || '-',
	},
	// Ajoutez d'autres colonnes si nécessaire (ex: nombre de contrats actifs)
	{
		id: "actions",
		header: () => <div className="text-right">Actions</div>,
		cell: ({ row }) => <TenantActionsCell tenantId={row.original.id} />,
		enableSorting: false,
	},
];