
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { PropertyWithRelations } from "@/types"; // Votre type frontend
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
} from "@/components/ui/alert-dialog"
import { MoreHorizontal, Eye, Edit3, Trash2, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { useDeleteProperty } from '../hooks/useProperties.hooks'; // Hook de suppression
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Helper pour le statut (peut être mis dans un fichier utilitaire)
const getPropertyStatusVariant = (status: string) => {
	switch (status) {
		case 'AVAILABLE': return 'success';
		case 'RENTED': return 'default';
		case 'MAINTENANCE': return 'warning';
		case 'UNAVAILABLE': return 'destructive';
		default: return 'secondary';
	}
};

// Composant interne pour les actions pour pouvoir utiliser le hook
function PropertyActionsCell({ propertyId }: { propertyId: number }) {
	const deletePropertyMutation = useDeleteProperty();

	const handleDeleteProperty = () => {
		deletePropertyMutation.mutate(propertyId);
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
						<Link href={`/properties/${propertyId}`} className="flex items-center w-full cursor-pointer">
							<Eye className="mr-2 h-4 w-4" /> Voir
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href={`/properties/edit/${propertyId}`} className="flex items-center w-full cursor-pointer">
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
					<AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
					<AlertDialogDescription>
						Cette action est irréversible et supprimera définitivement cette propriété
						et toutes les données associées.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Annuler</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleDeleteProperty}
						className={buttonVariants({ variant: "destructive" })}
						disabled={deletePropertyMutation.isPending}
					>
						{deletePropertyMutation.isPending ? "Suppression..." : "Confirmer"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}


export const propertyColumns: ColumnDef<PropertyWithRelations>[] = [
	{
		accessorKey: "address",
		header: "Adresse",
		cell: ({ row }) => <div className="font-medium">{row.getValue("address")}</div>,
	},
	{
		accessorKey: "type",
		header: "Type",
		cell: ({ row }) => <Badge variant="outline">{row.getValue("type")}</Badge>,
	},
	{
		accessorKey: "rentAmount",
		header: "Loyer",
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue("rentAmount"));
			return <div className="font-medium">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount)}</div>;
		},
	},
	{
		accessorKey: "status",
		header: "Statut",
		cell: ({ row }) => {
			const status = row.getValue("status") as string;
			return <Badge variant={getPropertyStatusVariant(status) as any}>{status}</Badge>;
		},
	},
	{
		accessorKey: "owner", // Pour le tri, si l'API le permet, sinon trier sur owner.user.lastName
		header: "Propriétaire",
		cell: ({ row }) => {
			const owner = row.original.owner; // Accéder à l'objet owner complet
			return <div>{owner?.user?.firstName || 'N/A'} {owner?.user?.lastName || ''}</div>;
		},
	},
	{
		accessorKey: "manager",
		header: "Gestionnaire",
		cell: ({ row }) => {
			const manager = row.original.manager;
			return <div>{manager?.user?.firstName || 'N/A'} {manager?.user?.lastName || ''}</div>;
		},
	},
	{
		id: "actions", // Colonne spéciale pour les actions
		header: () => <div className="text-right">Actions</div>,
		cell: ({ row }) => {
			const property = row.original;
			return (
				<div className="text-right">
					<PropertyActionsCell propertyId={property.id} />
				</div>
			);
		},
		enableSorting: false,
		enableHiding: false,
	},
];