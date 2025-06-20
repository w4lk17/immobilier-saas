
"use client";

import { useProperties } from "@/features/properties/hooks/useProperties.hooks";
import { PropertyList } from "@/features/properties/components/PropertyList";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusIcon } from "lucide-react";

export default function PropertiesPage() {
	const { data: properties, isLoading, isError, error } = useProperties();

	if (isLoading) {
		// Afficher des Skeletons pendant le chargement
		return (
			<div className="space-y-4">
				<div className="flex justify-between items-center">
					<Skeleton className="h-8 w-32" />
					<Skeleton className="h-10 w-24" />
				</div>
				<Skeleton className="h-20 w-full" />
				<Skeleton className="h-20 w-full" />
				<Skeleton className="h-20 w-full" />
			</div>
		);
	}

	if (isError) {
		return <p className="text-destructive">Erreur de chargement: {error?.message || 'Inconnue'}</p>;
	}

	return (
		<div className="">
			{/* Breadcrumb */}
			<div>Breadcrumb</div>
			{/* Container */}
			<div className="flex flex-col xl:flex-row gap-4 p-4">
				{/* Left */}
				{/* <div className="xl:w-4/5 "> */}
					<div className="bg-primary-foreground p-4 rounded-lg gap-4">
						<div className="flex items-center justify-between mb-2">
							<h2 className="text-lg font-medium">Liste des propriétés</h2>
							<Button variant="outline" size="sm" >
								<PlusIcon />
								<Link href="/properties/new">
									<span className="hidden lg:inline">Nouveau</span>
								</Link>
							</Button>
						</div>
						{/* Passer les données au composant d'affichage */}
						<PropertyList properties={properties || []} />
					</div>
				{/* </div> */}
				{/* Right */}
				{/* <div className="xl:w-1/5">
					<div className="bg-primary-foreground p-4 rounded-lg gap-4">
						test
					</div>
				</div> */}
			</div>
		</div>
	);
}