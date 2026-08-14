"use client";

import { ArrowLeftCircle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { UserForm } from "@/features/users/components/UserForm";

export default function NewUserPage() {
	const createUserMutation = useCreateUser();

	const handleSubmit = async (data: any) => {
		await createUserMutation.mutateAsync(data);
	};

	return (
		<div className="h-full flex-col gap-8 p-4 md:flex">
			<div className="flex items-center justify-between gap-2 sm:flex-row sm:items-center sm:gap-0">
				<div className="flex flex-col gap-1">
					<h2 className="text-2xl font-bold tracking-tight">Nouvel utilisateur</h2>
				</div>
				<div className="flex items-center gap-2 sm:justify-end">
					<Button variant="secondary" size="sm" asChild>
						<Link href="/admin/users">
							<ArrowLeftCircle />
							Liste des utilisateurs
						</Link>
					</Button>
				</div>
			</div>
			<UserForm
				onSubmit={handleSubmit}
				isLoading={createUserMutation.isPending}
			/>
		</div>
	);
}
