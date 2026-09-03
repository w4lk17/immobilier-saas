"use client";

import { Building2, DoorOpen, FileText, HandCoins, Layers, MapPin, Ruler, User, UserCog } from "lucide-react";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PropertyWithRelations } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { getPropertyStatusLabel, getPropertyTypeLabel } from "../lib/propertyLabels";

import { PropertyStatus } from "@/types/enums";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface PropertyCardProps {
	property: PropertyWithRelations;
	actions: React.ReactNode;
	onViewDetails?: () => void;
}

function getOwnerName(property: PropertyWithRelations): string {
	const first = property.owner?.user?.firstName ?? "";
	const last = property.owner?.user?.lastName ?? "";
	const name = `${first} ${last}`.trim();
	return name || "N/A";
}

function getManagerName(property: PropertyWithRelations): string {
	if (!property.manager) return "Non assigné";
	const first = property.manager.user?.firstName ?? "";
	const last = property.manager.user?.lastName ?? "";
	const name = `${first} ${last}`.trim();
	return name || "N/A";
}

function getRentalCount(property: PropertyWithRelations): number {
	return property._count?.rentals ?? property.rentals?.length ?? 0;
}

function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" {
	const normalized = status.toUpperCase();
	if (normalized === PropertyStatus.AVAILABLE || normalized === "RENTED") return "success";
	if (normalized === PropertyStatus.MAINTENANCE) return "warning";
	if (normalized === PropertyStatus.UNAVAILABLE) return "secondary";
	return "outline";
}


export function PropertyCard({ property, actions, onViewDetails }: PropertyCardProps) {
	const { user } = useAuth();
	const rentalCount = getRentalCount(property);

	return (
		<Card
			className="flex flex-col overflow-hidden gap-0 transition-shadow hover:shadow-md cursor-pointer"
			onClick={onViewDetails}
		>
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between">
					<div className="min-w-0 flex-1">
						{/* Référence sur la première ligne */}
						<h3 className="font-semibold leading-tight line-clamp-1" title={property.name ?? undefined}>
							{property.name ? property.name : "Propriété sans nom"}
						</h3>
						{/* Adresse sur la deuxième ligne */}
						<div className="text-muted-foreground text-sm truncate">{property.address}</div>
					</div>
					{/* Type à droite en badge */}
					<div className="flex flex-col items-end gap-1 min-w-[90px] pl-3 shrink-0">
						{/* badge Type */}
						<Badge variant="outline">{getPropertyTypeLabel(property.type)}</Badge>
						{/* badge Status */}
						{/* <Badge variant={getStatusVariant(property.status)}>
							{getPropertyStatusLabel(property.status)}
						</Badge> */}
					</div>
				</div>
			</CardHeader>

			<CardContent className="flex-1 space-y-3 pb-3 text-sm">
				{/* Nom */}
				{property.name && (
					<div className="flex items-center gap-2 text-muted-foreground">
						<span className="font-medium text-foreground">Référence : </span>
						<span>{property.name}</span>
					</div>
				)}

				{/* Valeur */}
				{property.propertyValue && (<div className="flex items-center gap-2 text-muted-foreground">
					<HandCoins className="h-4 w-4 shrink-0" />
					<span className="truncate">
						<span className="font-medium text-foreground">Valeur : </span>
						{formatCurrency(property.propertyValue ?? 0)}
					</span>
				</div>
				)}

				{/* Propriétaire */}
				{property.owner.user.id != user?.id && (<div className="flex items-center gap-2 text-muted-foreground">
					<User className="h-4 w-4 shrink-0" />
					<span className="truncate">
						<span className="font-medium text-foreground">Propriétaire : </span>
						{getOwnerName(property)}
					</span>
				</div>
				)}

				{/* Gestionnaire */}
				{property.manager && (
					<div className="flex items-center gap-2 text-muted-foreground">
						<UserCog className="h-4 w-4 shrink-0" />
						<span className="truncate">
							<span className="font-medium text-foreground">Gestionnaire : </span>
							{getManagerName(property)}
						</span>
					</div>
				)}

				{/* Locaux (UX/UI amélioré) */}
				<div className="flex items-center gap-2 text-muted-foreground">
					<DoorOpen className="h-4 w-4 shrink-0" />
					<span className="font-medium text-foreground">Locaux&nbsp;:</span>
					<span className="flex items-center gap-1 pl-1">
						<span className="bg-green-100 text-green-700 font-semibold rounded-full px-2 py-0.5 text-xs flex items-center">
							{rentalCount} <span className="ml-1 hidden sm:inline">ajouté{rentalCount > 1 ? "s" : ""}</span>
						</span>
						<span className="text-muted-foreground text-xs opacity-60 px-0.5">/</span>
						<span className="bg-gray-100 text-gray-700 font-semibold rounded-full px-2 py-0.5 text-xs flex items-center">
							{property.rentalUnits}
							<span className="ml-1 hidden sm:inline">total</span>
						</span>
					</span>
					{property.rentals && (
						<span className="bg-orange-100 text-orange-700 font-semibold rounded-full px-2 py-0.5 text-xs flex items-center ml-2">
							{property.rentals.filter(r => r.status === "AVAILABLE").length}
							<span className="ml-1 hidden sm:inline">
								vacant
								{property.rentals.filter(r => r.status === "AVAILABLE").length > 1 ? "s" : ""}
							</span>
						</span>
					)}



				</div>

				{/* Quartier */}
				{property.neighborhood && (
					<div className="flex items-center gap-2 text-muted-foreground">
						<MapPin className="h-4 w-4 shrink-0" />
						<span>
							<span className="font-medium text-foreground">Quartier : </span>
							{property.neighborhood}
						</span>
					</div>
				)}

				{/* Ville */}
				{property.city && (
					<div className="flex items-center gap-2 text-muted-foreground">
						<MapPin className="h-4 w-4 shrink-0" />
						<span>
							<span className="font-medium text-foreground">Ville : </span>
							{property.city}
						</span>
					</div>
				)}

				{/* Surface */}
				{typeof property.surface === "number" && (
					<div className="flex items-center gap-2 text-muted-foreground">
						<Ruler className="h-4 w-4 shrink-0" />
						<span>
							<span className="font-medium text-foreground">Surface : </span>
							{property.surface} m²
						</span>
					</div>
				)}

				{/* Lot */}
				{property.lot && (
					<div className="flex items-center gap-2 text-muted-foreground">
						<Layers className="h-4 w-4 shrink-0" />
						<span>
							<span className="font-medium text-foreground">Lot : </span>
							{property.lot}
						</span>
					</div>
				)}

				{/* N° Lot */}
				{property.nLot && (
					<div className="flex items-center gap-2 text-muted-foreground">
						<Layers className="h-4 w-4 shrink-0" />
						<span>
							<span className="font-medium text-foreground">N° Lot : </span>
							{property.nLot}
						</span>
					</div>
				)}

				{/* Titre Foncier */}
				{property.landTitle && (
					<div className="flex items-center gap-2 text-muted-foreground">
						<FileText className="h-4 w-4 shrink-0" />
						<span>
							<span className="font-medium text-foreground">Titre Foncier : </span>
							{property.landTitle}
						</span>
					</div>
				)}

				{/* Adresse */}
				{property.address && (
					<div className="flex items-center gap-2 text-muted-foreground">
						<MapPin className="h-4 w-4 shrink-0" />
						<span>
							<span className="font-medium text-foreground">Adresse : </span>
							{property.address}
						</span>
					</div>
				)}

				{/* Description */}
				{property.description && (
					<p className="line-clamp-2 text-xs text-muted-foreground">{property.description}</p>
				)}
			</CardContent>

			<CardFooter
				className="flex flex-wrap gap-2 border-t bg-muted/30 pt-4 "
				onClick={(e) => e.stopPropagation()}
			>
				{actions}
			</CardFooter>
		</Card>
	);
}
// className="flex flex-wrap gap-3 border-t bg-muted/30 pt-4 lg:border-t-0"
