
"use client";

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { CreditCard, PlusCircle } from "lucide-react";
import { PaymentWithRelations } from "@/types";
import { DataTable } from '@/components/shared/DataTable';
import { paymentColumns } from './payment.columns';

interface PaymentListProps {
	payments: PaymentWithRelations[];
}

export function PaymentList({ payments }: PaymentListProps) {
	const emptyState = (
		<div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
			<CreditCard className="h-12 w-12 text-muted-foreground" />
			<h3 className="text-xl font-semibold">Aucun paiement trouvé</h3>
			<p className="text-muted-foreground">Commencez par enregistrer un nouveau paiement.</p>
			<Button asChild>
				<Link href="/payments/new"> {/* Assurez-vous que cette route existe */}
					<PlusCircle className="mr-2 h-4 w-4" /> Enregistrer un paiement
				</Link>
			</Button>
		</div>
	);

	return (
		<DataTable
			columns={paymentColumns}
			data={payments || []}
			emptyStateContent={emptyState}
		/>
	);
}