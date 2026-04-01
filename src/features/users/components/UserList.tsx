
"use client";

import { useState } from 'react';
import Link from 'next/link';

import { Button } from "@/components/ui/button";
import { Users, PlusCircle } from "lucide-react";
import { FrontendUser } from "@/types";
import { DataTable } from '@/components/shared/DataTable/DataTable';
import { userColumns } from './user.columns';
import { UserDetailsModal } from './UserDetailsModal';

interface UserListProps {
	users: FrontendUser[];
}

export function UserList({ users }: UserListProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState<FrontendUser | null>(null);

	const handleViewDetails = (user: FrontendUser) => {
		setSelectedUser(user);
		setIsModalOpen(true);
	};

	const emptyState = (
		<div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
			<Users className="h-12 w-12 text-muted-foreground" />
			<h3 className="text-xl font-semibold">Aucun utilisateur trouvé</h3>
			<p className="text-muted-foreground">Commencez par ajouter un nouvel utilisateur.</p>
			<Button asChild>
				<Link href="/users/new">
					<PlusCircle className="mr-2 h-4 w-4" /> Ajouter un utilisateur
				</Link>
			</Button>
		</div>
	);

	return (
		<div className='grid grid-cols-1 gap-4'>
			<DataTable
				columns={userColumns}
				data={users || []}
				meta={{ viewDetails: handleViewDetails }}
				searchColumn={'email'}
				searchPlaceholder={'Rechercher par email...'}
				newButtonHref={'/users/new'}
				newButtonTitle={'Nouvel utilisateur'}
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