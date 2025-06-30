"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProperty, useUpdateProperty } from "@/features/properties/hooks/useProperties.hooks";
import { PropertyForm } from "@/features/properties/components/PropertyForm";
import { PropertyUpdateFormData } from "@/features/properties/schemas/propertySchemas";

export default function EditPropertyPage() {
	const router = useRouter();
	const params = useParams();
	const propertyId = params.id ? parseInt(params.id as string, 10) : null;

	const { data: property, isLoading: isLoadingOwner, isError, error } = useProperty(propertyId);
	const updatePropertyMutation = useUpdateProperty();

	const handleSubmit = async (data: PropertyUpdateFormData) => {
		if (!propertyId) return;
		// Le hook gère déjà le toast et l'invalidation du cache
		await updatePropertyMutation.mutateAsync({ id: propertyId, data });
		router.push("/properties"); // Rediriger vers la liste après mise à jour
	};

	if (isLoadingOwner) {
		return <div className="flex justify-center items-center h-64"><LoadingSpinner size={32} /></div>;
	}

	if (isError || !property) {
		return (
			<Alert variant="destructive">
				<Terminal className="h-4 w-4" />
				<AlertTitle>Erreur</AlertTitle>
				<AlertDescription>
					Impossible de charger les données du bien. {error?.message}
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="h-full flex-col gap-8 p-4 md:flex">
			<div className=" flex items-center justify-between gap-2 sm:flex-row sm:items-center sm:gap-0">
				<div className="flex flex-col gap-1">
					<h2 className="text-2xl font-bold tracking-tight">Modifier bien</h2>
				</div>
				<div className="flex items-center gap-2 sm:justify-end">
					<Button variant="outline" asChild>
						<Link href="/properties">
							<ArrowLeft />
							liste des biens
						</Link>
					</Button>
					{/* <PresetSelector presets={presets} />
					<PresetSave />
					<div className="hidden space-x-2 md:flex">
						<CodeViewer />
						<PresetShare />
					</div>
					<PresetActions /> */}
				</div>
			</div>
			<PropertyForm
				initialData={property}
				onSubmit={handleSubmit}
				isLoading={updatePropertyMutation.isPending}
				submitButtonText="Mettre à jour le Bien"
			/>
		</div>
	);
}