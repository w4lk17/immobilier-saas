"use client";

import { ArrowLeftCircle, Terminal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useProperties } from "@/features/properties/hooks/useProperties.hooks";
import { RentalForm } from "@/features/rentals/components/RentalForm";
import { useCreateRental } from "@/features/rentals/hooks/useRentals.hooks";
import { RentalFormData } from "@/features/rentals/schemas/rentalSchemas";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Permission, hasPermission } from "@/lib/permissions";
import { PageHeader } from "@/components/shared/PageHeader";

export default function NewRentalPage() {
	const router = useRouter();
	const createRentalMutation = useCreateRental();
	const { data: properties, isLoading: isLoadingProperties } = useProperties();
	const { user } = useAuth();

	const canCreate = user && hasPermission(user.role, Permission.RENTALS_CREATE);

	if (!canCreate) {
		return (
			<Alert variant="destructive" className="max-w-2xl mx-auto mt-6">
				<Terminal className="h-4 w-4" />
				<AlertTitle>Accès refusé</AlertTitle>
				<AlertDescription>
					Vous n'avez pas la permission de créer un local.
				</AlertDescription>
			</Alert>
		);
	}

	const handleSubmit = async (data: RentalFormData) => {
		await createRentalMutation.mutateAsync(data);
		router.push("/admin/rentals");
	};

	if (isLoadingProperties) {
		return (
			<div className="flex justify-center items-center h-64">
				<LoadingSpinner size={32} />
			</div>
		);
	}

	return (
		<div className="space-y-6 p-4">
			<PageHeader
				title="Nouveau Local"
				description="Remplissez ce formulaire pour ajouter un nouveau local à louer."
				actions={
					<Button variant="secondary" size="sm" asChild>
						<Link href="/admin/rentals">
							<ArrowLeftCircle />
							Liste des locaux
						</Link>
					</Button>
				}
			/>
			
			{/* <div className="max-w-xl bg-card p-6 rounded-lg border shadow-sm"> */}
				<RentalForm
					onSubmit={handleSubmit}
					isLoading={createRentalMutation.isPending}
					submitButtonText="Créer le Local"
					propertiesForSelection={properties || []}
				/>
			{/* </div> */}
		</div>
	);
}
