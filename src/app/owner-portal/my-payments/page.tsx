"use client";

import { Terminal } from "lucide-react";

import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Permission, hasPermission } from "@/lib/permissions";

export default function OwnerMyPaymentsPage() {
	const { user } = useAuth();


	return (
		<div className="h-full flex-1 flex-col gap-8 p-4 md:flex">
			<div className="flex items-center justify-between gap-2">
				<div className="flex flex-col gap-1">
					<h2 className="text-2xl font-bold tracking-tight">Mes Paiements Reçus</h2>
					<p className="text-muted-foreground">
						Paiements reçus des locataires
					</p>
				</div>
			</div>
		</div>
	);
}
