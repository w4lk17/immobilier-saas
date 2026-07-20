"use client";

import { type ElementType, useMemo, useState } from "react";
import {
	Building2,
	CalendarDays,
	Download,
	Eye,
	FileText,
	Home,
	Terminal,
	User,
	Wallet,
} from "lucide-react";

import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ContractDetailsModal } from "@/features/contracts/components/ContractDetailsModal";
import { useContractsWithRelations } from "@/features/contracts/hooks/useContracts.hooks";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Permission, hasPermission } from "@/lib/permissions";
import type { ContractWithRelations } from "@/types";
import { ContractStatus } from "@/types/enums";

const statusLabels: Record<ContractStatus, string> = {
	[ContractStatus.ACTIVE]: "Actif",
	[ContractStatus.PENDING]: "En attente",
	[ContractStatus.EXPIRED]: "Expiré",
	[ContractStatus.TERMINATED]: "Terminé",
};

const statusClasses: Record<ContractStatus, string> = {
	[ContractStatus.ACTIVE]: "border-green-500 text-green-700 bg-green-50",
	[ContractStatus.PENDING]: "border-yellow-500 text-yellow-700 bg-yellow-50",
	[ContractStatus.EXPIRED]: "border-orange-500 text-orange-700 bg-orange-50",
	[ContractStatus.TERMINATED]: "border-red-500 text-red-700 bg-red-50",
};

function formatDate(date?: Date | string | null) {
	if (!date) return "Non definie";

	const parsedDate = new Date(date);
	if (Number.isNaN(parsedDate.getTime())) return "Non renseigné";

	return parsedDate.toLocaleDateString("fr-FR", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});
}

function formatCurrency(amount?: number | null) {
	if (amount === null || typeof amount === "undefined") return "Non renseigné";

	return `${amount.toLocaleString("fr-FR")} F CFA`;
}

function getOwnerName(contract: ContractWithRelations) {
	const firstName = contract.owner?.user?.firstName ?? "";
	const lastName = contract.owner?.user?.lastName ?? "";
	return `${firstName} ${lastName}`.trim() || "Propriétaire non renseigné";
}

function getContractHousing(contract: ContractWithRelations) {
	return contract.designation || contract.rental?.name || "Logement";
}

function getContractAddress(contract: ContractWithRelations) {
	return contract.address || contract.property?.address || "Adresse non renseignée";
}

function getContractTimestamp(contract: ContractWithRelations) {
	const startDate = new Date(contract.startDate ?? 0).getTime();
	const updatedAt = new Date(contract.updatedAt ?? 0).getTime();

	return Math.max(
		Number.isNaN(startDate) ? 0 : startDate,
		Number.isNaN(updatedAt) ? 0 : updatedAt,
	);
}

function getStatusPriority(status: ContractStatus) {
	if (status === ContractStatus.ACTIVE) return 0;
	if (status === ContractStatus.PENDING) return 1;
	return 2;
}

function sortContractsForTenant(contracts: ContractWithRelations[]) {
	return [...contracts].sort((first, second) => {
		const statusDiff =
			getStatusPriority(first.status) - getStatusPriority(second.status);

		if (statusDiff !== 0) return statusDiff;

		return getContractTimestamp(second) - getContractTimestamp(first);
	});
}

function ContractStatusBadge({ status }: { status: ContractStatus }) {
	return (
		<Badge variant="default" className={statusClasses[status]}>
			{statusLabels[status] ?? status}
		</Badge>
	);
}

function InfoItem({
	icon: Icon,
	label,
	value,
}: {
	icon: ElementType;
	label: string;
	value: string;
}) {
	return (
		<div className="flex min-w-0 items-start gap-3 rounded-md border bg-muted/20 p-3">
			<Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
			<div className="min-w-0">
				<p className="text-xs text-muted-foreground">{label}</p>
				<p className="break-words text-sm font-medium">{value}</p>
			</div>
		</div>
	);
}

export default function TenantMyContractsPage() {
	const { data: contracts, isLoading, isError, error } = useContractsWithRelations();
	const { user } = useAuth();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedContract, setSelectedContract] =
		useState<ContractWithRelations | null>(null);

	const canRead = user && hasPermission(user.role, Permission.CONTRACTS_READ);
	const sortedContracts = useMemo(
		() => sortContractsForTenant(contracts || []),
		[contracts],
	);
	const mainContract = sortedContracts[0] ?? null;
	const contractHistory = mainContract
		? sortedContracts.filter((contract) => contract.id !== mainContract.id)
		: [];

	const openContractDetails = (contract: ContractWithRelations) => {
		setSelectedContract(contract);
		setIsModalOpen(true);
	};

	if (!canRead) {
		return (
			<Alert variant="destructive" className="max-w-2xl mx-auto">
				<Terminal className="h-4 w-4" />
				<AlertTitle>Accès refusé</AlertTitle>
				<AlertDescription>
					Vous n&apos;avez pas la permission d&apos;accéder à cette page.
				</AlertDescription>
			</Alert>
		);
	}

	if (isLoading) {
		return (
			<div className="flex h-64 items-center justify-center">
				<LoadingSpinner size={32} />
			</div>
		);
	}

	if (isError) {
		return (
			<Alert variant="destructive" className="max-w-2xl mx-auto">
				<Terminal className="h-4 w-4" />
				<AlertTitle>Erreur de chargement</AlertTitle>
				<AlertDescription>
					Impossible de charger vos contrats: {error?.message}
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="space-y-6 p-4">
			<PageHeader
				title="Mes contrats"
				description="Consultez votre bail actif et l'historique de vos contrats."
			/>

			{!mainContract ? (
				<Card>
					<CardContent className="flex flex-col items-center justify-center gap-3 py-12 text-center">
						<div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
							<FileText className="h-6 w-6 text-muted-foreground" />
						</div>
						<div>
							<h3 className="text-base font-semibold">Aucun contrat trouvé</h3>
							<p className="mt-1 max-w-md text-sm text-muted-foreground">
								Aucun contrat de bail n&apos;est encore associé à votre espace locataire.
							</p>
						</div>
					</CardContent>
				</Card>
			) : (
				<>
					<Card className="overflow-hidden">
						<CardHeader className="gap-4 sm:flex-row sm:items-start sm:justify-between">
							<div className="min-w-0 space-y-2">
								<div className="flex flex-wrap items-center gap-2">
									<CardTitle className="text-xl">Contrat </CardTitle>
									<ContractStatusBadge status={mainContract.status} />
								</div>
								<CardDescription className="break-words">
									Référence {mainContract.reference || "non renseignée"}
								</CardDescription>
							</div>
							<div className="flex flex-col gap-2 sm:flex-row">
								<Button
									variant="outline"
									onClick={() => openContractDetails(mainContract)}
								>
									<Eye className="h-4 w-4" />
									Voir les détails
								</Button>
								<Button disabled>
									<Download className="h-4 w-4" />
									Télécharger
								</Button>			
							</div>
						</CardHeader>
						<CardContent className="space-y-5">
							<div className="flex min-w-0 items-start gap-4">
								<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary/10">
									<Home className="h-5 w-5 text-primary" />
								</div>
								<div className="min-w-0">
									<h3 className="break-words text-lg font-semibold">
										{getContractHousing(mainContract)}
									</h3>
									<p className="break-words text-sm text-muted-foreground">
										{getContractAddress(mainContract)}
									</p>
								</div>
							</div>

							<Separator />

							<div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
								<InfoItem
									icon={User}
									label="Propriétaire"
									value={getOwnerName(mainContract)}
								/>
								<InfoItem
									icon={CalendarDays}
									label="Date de début"
									value={formatDate(mainContract.startDate)}
								/>
								<InfoItem
									icon={CalendarDays}
									label="Date de fin"
									value={formatDate(mainContract.endDate)}
								/>
								<InfoItem
									icon={Wallet}
									label="Loyer mensuel"
									value={formatCurrency(mainContract.rentAmount)}
								/>
								<InfoItem
									icon={Wallet}
									label="Charges"
									value={formatCurrency(mainContract.chargesAmount)}
								/>
								<InfoItem
									icon={Wallet}
									label="Caution et avance"
									value={formatCurrency(
										Number(mainContract.depositAmount ?? 0) +
										Number(mainContract.advanceAmount ?? 0),
									)}
								/>
							</div>
						</CardContent>
					</Card>

					{contractHistory.length > 0 && (
						<section className="space-y-3">
							<div>
								<h2 className="text-lg font-semibold">Historique des contrats</h2>
								<p className="text-sm text-muted-foreground">
									Vos anciens contrats et autres baux associés à votre compte.
								</p>
							</div>
							<div className="grid gap-3">
								{contractHistory.map((contract) => (
									<Card key={contract.id}>
										<CardContent className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
											<div className="flex min-w-0 items-start gap-3">
												<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted">
													<Building2 className="h-5 w-5 text-muted-foreground" />
												</div>
												<div className="min-w-0 space-y-1">
													<div className="flex flex-wrap items-center gap-2">
														<p className="break-words text-sm font-semibold">
															{getContractHousing(contract)}
														</p>
														<ContractStatusBadge status={contract.status} />
													</div>
													<p className="break-words text-xs text-muted-foreground">
														{formatDate(contract.startDate)} - {formatDate(contract.endDate)}
													</p>
													<p className="break-words text-xs text-muted-foreground">
														{getContractAddress(contract)}
													</p>
												</div>
											</div>
											<div className="flex flex-col gap-2 md:items-end">
												<p className="text-sm font-semibold">
													{formatCurrency(contract.rentAmount)}
												</p>
												<Button
													variant="outline"
													size="sm"
													onClick={() => openContractDetails(contract)}
												>
													<Eye className="h-4 w-4" />
													Détails
												</Button>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</section>
					)}
				</>
			)}

			<ContractDetailsModal
				contract={selectedContract}
				isOpen={isModalOpen}
				onOpenChange={setIsModalOpen}
			/>
		</div>
	);
}
