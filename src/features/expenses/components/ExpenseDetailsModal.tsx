"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	DialogClose, // Pour un bouton de fermeture explicite si besoin
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExpenseWithRelations } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, UserCog, CalendarDays, Download, UserIcon } from "lucide-react";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
// import jsPDF from 'jspdf'; // Pour l'export PDF
// import autoTable from 'jspdf-autotable'; // Pour les tables dans PDF

interface ExpenseDetailsModalProps {
	expense: ExpenseWithRelations | null;
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
}

export function ExpenseDetailsModal({ expense, isOpen, onOpenChange }: ExpenseDetailsModalProps) {
	if (!expense) return null;

	const getInitials = (firstName?: string | null, lastName?: string | null) => {
		const first = firstName?.[0] || '';
		const last = lastName?.[0] || '';
		return (first + last).toUpperCase() || 'EX';
	};

	const handleExportPDF = () => {
		// TODO: Implémenter la logique d'export PDF
		// Exemple basique avec jsPDF (nécessite installation)
		// const doc = new jsPDF();
		// doc.setFontSize(18);
		// doc.text(`Profil Expense: ${expense.user?.firstName} ${expense.user?.lastName}`, 14, 22);
		// doc.setFontSize(12);
		// autoTable(doc, {
		//   startY: 30,
		//   head: [['Champ', 'Valeur']],
		//   body: [
		//     ['Nom Complet', `${expense.user?.firstName || ''} ${expense.user?.lastName || ''}`],
		//     ['Email', expense.user?.email || 'N/A'],
		//     ['Position', expense.position],
		//     ['Téléphone', expense.phoneNumber || 'N/A'],
		//     ['Date d\'embauche', format(new Date(expense.hireDate), 'dd MMMM yyyy', { locale: fr })],
		//   ],
		// });
		// doc.save(`profil_employe_${expense.id}.pdf`);
		alert("Fonctionnalité d'export PDF à implémenter !");
	};

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
				<DialogHeader className="pb-4">
					<div className="flex items-center space-x-4 mb-4">
						<Avatar className="h-16 w-16">
							{/* <AvatarImage src={expense.user?.avatarUrl} /> */}
							<AvatarFallback className="text-xl">{getInitials(expense.property?.description, expense.property?.description)}</AvatarFallback>
						</Avatar>
						<div>
							<DialogTitle className="text-2xl">
								{expense.property?.address || ''} {expense.property?.managerId || 'Expense'}
							</DialogTitle>
							<DialogDescription>{expense.description}</DialogDescription>
						</div>
					</div>
				</DialogHeader>

				<div className="grid gap-3 py-2 text-sm">
					<div className="flex items-center">
						<Mail className="mr-3 h-4 w-4 text-muted-foreground" />
						<span className="font-medium">ID Dépense :</span>
						<span className="ml-2 text-muted-foreground">{expense.id || 'N/A'}</span>
					</div>
					<div className="flex items-center">
						<Phone className="mr-3 h-4 w-4 text-muted-foreground" />
						<span className="font-medium">Montant :</span>
						<span className="ml-2 text-muted-foreground">{expense.amount || 'N/A'}</span>
					</div>
					<div className="flex items-center">
						<UserCog className="mr-3 h-4 w-4 text-muted-foreground" />
						<span className="font-medium">Propriete :</span>
						<span className="ml-2 text-muted-foreground">{expense.property?.id}</span>
					</div>
					<div className="flex items-center">
						<CalendarDays className="mr-3 h-4 w-4 text-muted-foreground" />
						<span className="font-medium">Type de dépense :</span>
						<span className="ml-2 text-muted-foreground">
							{expense.type}
						</span>
					</div>
					<div className="flex items-center">
						<CalendarDays className="mr-3 h-4 w-4 text-muted-foreground" />
						<span className="font-medium">Date de dépense :</span>
						<span className="ml-2 text-muted-foreground">
							{format(new Date(expense.date), 'dd MMMM yyyy', { locale: fr })}
						</span>
					</div>
					<div className="flex items-center">
						<UserIcon className="mr-3 h-4 w-4 text-muted-foreground" />
						<span className="font-medium">Status :</span>
						<span className="ml-2 text-muted-foreground">{expense.status}</span>
					</div>
					<div className="flex items-center">
						<CalendarDays className="mr-3 h-4 w-4 text-muted-foreground" />
						<span className="font-medium">Dépense créé le :</span>
						<span className="ml-2 text-muted-foreground">
							{/* @ts-ignore // Supposant que createdAt/updatedAt existe sur ExpenseWithRelations, sinon ajouter */}
							{expense.createdAt ? format(new Date(expense.createdAt), 'dd MMM yy, HH:mm', { locale: fr }) : 'N/A'}
						</span>
					</div>
				</div>

				<DialogFooter className="pt-6 sm:justify-between">
					<Button variant="outline" onClick={handleExportPDF}>
						<Download className="mr-2 h-4 w-4" /> Exporter en PDF
					</Button>
					<DialogClose asChild>
						<Button type="button" variant="secondary">
							Fermer
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}