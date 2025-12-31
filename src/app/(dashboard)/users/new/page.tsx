"use client";

import { ArrowLeftCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { UserForm } from "@/features/users/components/UserForm";
import { useCreateUser } from "@/features/users/hooks/useUsers.hooks";
import { UserCreateFormData } from "@/features/users/schemas/userSchemas";

export default function NewUserPage() {
	const router = useRouter();
	const createUserMutation = useCreateUser();

	const handleSubmit = async (data: any) => {
		try {
			await createUserMutation.mutateAsync(data);
			toast.success("Utilisateur créé avec succès");
			router.push("/users");
		} catch (error: any) {
			toast.error(error?.response?.data?.message || "Erreur lors de la création de l'utilisateur");
		}
	};

	return (
		<div className="h-full flex-col gap-8 p-4 md:flex">
			<div className="flex items-center justify-between gap-2 sm:flex-row sm:items-center sm:gap-0">
				<div className="flex flex-col gap-1">
					<h2 className="text-2xl font-bold tracking-tight">Nouvel utilisateur</h2>
				</div>
				<div className="flex items-center gap-2 sm:justify-end">
					<Button variant="secondary" size="sm" asChild>
						<Link href="/users">
							<ArrowLeftCircle />
							Liste des utilisateurs
						</Link>
					</Button>
				</div>
			</div>
			<UserForm
				onSubmit={handleSubmit}
				isLoading={createUserMutation.isPending}
				submitButtonText="Créer l'utilisateur"
			/>
		</div>
	);
}
