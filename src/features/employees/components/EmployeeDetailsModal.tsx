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
import { FrontendEmployee } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, UserCog, CalendarDays, Download, UserIcon } from "lucide-react";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
// import jsPDF from 'jspdf'; // Pour l'export PDF
// import autoTable from 'jspdf-autotable'; // Pour les tables dans PDF

interface EmployeeDetailsModalProps {
	employee: FrontendEmployee | null;
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
}

export function EmployeeDetailsModal({ employee, isOpen, onOpenChange }: EmployeeDetailsModalProps) {
	if (!employee) return null;

	const getInitials = (firstName?: string | null, lastName?: string | null) => {
		const first = firstName?.[0] || '';
		const last = lastName?.[0] || '';
		return (first + last).toUpperCase() || 'EM';
	};

	const handleExportPDF = () => {
		// TODO: Implémenter la logique d'export PDF
		// Exemple basique avec jsPDF (nécessite installation)
		// const doc = new jsPDF();
		// doc.setFontSize(18);
		// doc.text(`Profil Employé: ${employee.user?.firstName} ${employee.user?.lastName}`, 14, 22);
		// doc.setFontSize(12);
		// autoTable(doc, {
		//   startY: 30,
		//   head: [['Champ', 'Valeur']],
		//   body: [
		//     ['Nom Complet', `${employee.user?.firstName || ''} ${employee.user?.lastName || ''}`],
		//     ['Email', employee.user?.email || 'N/A'],
		//     ['Position', employee.position],
		//     ['Téléphone', employee.phoneNumber || 'N/A'],
		//     ['Date d\'embauche', format(new Date(employee.hireDate), 'dd MMMM yyyy', { locale: fr })],
		//   ],
		// });
		// doc.save(`profil_employe_${employee.id}.pdf`);
		alert("Fonctionnalité d'export PDF à implémenter !");
	};

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
				<DialogHeader className="pb-4">
					<div className="flex items-center space-x-4 mb-4">
						<Avatar className="h-16 w-16">
							{/* <AvatarImage src={employee.user?.avatarUrl} /> */}
							<AvatarFallback className="text-xl">{getInitials(employee.user?.firstName, employee.user?.lastName)}</AvatarFallback>
						</Avatar>
						<div>
							<DialogTitle className="text-2xl">
								{employee.user?.firstName || ''} {employee.user?.lastName || 'Employé'}
							</DialogTitle>
							<DialogDescription>{employee.position}</DialogDescription>
						</div>
					</div>
				</DialogHeader>

				<div className="grid gap-3 py-2 text-sm">
					<div className="flex items-center">
						<Mail className="mr-3 h-4 w-4 text-muted-foreground" />
						<span className="font-medium">Email :</span>
						<span className="ml-2 text-muted-foreground">{employee.user?.email || 'N/A'}</span>
					</div>
					<div className="flex items-center">
						<Phone className="mr-3 h-4 w-4 text-muted-foreground" />
						<span className="font-medium">Téléphone :</span>
						<span className="ml-2 text-muted-foreground">{employee.phoneNumber || 'N/A'}</span>
					</div>
					<div className="flex items-center">
						<UserCog className="mr-3 h-4 w-4 text-muted-foreground" />
						<span className="font-medium">ID Employé :</span>
						<span className="ml-2 text-muted-foreground">{employee.id}</span>
					</div>
					<div className="flex items-center">
						<CalendarDays className="mr-3 h-4 w-4 text-muted-foreground" />
						<span className="font-medium">Date d'embauche :</span>
						<span className="ml-2 text-muted-foreground">
							{format(new Date(employee.hireDate), 'dd MMMM yyyy', { locale: fr })}
						</span>
					</div>
					<div className="flex items-center">
						<UserIcon className="mr-3 h-4 w-4 text-muted-foreground" />
						<span className="font-medium">ID Utilisateur associé :</span>
						<span className="ml-2 text-muted-foreground">{employee.userId}</span>
					</div>
					<div className="flex items-center">
						<CalendarDays className="mr-3 h-4 w-4 text-muted-foreground" />
						<span className="font-medium">Profil créé le :</span>
						<span className="ml-2 text-muted-foreground">
							{/* @ts-ignore // Supposant que createdAt/updatedAt existe sur FrontendEmployee, sinon ajouter */}
							{employee.user?.createdAt ? format(new Date(employee.user.createdAt), 'dd MMM yy, HH:mm', { locale: fr }) : 'N/A'}
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