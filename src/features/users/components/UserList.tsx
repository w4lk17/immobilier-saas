
"use client";

import { useState } from 'react';
import { Users, PlusCircle } from "lucide-react";
import { User } from "@/types";
import { DataTable } from '@/components/shared/DataTable/DataTable';
import { DataTableEmptyState } from '@/components/shared/DataTable/DataTableEmptyState';
import { userColumns } from './user.columns';
import { UserDetailsModal } from './UserDetailsModal';
import { useUpdateUserStatus } from '../hooks/useUsers.hooks';

interface UserListProps {
	users: User[];
}

export function UserList({ users }: UserListProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);

	// Hook pour gérer le switch Actif/Inactif
	const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateUserStatus();

	const handleViewDetails = (user: User) => {
		setSelectedUser(user);
		setIsModalOpen(true);
	};

	// Fonction passée aux colonnes pour le Switch
	const handleToggleStatus = (userId: number, currentStatus: boolean) => {
		updateStatus({ id: userId, isActive: !currentStatus });
	};

	const emptyState = (
		<DataTableEmptyState
			icon={Users}
			title="Aucun utilisateur trouvé"
			description="Les utilisateurs apparaîtront ici dès qu'ils seront créés via les profils Employés, Propriétaires ou Locataires."
      />
	);

	return (
		<div className='grid grid-cols-1 gap-4'>
			<DataTable
				columns={userColumns}
				data={users || []}
				meta={{
					viewDetails: handleViewDetails,
					toggleStatus: handleToggleStatus,
					isUpdatingStatus: isUpdatingStatus
				 }}
				searchPlaceholder='Rechercher par nom, email'
				searchColumn='name'
				enableExport={true}
				exportFileName='utilisateurs'
				emptyStateContent={emptyState}
			/>

			<UserDetailsModal
				user={selectedUser}
				isOpen={isModalOpen}
				onOpenChange={setIsModalOpen}
			/>
		</div>
	);
}