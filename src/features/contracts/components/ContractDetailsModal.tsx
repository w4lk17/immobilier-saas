"use client";

import { Mail, Phone, UserCog, CalendarDays, Download, UserIcon } from "lucide-react";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogClose,
	DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ContractWithRelations, FrontendContract } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import jsPDF from 'jspdf'; // Pour l'export PDF
// import autoTable from 'jspdf-autotable'; // Pour les tables dans PDF

interface ContractDetailsModalProps {
	contract: ContractWithRelations | null;
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
}

export function ContractDetailsModal({ contract, isOpen, onOpenChange }: ContractDetailsModalProps) {
	if (!contract) return null;

	const getInitials = (firstName?: string | null, lastName?: string | null) => {
		const first = firstName?.[0] || '';
		const last = lastName?.[0] || '';
		return (first + last).toUpperCase() || 'CT';
	};

	const handleExportPDF = () => {
		// TODO: Implémenter la logique d'export PDF
		// Exemple basique avec jsPDF (nécessite installation)
		// const doc = new jsPDF();
		// doc.setFontSize(18);
		// doc.text(`Profil Contrat: ${contract.user?.firstName} ${contract.user?.lastName}`, 14, 22);
		// doc.setFontSize(12);
		// autoTable(doc, {
		//   startY: 30,
		//   head: [['Champ', 'Valeur']],
		//   body: [
		//     ['Nom Complet', `${contract.user?.firstName || ''} ${contract.user?.lastName || ''}`],
		//     ['Email', contract.user?.email || 'N/A'],
		//     ['Position', contract.position],
		//     ['Téléphone', contract.phoneNumber || 'N/A'],
		//     ['Date d\'embauche', format(new Date(contract.hireDate), 'dd MMMM yyyy', { locale: fr })],
		//   ],
		// });
		// doc.save(`profil_tenant_${contract.id}.pdf`);
		alert("Fonctionnalité d'export PDF à implémenter !");
	};

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
				<DialogHeader className="pb-4">
					<div className="flex items-center space-x-4 mb-4">
						<Avatar className="h-16 w-16">
							{/* <AvatarImage src={contract.user?.avatarUrl} /> */}
							<AvatarFallback className="text-xl">{getInitials(contract.tenant?.user?.firstName, contract.tenant?.user?.lastName)}</AvatarFallback>
						</Avatar>
						<div>
							<DialogTitle className="text-2xl">
								{contract.tenant?.user?.firstName || ''} {contract.tenant?.user?.lastName || 'Contrat'}
							</DialogTitle>
							<DialogDescription>{contract.property?.address}</DialogDescription>
						</div>
					</div>
				</DialogHeader>

				<div className="grid gap-3 py-2 text-sm">
					<div className="flex items-center">
						<Mail className="mr-3 h-4 w-4 text-muted-foreground" />
						<span className="font-medium">Email :</span>
						<span className="ml-2 text-muted-foreground">{contract.tenant?.user?.email || 'N/A'}</span>
					</div>
					<div className="flex items-center">
						<Phone className="mr-3 h-4 w-4 text-muted-foreground" />
						<span className="font-medium">Téléphone :</span>
						<span className="ml-2 text-muted-foreground">{contract.tenant?.phoneNumber || 'N/A'}</span>
					</div>
					<div className="flex items-center">
						<UserCog className="mr-3 h-4 w-4 text-muted-foreground" />
						<span className="font-medium">ID Contrat :</span>
						<span className="ml-2 text-muted-foreground">{contract.id}</span>
					</div>
					<div className="flex items-center">
						<CalendarDays className="mr-3 h-4 w-4 text-muted-foreground" />
						<span className="font-medium">Date debut :</span>
						<span className="ml-2 text-muted-foreground">
							{format(new Date(contract.startDate), 'dd MMMM yyyy', { locale: fr })}
						</span>
					</div>
					<div className="flex items-center">
						<UserIcon className="mr-3 h-4 w-4 text-muted-foreground" />
						<span className="font-medium">ID Propriétaire :</span>
						<span className="ml-2 text-muted-foreground">{contract.property?.ownerId}</span>
					</div>
					<div className="flex items-center">
						<CalendarDays className="mr-3 h-4 w-4 text-muted-foreground" />
						<span className="font-medium">Gérant :</span>
						<span className="ml-2 text-muted-foreground">
							{/* @ts-ignore // Supposant que createdAt/updatedAt existe sur ContractWithRelation, sinon ajouter */}
							{/* {contract.user?.createdAt ? format(new Date(contract.user?.createdAt), 'dd MMM yy, HH:mm', { locale: fr }) : 'N/A'} */}
							{contract.manager?.user?.firstName || ''} {contract.tenant?.user?.lastName || ''} 
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