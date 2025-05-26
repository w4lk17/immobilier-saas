
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FrontendEmployee, FrontendUserSnippet } from "@/types";
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
import { useDeleteEmployee } from '../hooks/useEmployees.hooks';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

function EmployeeActionsCell({ employeeId }: { employeeId: number }) {
	const deleteEmployeeMutation = useDeleteEmployee();
	const handleDelete = () => deleteEmployeeMutation.mutate(employeeId);

	return (
		<AlertDialog>
			<DropdownMenu>
				<DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					{/* Optionnel: lien vers une page de détail de l'employé */}
					{/* <DropdownMenuItem asChild><Link href={`/employees/${employeeId}`} className="flex items-center w-full cursor-pointer"><Eye className="mr-2 h-4 w-4" /> Voir</Link></DropdownMenuItem> */}
					<DropdownMenuItem asChild><Link href={`/employees/edit/${employeeId}`} className="flex items-center w-full cursor-pointer"><Edit3 className="mr-2 h-4 w-4" /> Modifier</Link></DropdownMenuItem>
					<DropdownMenuSeparator />
					<AlertDialogTrigger asChild>
						<DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10 flex items-center w-full cursor-pointer">
							<Trash2 className="mr-2 h-4 w-4" /> Supprimer
						</DropdownMenuItem>
					</AlertDialogTrigger>
				</DropdownMenuContent>
			</DropdownMenu>
			<AlertDialogContent>
				<AlertDialogHeader><AlertDialogTitle>Supprimer cet employé ?</AlertDialogTitle>
					<AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Annuler</AlertDialogCancel>
					<AlertDialogAction onClick={handleDelete} className={buttonVariants({ variant: "destructive" })} disabled={deleteEmployeeMutation.isPending}>
						{deleteEmployeeMutation.isPending ? "Suppression..." : "Confirmer"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export const employeeColumns: ColumnDef<FrontendEmployee>[] = [
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
		accessorKey: "position",
		header: "Position",
	},
	{
		accessorKey: "phoneNumber",
		header: "Téléphone",
		cell: ({ row }) => row.getValue("phoneNumber") || '-',
	},
	//TODO: add status of USER "actif or inactif"
	{
		accessorKey: "status",
		header: "Statut",
		cell: ({ row }) => row.getValue("status") || '-',
	},
	{
		accessorKey: "hireDate",
		header: "Date d'embauche",
		cell: ({ row }) => format(new Date(row.getValue("hireDate")), 'dd MMM yyyy', { locale: fr }),
	},
	{
		id: "actions",
		// header: () => <div className="text-right">Actions</div>,
		cell: ({ row }) => <EmployeeActionsCell employeeId={row.original.id} />,
		enableSorting: false,
	},
];