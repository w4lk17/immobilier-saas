"use client";

import { Building2, CalendarDays, DollarSign, Maximize2, Layers, Bed, HandCoinsIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

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
import { RentalWithRelations } from "@/types";
import { Badge } from "@/components/ui/badge";
import { rentalStatusLabels, rentalTypeLabels } from "../lib/rentalLabels";
import { RentalStatus } from "@/types/enums";
import { propertyStatusLabels, propertyTypeLabels } from "@/features/properties/lib/propertyLabels";
import { formatCurrency } from "@/lib/utils";

interface RentalDetailsModalProps {
	rental: RentalWithRelations | null;
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
}

export function RentalDetailsModal({ rental, isOpen, onOpenChange }: RentalDetailsModalProps) {
	if (!rental) return null;

	const statusLabel = rentalStatusLabels[rental.status] || rental.status;
	let statusVariant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" = "secondary";
	if (rental.status === RentalStatus.AVAILABLE) statusVariant = "success";
	else if (rental.status === RentalStatus.OCCUPIED) statusVariant = "default";
	else if (rental.status === RentalStatus.MAINTENANCE) statusVariant = "warning";
	else if (rental.status === RentalStatus.BOOKED) statusVariant = "outline";

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
				<DialogHeader className="pb-4 border-b">
					<div className="flex items-start justify-between">
						<div>
							<DialogTitle className="text-2xl font-bold flex items-center gap-2">
								{rental.name}
							</DialogTitle>
							<DialogDescription className="text-muted-foreground mt-1">
								{rentalTypeLabels[rental.type] || rental.type}
							</DialogDescription>
						</div>
						<Badge variant={statusVariant} className="text-sm px-2.5 py-0.5">
							{statusLabel}
						</Badge>
					</div>
				</DialogHeader>

				<div className="grid gap-6 py-4">
					{/* Informations Générales */}
					<div>
						<h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
							Informations Générales
						</h4>
						<div className="grid grid-cols-2 gap-4">
							<div className="flex items-center space-x-3 text-sm">
								<Layers className="h-4 w-4 text-muted-foreground shrink-0" />
								<div>
									<span className="block text-muted-foreground text-xs">Nombre de pièces</span>
									<span className="font-medium text-foreground">{rental.roomCount}</span>
								</div>
							</div>
							<div className="flex items-center space-x-3 text-sm">
								<Maximize2 className="h-4 w-4 text-muted-foreground shrink-0" />
								<div>
									<span className="block text-muted-foreground text-xs">Superficie</span>
									<span className="font-medium text-foreground">{rental.surface || "N/A"} m²</span>
								</div>
							</div>
							<div className="flex items-center space-x-3 text-sm">
								<Bed className="h-4 w-4 text-muted-foreground shrink-0" />
								<div>
									<span className="block text-muted-foreground text-xs">Meublé</span>
									<span className="font-medium text-foreground">
										{rental.isFurnished ? "Oui" : "Non"}
									</span>
								</div>
							</div>
							<div className="flex items-center space-x-3 text-sm">
								<CalendarDays className="h-4 w-4 text-muted-foreground shrink-0" />
								<div>
									<span className="block text-muted-foreground text-xs">Créé le</span>
									<span className="font-medium text-foreground">
										{rental.createdAt
											? format(new Date(rental.createdAt), "dd MMMM yyyy", { locale: fr })
											: "N/A"}
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Financier */}
					<div className="border-t pt-4">
						<h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
							Finances (Mensuel)
						</h4>
						<div className="grid grid-cols-2 gap-4">
							<div className="flex items-center space-x-3 text-sm">
								<HandCoinsIcon className="h-4 w-4 text-emerald-600 shrink-0" />
								<div>
									<span className="block text-muted-foreground text-xs">Loyer Hors Charges</span>
									<span className="font-semibold text-emerald-600">
										{formatCurrency(rental.rentalValue)}
									</span>
								</div>
							</div>
							<div className="flex items-center space-x-3 text-sm">
								<HandCoinsIcon className="h-4 w-4 text-slate-500 shrink-0" />
								<div>
									<span className="block text-muted-foreground text-xs">Charges</span>
									<span className="font-semibold text-slate-600">
										{formatCurrency(rental.charges || 0)}
									</span>
								</div>
							</div>
							<div className="flex items-center space-x-3 text-sm col-span-2 bg-slate-50 p-2.5 rounded-lg border border-dashed">
								<HandCoinsIcon className="h-5 w-5 text-emerald-700 shrink-0" />
								<div>
									<span className="block text-slate-500 text-xs font-medium">Total Mensuel (Loyer + Charges)</span>
									<span className="font-bold text-emerald-700 text-base">
										{formatCurrency(rental.rentalValue + (rental.charges || 0))}
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Propriété associée */}
					<div className="border-t pt-4">
						<h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
							Propriété associée
						</h4>
						{rental.property ? (
							<div className="flex items-start space-x-3 text-sm">
								<Building2 className="h-5 w-5 text-indigo-600 mt-0.5 shrink-0" />
								<div>
									<span className="font-semibold text-foreground block">
										{rental.property.name || "Propriété sans nom"}
									</span>
									<span className="text-muted-foreground text-xs">
										{rental.property.address}, {rental.property.city}
									</span>
									<span className="block text-muted-foreground text-xs mt-1">
										Type : {propertyTypeLabels[rental.property.type] || rental.property.type || '-'} |
										Statut : {propertyStatusLabels[rental.property.status] || rental.property.status || '-'}
									</span>
								</div>
							</div>
						) : (
							<p className="text-sm text-muted-foreground">Aucune propriété associée.</p>
						)}
					</div>
				</div>

				<DialogFooter className="pt-4 border-t gap-2 sm:gap-0">
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
