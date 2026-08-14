"use client";

import { useState } from "react";
import Link from "next/link";
import { DoorOpen, Pencil, Plus, Trash2 } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
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
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { PropertyWithRelations } from "@/types";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Permission, hasPermission } from "@/lib/permissions";
import { useDeleteProperty } from "../hooks/useProperties.hooks";
import { useCreateRental } from "@/features/rentals/hooks/useRentals.hooks";
import { RentalForm } from "@/features/rentals/components/RentalForm";
import { RentalFormData } from "@/features/rentals/schemas/rentalSchemas";

interface PropertyActionsProps {
	property: PropertyWithRelations;
}

export function PropertyActions({ property }: PropertyActionsProps) {
	const { user } = useAuth();
	const { mutate: deleteProperty, isPending: isDeleting } = useDeleteProperty();
	const createRentalMutation = useCreateRental();

	const [showDeleteAlert, setShowDeleteAlert] = useState(false);
	const [showRentalSheet, setShowRentalSheet] = useState(false);

	const canCreateRental = user && hasPermission(user.role, Permission.RENTALS_CREATE);
	const canUpdate = user && hasPermission(user.role, Permission.PROPERTIES_UPDATE);
	const canDelete = user && hasPermission(user.role, Permission.PROPERTIES_DELETE);

	// Calcul du nombre de places disponibles pour ajouter un locatif
	const rentalCount = property.rentals?.length ?? 0;
	const unitCount = property.rentalUnits ?? 0;
	const hasAvailableUnits = unitCount > rentalCount;

	const handleDelete = () => {
		deleteProperty(property.id);
		setShowDeleteAlert(false);
	};

	const handleCreateRental = async (data: RentalFormData) => {
		await createRentalMutation.mutateAsync(data);
		setShowRentalSheet(false);
	};

	return (
		<>
			{canCreateRental && (
				<Button
					type="button"
					variant="outline"
					size="sm"
					disabled={!hasAvailableUnits}
					title={
						!hasAvailableUnits
							? "Tous les locaux ont été ajoutés. Impossible d'ajouter plus de locatifs."
							: undefined
					}
					onClick={() => setShowRentalSheet(true)}
				>
					<Plus className="size-4" />
					Locatif
				</Button>
			)}

			{canUpdate && (
				<Button variant="outline" size="sm"  asChild>
					<Link href={`/admin/properties/${property.id}/edit`}>
						<Pencil className="size-4" />
						Modifier
					</Link>
				</Button>
			)}

			{canDelete && (
				<Button
					type="button"
					variant="outline"
					size="sm"
					className=" text-destructive hover:text-destructive"
					onClick={() => setShowDeleteAlert(true)}
				>
					<Trash2 className="size-4" />
					Supprimer
				</Button>
			)}

			<Sheet open={showRentalSheet} onOpenChange={setShowRentalSheet}>
				<SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
					<SheetHeader>
						<SheetTitle>Nouveau locatif</SheetTitle>
						<SheetDescription>
							Ajouter un locatif pour la propriété : {property.address}
						</SheetDescription>
					</SheetHeader>
					<div className="px-4 pb-6">
						<RentalForm
							propertyId={property.id}
							onSubmit={handleCreateRental}
							isLoading={createRentalMutation.isPending}
						/>
					</div>
				</SheetContent>
			</Sheet>

			<AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
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
							onClick={handleDelete}
							disabled={isDeleting}
							className={buttonVariants({ variant: "destructive" })}
						>
							{isDeleting ? "Suppression..." : "Confirmer"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
