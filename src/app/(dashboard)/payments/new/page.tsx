"use client";

import { ArrowLeftCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useUsers } from "@/features/users/hooks/useUsers.hooks";
import { Button } from "@/components/ui/button";
import { useProperties } from "@/features/properties/hooks/useProperties.hooks";
import { useCreatePayment } from "@/features/payments/hooks/usePayments.hooks";
import { PaymentFormData, PaymentUpdateFormData } from "@/features/payments/schemas/paymentSchemas";

export default function NewPaymentPage() {
	const router = useRouter();
	const createPaymentMutation = useCreatePayment();
	const { data: users, isLoading: isLoadingUsers } = useUsers(); // Pour la sélection d'utilisateur
	const { data: properties, isLoading: isLoadingProperties } = useProperties(); // Pour la sélection d'utilisateur

	const handleSubmit = async (data: PaymentFormData | PaymentUpdateFormData) => {
		if ('contractId' in data && typeof data.contractId === 'number') {
			// TypeScript sait maintenant que 'data' est PaymentFormData dans ce bloc
			await createPaymentMutation.mutateAsync(data);
			router.push("/payments");
		} else {
			console.error("Structure de données inattendue pour la création d'un paiement:", data);
		}
	};

	return (
		<div className="h-full flex-col gap-8 p-4 md:flex">
			<div className=" flex items-center justify-between gap-2 sm:flex-row sm:items-center sm:gap-0">
				<div className="flex flex-col gap-1">
					<h2 className="text-2xl font-bold tracking-tight">Nouvel Paiement</h2>
				</div>
				<div className="flex items-center gap-2 sm:justify-end">
					<Button variant="secondary" size="sm" asChild>
						<Link href="/payments">
							<ArrowLeftCircle/>
							liste des paiements
						</Link>
					</Button>
					{/* <PresetSelector presets={presets} />
					<PresetSave />
					<div className="hidden space-x-2 md:flex">
						<CodeViewer />
						<PresetShare />
					</div>
					<PresetActions /> */}
				</div>
			</div>
			<PaymentForm
				onSubmit={handleSubmit}
				isLoading={createPaymentMutation.isPending}
				submitButtonText="Créer un paiement"
				usersForSelection={users?.filter(u => u.role !== 'USER') || []} // Exemple de filtre pour ComboBox
				propertiesForSelection={properties || []}
			/>
		</div>
	);
}