"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRental, useUpdateRental } from "@/features/rentals/hooks/useRentals.hooks";
import { RentalForm } from "@/features/rentals/components/RentalForm";
import { useProperties } from "@/features/properties/hooks/useProperties.hooks";
import { RentalFormData } from "@/features/rentals/schemas/rentalSchemas";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Permission, hasPermission } from "@/lib/permissions";

export default function EditRentalPage() {
	const router = useRouter();
	const params = useParams();
	const rentalId = params.id ? parseInt(params.id as string, 10) : null;
	const { user } = useAuth();

	const { data: rental, isLoading: isLoadingRental, isError: isRentalError, error: rentalError } = useRental(rentalId);
	const { data: properties, isLoading: isLoadingProperties } = useProperties();
	const updateRentalMutation = useUpdateRental();

	const canEdit = user && hasPermission(user.role, Permission.RENTALS_UPDATE);

	if (!canEdit) {
		return (
			<Alert variant="destructive" className="max-w-2xl mx-auto mt-6">
				<Terminal className="h-4 w-4" />
				<AlertTitle>Accès refusé</AlertTitle>
				<AlertDescription>
					Vous n'avez pas la permission de modifier ce local.
				</AlertDescription>
			</Alert>
		);
	}

	const handleSubmit = async (data: RentalFormData) => {
		if (!rentalId) return;
		await updateRentalMutation.mutateAsync({ id: rentalId, data });
		router.push("/admin/rentals");
	};

	if (isLoadingRental || isLoadingProperties) {
		return (
			<div className="flex justify-center items-center h-64">
				<LoadingSpinner size={32} />
			</div>
		);
	}

	if (isRentalError || !rental) {
		return (
			<Alert variant="destructive" className="max-w-2xl mx-auto mt-6">
				<Terminal className="h-4 w-4" />
				<AlertTitle>Erreur</AlertTitle>
				<AlertDescription>
					Impossible de charger les données du local : {rentalError?.message}
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="h-full flex-col gap-8 p-4 md:flex">
			<div className="flex items-center justify-between gap-2 sm:flex-row sm:items-center sm:gap-0">
				<div className="flex flex-col gap-1">
					<h2 className="text-2xl font-bold tracking-tight">Modifier le Local</h2>
				</div>
				<div className="flex items-center gap-2 sm:justify-end">
					<Button variant="outline" asChild>
						<Link href="/admin/rentals">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Liste des locaux
						</Link>
					</Button>
				</div>
			</div>
			
			<div className="max-w-xl bg-card p-6 rounded-lg border shadow-sm">
				<RentalForm
					initialData={rental}
					onSubmit={handleSubmit}
					isLoading={updateRentalMutation.isPending}
					submitButtonText="Mettre à jour le Local"
					propertiesForSelection={properties || []}
				/>
			</div>
		</div>
	);
}
