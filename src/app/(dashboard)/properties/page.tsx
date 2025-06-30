"use client";

import { Download, Terminal } from "lucide-react";

import { useProperties } from "@/features/properties/hooks/useProperties.hooks";
import { PropertyList } from "@/features/properties/components/PropertyList";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function PropertiesPage() {
	const { data: properties, isLoading, isError, error } = useProperties();

	if (isLoading) {
		return <div className="flex justify-center items-center h-64"><LoadingSpinner size={32} /></div>;
	}

	if (isError) {
		return (
			<Alert variant="destructive" className="max-w-2xl mx-auto">
				<Terminal className="h-4 w-4" />
				<AlertTitle>Erreur de chargement</AlertTitle>
				<AlertDescription>
					Impossible de charger la liste des biens immobiliers: {error?.message}
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className=" h-full flex-1 flex-col gap-8 p-4 md:flex">
			{/* TODO: change this div to reusable component */}
			<div className="flex items-center justify-between gap-2">
				<div className="flex flex-col gap-1">
					<h2 className="text-2xl font-bold tracking-tight">Liste des Biens </h2>
					<p className="text-muted-foreground">
						Liste des Biens immobiliers!
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button variant="outline"
						onClick={() => { alert("Fonctionnalité d'export PDF à implémenter !"); }}
					>
						<Download /> Exporter
					</Button>
				</div>
			</div>
			<PropertyList properties={properties || []} />
		</div>
	);
}