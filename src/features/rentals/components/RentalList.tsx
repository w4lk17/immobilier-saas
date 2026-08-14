"use client";

import { useState } from "react";
import { Home, PlusCircle } from "lucide-react";

import { RentalWithRelations } from "@/types";
import { DataTable } from "@/components/shared/DataTable/DataTable";
import { DataTableEmptyState } from "@/components/shared/DataTable/DataTableEmptyState";
import { rentalColumns } from "./rental.columns";
import { RentalDetailsModal } from "./RentalDetailsModal";

interface RentalListProps {
	rentals: RentalWithRelations[];
}

export function RentalList({ rentals }: RentalListProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedRental, setSelectedRental] = useState<RentalWithRelations | null>(null);

	const handleViewDetails = (rental: RentalWithRelations) => {
		setSelectedRental(rental);
		setIsModalOpen(true);
	};

	const emptyState = (
		<DataTableEmptyState
			icon={Home}
			title="Aucun local trouvé"
			description="Vous n’avez pas encore de local ou de logement locatif enregistré."
			actionHref="/admin/rentals/new"
			actionLabel="Ajouter un local"
			actionIcon={PlusCircle}
		/>
	);

	return (
		<div className="grid grid-cols-1 gap-4">
			<DataTable
				columns={rentalColumns}
				data={rentals || []}
				meta={{ viewDetails: handleViewDetails }}
				searchPlaceholder="Rechercher par propriété"
				searchColumns={["propertyName"]}
				newButtonHref="/admin/rentals/new"
				newButtonTitle="Nouveau local"
				enableExport={true}
				exportFileName="locaux"
				emptyStateContent={emptyState}
			/>

			<RentalDetailsModal
				rental={selectedRental}
				isOpen={isModalOpen}
				onOpenChange={setIsModalOpen}
			/>
		</div>
	);
}
