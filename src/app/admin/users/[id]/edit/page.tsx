"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserUpdateFormData } from "@/features/users/schemas/userSchemas";
import { UserForm } from "@/features/users/components/UserForm";
import { useUpdateUser, useUser } from "@/features/users/hooks/useUsers.hooks";

export default function EditUserPage() {
	const params = useParams();
	// On parse l'ID une seule fois et on vérifie sa validité
	const userId = params.id ? parseInt(params.id as string, 10) : null;

	// Le hook ne s'active que si userId est valide (non null)
	const { data: user, isLoading: isLoadingUser, isError, error } = useUser(userId!, Boolean(userId));
	const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser();

	const handleSubmit = async (data: UserUpdateFormData) => {
		if (!userId) return;

		try {
			await updateUser({ id: userId, data });
		} catch (err) {
			console.error("Submission failed", err);
		}
	};

	if (isLoadingUser || !userId) {
		return (
			<div className="flex justify-center items-center h-64">
				<LoadingSpinner size={32} />
			</div>
		);
	}

	
	if (isError || !user) {
		return (
			<div className="p-4">
				<Alert variant="destructive">
					<Terminal className="h-4 w-4" />
					<AlertTitle>Erreur</AlertTitle>
					<AlertDescription>
						Impossible de charger les données de l'utilisateur.
						<span className="text-xs block mt-1">{error?.message}</span>
					</AlertDescription>
				</Alert>
			</div>
		);
	}


	return (
		<div className="space-y-6 p-4">
			<PageHeader
				title="Modifier l'utilisateur"
				description="Modifiez les informations de base de ce compte. Le rôle et le mot de passe se gèrent ailleurs."
				actions={
					<Button variant="outline" asChild>
						<Link href="/admin/users">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Liste des utilisateurs
						</Link>
					</Button>
				}
			/>

			<UserForm
				initialData={user}
				onSubmit={handleSubmit}
				isLoading={isUpdating}
			/>
		</div>
	);
}