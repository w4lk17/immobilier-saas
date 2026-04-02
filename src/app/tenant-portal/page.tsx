"use client";

import {
	Check,
	Home,
	Calendar,
	Wallet,
	FileText,
	ClipboardCheck,
	AlertCircle,
	ArrowUpRight,
	Clock,
	Building2,
	MapPin,
	User,
	Phone,
	Download,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

// Mock data
const tenantStats = {
	monthlyRent: 18000,
	amountPaid: 162000,
	daysRemaining: 5,
	paymentStatus: "pending",
};

const currentHousing = {
	title: "Appartement FST",
	address: "Rue de l'Université, Fès, Maroc",
	features: {
		bedrooms: 2,
		bathrooms: 1,
		area: 80,
		floor: 2,
	},
	owner: {
		name: "M. Ahmed Alami",
		phone: "+212 5 35 00 00 00",
	},
	leaseStart: "2025-01-01",
	leaseEnd: "2026-12-31",
};

const recentPayments = [
	{ id: 1, month: "Janvier 2026", amount: 18000, date: "2026-01-05", status: "paid" },
	{ id: 2, month: "Décembre 2025", amount: 18000, date: "2025-12-05", status: "paid" },
	{ id: 3, month: "Novembre 2025", amount: 18000, date: "2025-11-05", status: "paid" },
];

const upcomingPayment = {
	month: "Février 2026",
	amount: 18000,
	dueDate: "2026-02-28",
	daysRemaining: 5,
};

const maintenanceRequests = {
	total: 1,
	pending: 1,
	inProgress: 0,
	completed: 1,
};

const documents = {
	contract: 1,
	receipts: 5,
	insurance: 0,
};

export default function TenantDashboardPage() {
	return (
		<div className="space-y-6 p-4">
			{/* Header */}
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Tableau de Bord</h1>
					<p className="text-muted-foreground">
						Bienvenue dans votre espace locataire
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Badge variant="outline" className="gap-1">
						<Home className="h-3 w-3" />
						Locataire
					</Badge>
				</div>
			</div>

			{/* Stats Overview Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{/* Monthly Rent */}
				<Card className="overflow-hidden">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Loyer du Mois</CardTitle>
						<Wallet className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{tenantStats.monthlyRent.toLocaleString('fr-FR')} F CFA</div>
						<p className="text-xs text-muted-foreground mt-1">
							À payer ce mois-ci
						</p>
						<div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
							<div className="h-full bg-yellow-500 rounded-full" style={{ width: "20%" }}></div>
						</div>
					</CardContent>
				</Card>

				{/* Total Paid */}
				<Card className="overflow-hidden">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Payé</CardTitle>
						<Check className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{tenantStats.amountPaid.toLocaleString('fr-FR')} F CFA</div>
						<p className="text-xs text-muted-foreground">
							<span className="text-green-600 font-medium flex items-center gap-1">
								<ArrowUpRight className="h-3 w-3" />
								9 mois
							</span>{" "}
							cette année
						</p>
					</CardContent>
				</Card>

				{/* Days Remaining */}
				<Card className="overflow-hidden">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Jours Restants</CardTitle>
						<Calendar className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{tenantStats.daysRemaining}</div>
						<p className="text-xs text-muted-foreground">
							Avant la date limite
						</p>
						{tenantStats.daysRemaining <= 5 ? (
							<Badge variant="outline" className="mt-2 border-yellow-500 text-yellow-600">
								<Clock className="h-3 w-3 mr-1" />
								Urgent
							</Badge>
						) : (
							<Badge variant="outline" className="mt-2 border-green-500 text-green-600">
								<Check className="h-3 w-3 mr-1" />
								À temps
							</Badge>
						)}
					</CardContent>
				</Card>

				{/* Contract Status */}
				<Card className="overflow-hidden">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Contrat</CardTitle>
						<FileText className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">Actif</div>
						<p className="text-xs text-muted-foreground mt-1">
							Jusqu'au {new Date(currentHousing.leaseEnd).toLocaleDateString('fr-FR')}
						</p>
						<Button variant="ghost" size="sm" className="mt-2 w-full justify-start px-0 h-6" asChild>
							<Link href="/tenant-portal/my-contracts">
								Voir le contrat →
							</Link>
						</Button>
					</CardContent>
				</Card>
			</div>

			{/* Housing Info & Quick Actions */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{/* Current Housing */}
				<Card className="col-span-2">
					<CardHeader>
						<div className="flex items-center justify-between">
							<div>
								<CardTitle>Mon Logement</CardTitle>
								<CardDescription>Informations sur votre location actuelle</CardDescription>
							</div>
							<Building2 className="h-8 w-8 text-blue-600" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="flex items-start gap-4">
								<div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
									<Home className="h-6 w-6 text-blue-600" />
								</div>
								<div className="flex-1">
									<h3 className="text-lg font-semibold">{currentHousing.title}</h3>
									<p className="text-sm text-muted-foreground flex items-center gap-1">
										<MapPin className="h-3 w-3" />
										{currentHousing.address}
									</p>
								</div>
							</div>

							<Separator />

							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								<div className="text-center p-3 bg-gray-50 rounded-lg">
									<div className="text-2xl font-bold text-blue-600">{currentHousing.features.bedrooms}</div>
									<div className="text-xs text-muted-foreground">Chambres</div>
								</div>
								<div className="text-center p-3 bg-gray-50 rounded-lg">
									<div className="text-2xl font-bold text-blue-600">{currentHousing.features.bathrooms}</div>
									<div className="text-xs text-muted-foreground">Salle de bain</div>
								</div>
								<div className="text-center p-3 bg-gray-50 rounded-lg">
									<div className="text-2xl font-bold text-blue-600">{currentHousing.features.area}</div>
									<div className="text-xs text-muted-foreground">m²</div>
								</div>
								<div className="text-center p-3 bg-gray-50 rounded-lg">
									<div className="text-2xl font-bold text-blue-600">{currentHousing.features.floor}</div>
									<div className="text-xs text-muted-foreground">Étage</div>
								</div>
							</div>

							<Separator />

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
										<User className="h-5 w-5 text-green-600" />
									</div>
									<div>
										<p className="text-sm font-medium">Propriétaire</p>
										<p className="text-xs text-muted-foreground">{currentHousing.owner.name}</p>
									</div>
								</div>
								<Button variant="outline" size="sm" className="gap-2">
									<Phone className="h-4 w-4" />
									Contacter
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Quick Actions */}
				<Card>
					<CardHeader>
						<CardTitle>Actions Rapides</CardTitle>
						<CardDescription>Tâches courantes</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2">
						<Button variant="outline" size="sm" className="w-full justify-start" asChild>
							<Link href="/tenant-portal/my-payments">
								<Wallet className="mr-2 h-4 w-4" />
								Payer le loyer
							</Link>
						</Button>
						<Button variant="outline" size="sm" className="w-full justify-start" asChild>
							<Link href="/tenant-portal/maintenance">
								<ClipboardCheck className="mr-2 h-4 w-4" />
								Nouvelle demande
							</Link>
						</Button>
						<Button variant="outline" size="sm" className="w-full justify-start" asChild>
							<Link href="/tenant-portal/my-contracts">
								<FileText className="mr-2 h-4 w-4" />
								Voir mon contrat
							</Link>
						</Button>
						<Button variant="outline" size="sm" className="w-full justify-start" asChild>
							<Link href="/tenant-portal/documents">
								<Download className="mr-2 h-4 w-4" />
								Mes documents
							</Link>
						</Button>
						<Button variant="outline" size="sm" className="w-full justify-start" asChild>
							<Link href="/tenant-portal/messages">
								<AlertCircle className="mr-2 h-4 w-4" />
								Contacter le propriétaire
							</Link>
						</Button>
					</CardContent>
				</Card>
			</div>

			{/* Payment History & Upcoming */}
			<div className="grid gap-4 md:grid-cols-2">
				{/* Upcoming Payment */}
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<div>
								<CardTitle>Prochain Paiement</CardTitle>
								<CardDescription>{upcomingPayment.month}</CardDescription>
							</div>
							<div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full">
								<Clock className="h-6 w-6 text-yellow-600" />
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold mb-2">
							{upcomingPayment.amount.toLocaleString('fr-FR')} F CFA
						</div>
						<p className="text-sm text-muted-foreground mb-4">
							Date limite: {new Date(upcomingPayment.dueDate).toLocaleDateString('fr-FR')}
						</p>

						<div className="mb-4">
							<div className="flex items-center justify-between text-sm mb-2">
								<span>Temps restant</span>
								<span className="font-semibold">{upcomingPayment.daysRemaining} jours</span>
							</div>
							<div className="h-2 bg-gray-100 rounded-full overflow-hidden">
								<div
									className="h-full bg-yellow-500 rounded-full transition-all"
									style={{ width: `${((30 - upcomingPayment.daysRemaining) / 30) * 100}%` }}
								></div>
							</div>
						</div>

						<Button className="w-full" asChild>
							<Link href="/tenant-portal/my-payments">
								<Wallet className="mr-2 h-4 w-4" />
								Payer maintenant
							</Link>
						</Button>
					</CardContent>
				</Card>

				{/* Recent Payments */}
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<div>
								<CardTitle>Historique des Paiements</CardTitle>
								<CardDescription>Derniers 3 mois</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{recentPayments.map((payment) => (
								<div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
									<div className="flex items-center gap-3">
										<div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
											<Check className="h-4 w-4 text-green-600" />
										</div>
										<div>
											<p className="text-sm font-medium">{payment.month}</p>
											<p className="text-xs text-muted-foreground">
												{new Date(payment.date).toLocaleDateString('fr-FR')}
											</p>
										</div>
									</div>
									<div className="text-right">
										<p className="text-sm font-semibold text-green-600">
											{payment.amount.toLocaleString('fr-FR')} F CFA
										</p>
										<Badge variant="outline" className="text-xs border-green-500 text-green-600">
											Payé
										</Badge>
									</div>
								</div>
							))}
						</div>
						<Button variant="outline" size="sm" className="w-full mt-4" asChild>
							<Link href="/tenant-portal/my-payments">
								Voir tout l'historique →
							</Link>
						</Button>
					</CardContent>
				</Card>
			</div>

			{/* Summary Cards */}
			<div className="grid gap-4 md:grid-cols-3">
				{/* Maintenance Summary */}
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Demandes de Maintenance</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-center justify-between">
							<div className="space-y-1">
								<p className="text-2xl font-bold">{maintenanceRequests.total}</p>
								<p className="text-xs text-muted-foreground">Total des demandes</p>
							</div>
							<div className="text-right space-y-1">
								<div className="flex items-center gap-2 justify-end">
									<span className="text-xs text-muted-foreground">En attente:</span>
									<Badge variant="outline" className="text-xs border-yellow-500 text-yellow-600">
										{maintenanceRequests.pending}
									</Badge>
								</div>
								<div className="flex items-center gap-2 justify-end">
									<span className="text-xs text-muted-foreground">Terminées:</span>
									<Badge variant="outline" className="text-xs border-green-500 text-green-600">
										{maintenanceRequests.completed}
									</Badge>
								</div>
							</div>
						</div>
						<Button variant="ghost" size="sm" className="mt-3 w-full justify-start px-0 h-6" asChild>
							<Link href="/tenant-portal/maintenance">
								Gérer mes demandes →
							</Link>
						</Button>
					</CardContent>
				</Card>

				{/* Documents Summary */}
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Mes Documents</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<span className="text-sm">Contrat</span>
								<Badge variant="secondary">{documents.contract}</Badge>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm">Quittances</span>
								<Badge variant="secondary">{documents.receipts}</Badge>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm">Assurance</span>
								<Badge variant="secondary">{documents.insurance}</Badge>
							</div>
						</div>
						<Button variant="ghost" size="sm" className="mt-3 w-full justify-start px-0 h-6" asChild>
							<Link href="/tenant-portal/documents">
								Voir tous les documents →
							</Link>
						</Button>
					</CardContent>
				</Card>

				{/* Messages Summary */}
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Messages</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-center gap-3 mb-3">
							<div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
								<AlertCircle className="h-5 w-5 text-blue-600" />
							</div>
							<div>
								<p className="text-2xl font-bold">0</p>
								<p className="text-xs text-muted-foreground">Messages non lus</p>
							</div>
						</div>
						<Button variant="outline" size="sm" className="w-full" asChild>
							<Link href="/tenant-portal/messages">
								Accéder à la messagerie
							</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
