"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ContractList } from "@/features/contracts/components/ContractList";
import { useContracts } from "@/features/contracts/hooks/useContracts.hooks";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export default function ContractsPage() {
	const { data: contracts, isLoading, isError, error } = useContracts();

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
				<div className=" xl:w-4/5 ">
					<div className="bg-primary-foreground p-4 rounded-lg">
						<div className="flex items-center justify-between mb-2">
							<h2 className="text-lg font-medium">Liste des Contrats</h2>
							<Button variant="outline" size="sm" >
								<PlusIcon />
								<Link href="/contracts/new">
									<span className="hidden lg:inline">Nouveau</span>
								</Link>
							</Button>
						</div>
						{/*Composant d'affichage */}
						<ContractList contracts={contracts || []} />
					</div>
				</div>
				{/* Right */}
				<div className=" xl:w-1/5">

				</div>
			</div>
		</div>

	)
}