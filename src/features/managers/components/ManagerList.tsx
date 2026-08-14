"use client";

import { useState } from 'react';
import { UserCog, PlusCircle } from "lucide-react";
import { Manager } from "@/types";
import { DataTable } from '@/components/shared/DataTable/DataTable';
import { DataTableEmptyState } from '@/components/shared/DataTable/DataTableEmptyState';
import { managerColumns } from './manager.columns';
import { ManagerDetailsModal } from './ManagerDetailsModal';

interface ManagerListProps {
	managers: Manager[];
}

export function ManagerList({ managers }: ManagerListProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedManager, setSelectedManager] = useState<Manager | null>(null);

	const handleViewDetails = (manager: Manager) => {
		setSelectedManager(manager);
		setIsModalOpen(true);
	};

	const emptyState = (
		<DataTableEmptyState
			icon={UserCog}
			title="Aucun gestionnaire trouvé"
			description="Commencez par ajouter un nouveau gestionnaire."
			actionHref="/admin/managers/new"
			actionLabel="Ajouter un gestionnaire"
			actionIcon={PlusCircle}
		/>
	);

	return (
		<div className="grid grid-cols-1 gap-4">
			<DataTable
				columns={managerColumns}
				data={managers || []}
				meta={{ viewDetails: handleViewDetails }}
				searchPlaceholder='Rechercher par nom, email'
				searchColumn='name'
				newButtonHref='/admin/managers/new'
				newButtonTitle='Nouveau gestionnaire'
				enableExport={true}
				exportFileName='gestionnaires'
				emptyStateContent={emptyState}
			/>

			<ManagerDetailsModal
				manager={selectedManager}
				isOpen={isModalOpen}
				onOpenChange={setIsModalOpen}
			/>
		</div>
	);
}