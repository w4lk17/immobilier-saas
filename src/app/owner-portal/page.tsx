"use client";

import {
	Building2,
	TrendingUp,
	Users,
	Wallet,
	Key,
	ArrowUpRight,
	FileText,
	Check,
	Clock,
	AlertCircle,
	Home,
	PiggyBank,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// Mock data
const ownerStats = {
	monthlyRevenue: 90000,
	annualRevenue: 1080000,
	occupancyRate: 95,
	totalProperties: 5,
	activeTenants: 5,
	activeContracts: 5,
	roi: 8.5,
};

const myProperties = [
	{
		id: 1,
		name: "Appartement FST",
		address: "Rue de l'Université, Fès",
		monthlyIncome: 18000,
		status: "occupied",
		tenant: "Mohammed Benali",
		contractEnd: "2026-12-31",
	},
	{
		id: 2,
		name: "Villa Medina",
		address: "Avenue Mohammed V, Fès",
		monthlyIncome: 25000,
		status: "occupied",
		tenant: "Sara Alami",
		contractEnd: "2026-08-31",
	},
	{
		id: 3,
		name: "Bureau Centre",
		address: "Boulevard Hassan II, Fès",
		monthlyIncome: 12000,
		status: "vacant",
		tenant: null,
		contractEnd: null,
	},
	{
		id: 4,
		name: "Studio Ville Nouvelle",
		address: "Quartier Ville Nouvelle, Fès",
		monthlyIncome: 15000,
		status: "occupied",
		tenant: "Youssef Idrissi",
		contractEnd: "2026-06-30",
	},
	{
		id: 5,
		name: "Duplex Atlas",
		address: "Riyad Atlas, Fès",
		monthlyIncome: 20000,
		status: "maintenance",
		tenant: "Fatima Zahra",
		contractEnd: "2026-10-31",
	},
];

const recentPayments = [
	{ id: 1, property: "Appartement FST", tenant: "Mohammed Benali", amount: 18000, date: "2026-02-05", status: "paid" },
	{ id: 2, property: "Villa Medina", tenant: "Sara Alami", amount: 25000, date: "2026-02-03", status: "paid" },
	{ id: 3, property: "Studio Ville Nouvelle", tenant: "Youssef Idrissi", amount: 15000, date: "2026-02-01", status: "pending" },
];

const upcomingExpenses = [
	{ id: 1, property: "Appartement FST", type: "Maintenance plomberie", amount: 2500, date: "2026-02-28" },
	{ id: 2, property: "Villa Medina", type: "Nettoyage vitres", amount: 800, date: "2026-03-01" },
];

export default function OwnerDashboardPage() {
	return (
		<div className="space-y-6 p-4">
			{/* Header */}
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Tableau de Bord Propriétaire</h1>
					<p className="text-muted-foreground">
						Vue d&apos;ensemble de vos biens et revenus
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Badge variant="outline" className="gap-1">
						<Key className="h-3 w-3" />
						Propriétaire
					</Badge>
				</div>
			</div>

			{/* Stats Overview Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{/* Monthly Revenue */}
				<Card className="overflow-hidden">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Revenus du Mois</CardTitle>
						<Wallet className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{ownerStats.monthlyRevenue.toLocaleString('fr-FR')} F CFA</div>
						<p className="text-xs text-muted-foreground mt-1">
							<span className="text-green-600 font-medium flex items-center gap-1">
								<ArrowUpRight className="h-3 w-3" />
								+12%
							</span>{" "}
							ce mois
						</p>
					</CardContent>
				</Card>

				{/* Annual Revenue */}
				<Card className="overflow-hidden">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Revenus Annuels</CardTitle>
						<PiggyBank className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{(ownerStats.annualRevenue).toLocaleString('fr-FR')} F CFA</div>
						<p className="text-xs text-muted-foreground mt-1">
							Cette année
						</p>
						<div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
							<div className="h-full bg-green-600 rounded-full" style={{ width: "75%" }}></div>
						</div>
					</CardContent>
				</Card>

				{/* Occupancy Rate */}
				<Card className="overflow-hidden">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Taux d'Occupation</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{ownerStats.occupancyRate}%</div>
						<p className="text-xs text-muted-foreground mt-1">
							{ownerStats.totalProperties} / {ownerStats.totalProperties} biens occupés
						</p>
						<div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
							<div className="h-full bg-blue-600 rounded-full" style={{ width: `${ownerStats.occupancyRate}%` }}></div>
						</div>
					</CardContent>
				</Card>

				{/* ROI */}
				<Card className="overflow-hidden">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Rendement</CardTitle>
						<Wallet className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{ownerStats.roi}%</div>
						<p className="text-xs text-muted-foreground mt-1">
							Rentabilité annuelle
						</p>
						<Badge variant="outline" className="mt-2 border-green-500 text-green-600">
							Excellent
						</Badge>
					</CardContent>
				</Card>
			</div>

			{/* My Properties Summary */}
			<div className="grid gap-4 md:grid-cols-2">
				{/* Properties Overview */}
				<Card className="col-span-1">
					<CardHeader>
						<div className="flex items-center justify-between">
							<div>
								<CardTitle>Mes Biens</CardTitle>
								<CardDescription>Vos propriétés immobilières</CardDescription>
							</div>
							<Button variant="outline" size="sm" asChild>
								<Link href="/owner-portal/my-properties">
									Voir tout →
								</Link>
							</Button>
						</div>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{myProperties.map((property) => (
								<div key={property.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
									<div className="flex items-center gap-3">
										<div className={`flex items-center justify-center w-10 h-10 rounded-full ${
											property.status === 'occupied' ? 'bg-green-100' :
											property.status === 'vacant' ? 'bg-red-100' :
											'bg-yellow-100'
										}`}>
											<Home className={`h-5 w-5 ${
												property.status === 'occupied' ? 'text-green-600' :
												property.status === 'vacant' ? 'text-red-600' :
												'text-yellow-600'
											}`} />
										</div>
										<div>
											<p className="text-sm font-medium">{property.name}</p>
											<p className="text-xs text-muted-foreground">{property.address}</p>
										</div>
									</div>
									<div className="text-right">
										<p className="text-sm font-semibold text-green-600">
											{property.monthlyIncome.toLocaleString('fr-FR')} F CFA
										</p>
										<Badge variant="outline" className={`text-xs mt-1 ${
											property.status === 'occupied' ? 'border-green-500 text-green-600' :
											property.status === 'vacant' ? 'border-red-500 text-red-600' :
											'border-yellow-500 text-yellow-600'
										}`}>
											{property.status === 'occupied' ? 'Occupé' :
											 property.status === 'vacant' ? 'Vacant' :
												'Maintenance'}
										</Badge>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Quick Stats */}
				<div className="space-y-4">
					{/* Tenants */}
					<Card>
						<CardHeader className="pb-3">
							<div className="flex items-center justify-between">
								<CardTitle className="text-base">Locataires</CardTitle>
								<Users className="h-4 w-4 text-muted-foreground" />
							</div>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{ownerStats.activeTenants}</div>
							<p className="text-xs text-muted-foreground">Locataires actifs</p>
						</CardContent>
					</Card>

					{/* Contracts */}
					<Card>
						<CardHeader className="pb-3">
							<div className="flex items-center justify-between">
								<CardTitle className="text-base">Contrats</CardTitle>
								<FileText className="h-4 w-4 text-muted-foreground" />
							</div>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{ownerStats.activeContracts}</div>
							<p className="text-xs text-muted-foreground">Contrats actifs</p>
							<Button variant="ghost" size="sm" className="mt-2 w-full justify-start px-0 h-6" asChild>
								<Link href="/owner-portal/my-contracts">
									Gérer les contrats →
								</Link>
							</Button>
						</CardContent>
					</Card>

					{/* Total Properties */}
					<Card>
						<CardHeader className="pb-3">
							<div className="flex items-center justify-between">
								<CardTitle className="text-base">Total Biens</CardTitle>
								<Building2 className="h-4 w-4 text-muted-foreground" />
							</div>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{ownerStats.totalProperties}</div>
							<p className="text-xs text-muted-foreground">Dans votre portefeuille</p>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Recent Payments & Upcoming Expenses */}
			<div className="grid gap-4 md:grid-cols-2">
				{/* Recent Payments */}
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<div>
								<CardTitle>Paiements Récents</CardTitle>
								<CardDescription>Derniers loyers reçus</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{recentPayments.map((payment) => (
								<div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
									<div className="flex items-center gap-3">
										<div className={`flex items-center justify-center w-8 h-8 rounded-full ${
											payment.status === 'paid' ? 'bg-green-100' : 'bg-yellow-100'
										}`}>
											{payment.status === 'paid' ? (
												<Check className="h-4 w-4 text-green-600" />
											) : (
												<Clock className="h-4 w-4 text-yellow-600" />
											)}
										</div>
										<div>
											<p className="text-sm font-medium">{payment.property}</p>
											<p className="text-xs text-muted-foreground">{payment.tenant}</p>
										</div>
									</div>
									<div className="text-right">
										<p className="text-sm font-semibold text-green-600">
											{payment.amount.toLocaleString('fr-FR')} F CFA
										</p>
										<p className="text-xs text-muted-foreground">
											{new Date(payment.date).toLocaleDateString('fr-FR')}
										</p>
									</div>
								</div>
							))}
						</div>
						<Button variant="outline" size="sm" className="w-full mt-4" asChild>
							<Link href="/owner-portal/my-payments">
								Voir tout l'historique →
							</Link>
						</Button>
					</CardContent>
				</Card>

				{/* Upcoming Expenses */}
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<div>
								<CardTitle>Dépenses à Venir</CardTitle>
								<CardDescription>Dépenses prévues</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{upcomingExpenses.map((expense) => (
								<div key={expense.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
									<div className="flex items-center gap-3">
										<div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full">
											<AlertCircle className="h-4 w-4 text-orange-600" />
										</div>
										<div>
											<p className="text-sm font-medium">{expense.type}</p>
											<p className="text-xs text-muted-foreground">{expense.property}</p>
										</div>
									</div>
									<div className="text-right">
										<p className="text-sm font-semibold text-orange-600">
											-{expense.amount.toLocaleString('fr-FR')} F CFA
										</p>
										<p className="text-xs text-muted-foreground">
											{new Date(expense.date).toLocaleDateString('fr-FR')}
										</p>
									</div>
								</div>
							))}
							{upcomingExpenses.length === 0 && (
								<p className="text-sm text-muted-foreground text-center py-4">
									Aucune dépense à venir
								</p>
							)}
						</div>
						<Button variant="outline" size="sm" className="w-full mt-4" asChild>
							<Link href="/owner-portal/my-expenses">
								Gérer les dépenses →
							</Link>
						</Button>
					</CardContent>
				</Card>
			</div>

			{/* Property Status Breakdown */}
			<Card>
				<CardHeader>
					<CardTitle>État des Biens</CardTitle>
					<CardDescription>Répartition du statut de vos propriétés</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-3">
						<div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
							<div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
								<Check className="h-6 w-6 text-green-600" />
							</div>
							<div>
								<p className="text-2xl font-bold text-green-700">
									{myProperties.filter(p => p.status === 'occupied').length}
								</p>
								<p className="text-sm text-green-600">Occupés</p>
							</div>
						</div>

						<div className="flex items-center gap-4 p-4 bg-red-50 rounded-lg border border-red-200">
							<div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
								<AlertCircle className="h-6 w-6 text-red-600" />
							</div>
							<div>
								<p className="text-2xl font-bold text-red-700">
									{myProperties.filter(p => p.status === 'vacant').length}
								</p>
								<p className="text-sm text-red-600">Vacants</p>
							</div>
						</div>

						<div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
							<div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full">
								<Clock className="h-6 w-6 text-yellow-600" />
							</div>
							<div>
								<p className="text-2xl font-bold text-yellow-700">
									{myProperties.filter(p => p.status === 'maintenance').length}
								</p>
								<p className="text-sm text-yellow-600">En maintenance</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
