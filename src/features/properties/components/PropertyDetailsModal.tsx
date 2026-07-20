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
import { PropertyWithRelations } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import jsPDF from 'jspdf'; // Pour l'export PDF
// import autoTable from 'jspdf-autotable'; // Pour les tables dans PDF

interface PropertyDetailsModalProps {
	property: PropertyWithRelations| null;
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
}

export function PropertyDetailsModal({ property, isOpen, onOpenChange }: PropertyDetailsModalProps) {
	if (!property) return null;

	const getInitials = (firstName?: string | null, lastName?: string | null) => {
		const first = firstName?.[0] || '';
		const last = lastName?.[0] || '';
		return (first + last).toUpperCase() || 'TE';
	};

	const handleExportPDF = () => {
		alert("Fonctionnalité d'export PDF à implémenter !");
	};

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
				<DialogHeader className="pb-4">
					<div className="flex items-center space-x-4 mb-4">
						<Avatar className="h-16 w-16">
							{/* <AvatarImage src={property.user?.avatarUrl} /> */}
							<AvatarFallback className="text-xl">{getInitials(property.owner?.user?.firstName, property.owner?.user?.lastName)}</AvatarFallback>
						</Avatar>
						<div>
							<DialogTitle className="text-2xl">
								{property.type || ''} {property.status || 'Bien'}
							</DialogTitle>
							<DialogDescription>{property.address}</DialogDescription>
						</div>
					</div>
				</DialogHeader>

				<div className="grid gap-3 py-2 text-sm">
					<div className="flex items-center">
						<Mail className="mr-3 h-4 w-4 text-muted-foreground" />
						<span className="font-medium">Email Propriétaire :</span>
						<span className="ml-2 text-muted-foreground">{property.owner?.user?.email || 'N/A'}</span>
					</div>
					<div className="flex items-center">
						<Phone className="mr-3 h-4 w-4 text-muted-foreground" />
						<span className="font-medium">Téléphone Propriétaire :</span>
						<span className="ml-2 text-muted-foreground">{property.owner?.user?.phoneNumber || 'N/A'}</span>
					</div>
					<div className="flex items-center">
						<UserCog className="mr-3 h-4 w-4 text-muted-foreground" />
						<span className="font-medium">ID Bien :</span>
						<span className="ml-2 text-muted-foreground">{property.id}</span>
					</div>
					<div className="flex items-center">
						<CalendarDays className="mr-3 h-4 w-4 text-muted-foreground" />
						<span className="font-medium">Date d'embauche :</span>
						<span className="ml-2 text-muted-foreground">
							{/* {format(new Date(property.id), 'dd MMMM yyyy', { locale: fr })} */}
						</span>
					</div>
					<div className="flex items-center">
						<UserIcon className="mr-3 h-4 w-4 text-muted-foreground" />
						<span className="font-medium">ID Propriétaire associé :</span>
						<span className="ml-2 text-muted-foreground">{property.ownerId}</span>
					</div>
					<div className="flex items-center">
						<CalendarDays className="mr-3 h-4 w-4 text-muted-foreground" />
						<span className="font-medium">Bien créé le :</span>
						<span className="ml-2 text-muted-foreground">
							{property.createdAt ? format(new Date(property.createdAt), 'dd MMM yy, HH:mm', { locale: fr }) : 'N/A'}
						</span>
					</div>
				</div>

				<DialogFooter className="pt-6 justify-start">
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