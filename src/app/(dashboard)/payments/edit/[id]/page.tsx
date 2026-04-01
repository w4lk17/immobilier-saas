"use client";

import { useParams, useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, Terminal } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { usePayment, useUpdatePayment } from "@/features/payments/hooks/usePayments.hooks";
import { UpdatePaymentFormData } from "@/features/reports/schemas/paymentSchemas";

export default function EditPaymentPage() {
	const router = useRouter();
	const params = useParams();
	const paymentId = params.id ? parseInt(params.id as string, 10) : null;

	const { data: payment, isLoading: isLoadingPayment, isError, error } = usePayment(paymentId);
	const updatePaymentMutation = useUpdatePayment();

	const handleSubmit = async (data: UpdatePaymentFormData) => {
		if (!paymentId) return;
		// Le hook gère déjà le toast et l'invalidation du cache
		await updatePaymentMutation.mutateAsync({ id: paymentId, data });
		router.push("/payments"); // Rediriger vers la liste après mise à jour
	};

	if (isLoadingPayment) {
		return <div className="flex justify-center items-center h-64"><LoadingSpinner size={32} /></div>;
	}

	if (isError || !payment) {
		return (
			<Alert variant="destructive">
				<Terminal className="h-4 w-4" />
				<AlertTitle>Erreur</AlertTitle>
				<AlertDescription>
					Impossible de charger les données du paiement. {error?.message}
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="h-full flex-col gap-8 p-4 md:flex">
			<div className=" flex items-center justify-between gap-2 sm:flex-row sm:items-center sm:gap-0">
				<div className="flex flex-col gap-1">
					<h2 className="text-2xl font-bold tracking-tight">Modifier le paiement</h2>
				</div>
				<div className="flex items-center gap-2 sm:justify-end">
					<Button variant="outline" asChild>
						<Link href="/payments">
							<ArrowLeft />
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
			{/* <PaymentForm
				initialData={payment}
				onSubmit={handleSubmit}
				isLoading={updatePaymentMutation.isPending}
				submitButtonText="Mettre à jour le paiement"
			/> */}
		</div>
	);
}