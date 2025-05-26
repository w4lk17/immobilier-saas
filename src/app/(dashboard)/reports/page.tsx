"use client";

import { PaymentList } from "@/features/payments/components/PaymentList";
import { usePayments } from "@/features/payments/hooks/usePayments.hooks";

export default function ReportsPage() {
	const { data: payments, isLoading, isError, error } = usePayments();

	if (isLoading) {
		// Afficher des Skeletons pendant le chargement
		return (
				<div className="flex justify-center items-center">
					Loading...
				</div>
		);
	}

	if (isError) {
		return <p className="text-destructive">Erreur de chargement: {error?.message || 'Inconnue'}</p>;
	}

	return (
		<div className="">
			{/* Breadcrumb */}
			<div>Breadcrumb</div>
			{/* Container */}
			<div className="flex flex-col xl:flex-row gap-4 p-4">
				
					<div className="bg-primary-foreground p-4 rounded-lg">
						<div className="flex items-center justify-between mb-2">
							<h2 className="text-lg font-medium">Historique des paiements</h2>
						</div>
						{/*Composant d'affichage */}
						<PaymentList payments={payments || []} />
					</div>
			</div>
		</div>

	)
}