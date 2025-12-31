"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser, useUpdateUser } from "@/features/users/hooks/useUsers.hooks";
import { UserUpdateFormData } from "@/features/users/schemas/userSchemas";
import { UserForm } from "@/features/users/components/UserForm";

export default function EditUserPage() {
	const router = useRouter();
	const params = useParams();
	const userId = params.id ? parseInt(params.id as string, 10) : null;

	const { data: user, isLoading: isLoadingUser, isError, error } = useUser(userId as number, Boolean(userId));
	const updateUserMutation = useUpdateUser();

	const handleSubmit = async (data: UserUpdateFormData) => {
		if (!userId) return;
		try {
			await updateUserMutation.mutateAsync({ id: userId, data });
			toast.success("Utilisateur modifié avec succès");
			router.push("/users");
		} catch (error: any) {
			toast.error(error?.response?.data?.message || "Erreur lors de la modification de l'utilisateur");
		}
	};

	if (isLoadingUser) {
		return <div className="flex justify-center items-center h-64"><LoadingSpinner size={32} /></div>;
	}

	if (isError || !user) {
		return (
			<Alert variant="destructive">
				<Terminal className="h-4 w-4" />
				<AlertTitle>Erreur</AlertTitle>
				<AlertDescription>
					Impossible de charger les données de l'utilisateur. {error?.message}
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="h-full flex-col gap-8 p-4 md:flex">
			<div className="flex items-center justify-between gap-2 sm:flex-row sm:items-center sm:gap-0">
				<div className="flex flex-col gap-1">
					<h2 className="text-2xl font-bold tracking-tight">Modifier utilisateur</h2>
				</div>
				<div className="flex items-center gap-2 sm:justify-end">
					<Button variant="outline" asChild>
						<Link href="/users">
							<ArrowLeft />
							Liste des utilisateurs
						</Link>
					</Button>
				</div>
			</div>
			<UserForm
				initialData={user}
				onSubmit={handleSubmit}
				isLoading={updateUserMutation.isPending}
				submitButtonText="Mettre à jour l'utilisateur"
			/>
		</div>
	);
}
