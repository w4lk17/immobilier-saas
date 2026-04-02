"use client";

import {
	Activity,
	ArrowUpRight,
	Building2,
	Users,
	UserRoundCog,
	TrendingUp,
	Wallet,
	FileText,
	CheckCircle,
	XCircle,
	Clock,
	AlertTriangle,
	Home,
	HandCoins,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

// Mock data - will be replaced with real API data
const stats = {
	totalProperties: 24,
	totalContracts: 18,
	totalTenants: 22,
	totalOwners: 8,
	totalRevenue: 850000,
	totalExpenses: 125000,
	activeContracts: 16,
	pendingPayments: 4,
};

const recentActivity = [
	{ id: 1, action: "Nouveau contrat signé", user: "Manager Dupont", time: "Il y a 5 min", type: "success" },
	{ id: 2, action: "Paiement reçu", user: "Locataire Martin", time: "Il y a 15 min", type: "success" },
	{ id: 3, action: "Demande de maintenance", user: "Locataire Bernard", time: "Il y a 1 heure", type: "warning" },
	{ id: 4, action: "Nouveau bien ajouté", user: "Manager Martin", time: "Il y a 2 heures", type: "info" },
	{ id: 5, action: "Dépense enregistrée", user: "Manager Dupont", time: "Il y a 3 heures", type: "success" },
];

const quickActions = [
	{ label: "Nouveau Contrat", href: "/manager/contracts/new", icon: FileText },
	{ label: "Nouveau Bien", href: "/manager/properties/new", icon: Building2 },
	{ label: "Enregistrer Paiement", href: "/manager/payments/new", icon: Wallet },
	{ label: "Nouvelle Dépense", href: "/manager/expenses/new", icon: TrendingUp },
];

export default function ManagerDashboardPage() {
	return (
		<div className="space-y-6 p-4">
			{/* Header */}
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Tableau de Bord Gestionnaire</h1>
					<p className="text-muted-foreground">
						Vue d&apos;ensemble de vos propriétés et activités
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Badge variant="outline" className="gap-1">
						<UserRoundCog className="h-3 w-3" />
						Gestionnaire
					</Badge>
					<Badge variant="outline" className="gap-1 text-green-600 border-green-600">
						<CheckCircle className="h-3 w-3" />
						Actif
					</Badge>
				</div>
			</div>

			{/* Stats Overview Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{/* Total Properties */}
				<Card className="overflow-hidden">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Biens</CardTitle>
						<Building2 className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.totalProperties}</div>
						<p className="text-xs text-muted-foreground">
							<span className="text-green-600 font-medium flex items-center gap-1">
								<ArrowUpRight className="h-3 w-3" />
								+3
							</span>{" "}
							ce mois
						</p>
						<div className="mt-3 flex items-center gap-2 text-xs">
							<span className="text-green-600">{stats.totalProperties - 2} occupés</span>
							<span className="text-muted-foreground">•</span>
							<span className="text-orange-600">2 vacants</span>
						</div>
					</CardContent>
				</Card>

				{/* Total Contracts */}
				<Card className="overflow-hidden">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Contrats</CardTitle>
						<FileText className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.totalContracts}</div>
						<p className="text-xs text-muted-foreground">
							<span className="text-green-600 font-medium flex items-center gap-1">
								<ArrowUpRight className="h-3 w-3" />
								+2
							</span>{" "}
							cette semaine
						</p>
						<div className="mt-3 flex items-center gap-2 text-xs">
							<span className="text-green-600">{stats.activeContracts} actifs</span>
							<span className="text-muted-foreground">•</span>
							<span className="text-gray-600">{stats.totalContracts - stats.activeContracts} inactifs</span>
						</div>
					</CardContent>
				</Card>

				{/* Total Tenants */}
				<Card className="overflow-hidden">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Locataires</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.totalTenants}</div>
						<p className="text-xs text-muted-foreground">
							<span className="text-green-600 font-medium flex items-center gap-1">
								<ArrowUpRight className="h-3 w-3" />
								+1
							</span>{" "}
							cette semaine
						</p>
						<div className="mt-3 flex items-center gap-2 text-xs">
							<span className="text-green-600">{stats.totalTenants - 1} à jour</span>
							<span className="text-muted-foreground">•</span>
							<span className="text-orange-600">1 en retard</span>
						</div>
					</CardContent>
				</Card>

				{/* Total Owners */}
				<Card className="overflow-hidden">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Propriétaires</CardTitle>
						<Home className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.totalOwners}</div>
						<p className="text-xs text-muted-foreground">
							<span className="text-green-600 font-medium">Actifs</span>
						</p>
						<div className="mt-3 flex items-center gap-2 text-xs">
							<span className="text-blue-600">{stats.totalProperties} biens gérés</span>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Revenue & Quick Actions Row */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{/* Revenue Card */}
				<Card className="col-span-2">
					<CardHeader>
						<div className="flex items-center justify-between">
							<div>
								<CardTitle>Revenus du Mois</CardTitle>
								<CardDescription>Mars 2026</CardDescription>
							</div>
							<Wallet className="h-8 w-8 text-green-600" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold">
							{stats.totalRevenue.toLocaleString('fr-FR')} F CFA
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							<span className="text-green-600 font-medium flex items-center gap-1">
								<ArrowUpRight className="h-3 w-3" />
								+12.5%
							</span>{" "}
							par rapport au mois dernier
						</p>
						<div className="mt-4 grid grid-cols-2 gap-4">
							<div className="p-3 bg-green-50 rounded-lg border border-green-200">
								<div className="text-sm text-green-700 font-medium">Revenus</div>
								<div className="text-lg font-bold text-green-800">{stats.totalRevenue.toLocaleString('fr-FR')} F CFA</div>
							</div>
							<div className="p-3 bg-red-50 rounded-lg border border-red-200">
								<div className="text-sm text-red-700 font-medium">Dépenses</div>
								<div className="text-lg font-bold text-red-800">{stats.totalExpenses.toLocaleString('fr-FR')} F CFA</div>
							</div>
						</div>
						<div className="mt-3 p-3 bg-primary-foreground rounded-lg border">
							<div className="text-sm text-muted-foreground font-medium">Net</div>
							<div className="text-xl font-bold">{(stats.totalRevenue - stats.totalExpenses).toLocaleString('fr-FR')} F CFA</div>
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
						{quickActions.map((action, index) => (
							<Button key={index} variant="outline" size="sm" className="w-full justify-start" asChild>
								<Link href={action.href}>
									<action.icon className="mr-2 h-4 w-4" />
									{action.label}
								</Link>
							</Button>
						))}
					</CardContent>
				</Card>
			</div>

			{/* Recent Activity & Alerts */}
			<div className="grid gap-4 md:grid-cols-2">
				{/* Recent Activity */}
				<Card>
					<CardHeader>
						<CardTitle>Activité Récente</CardTitle>
						<CardDescription>Dernières actions de gestion</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{recentActivity.map((activity) => (
								<div key={activity.id} className="flex items-start gap-3">
									<div className={`mt-0.5 rounded-full p-1 ${
										activity.type === 'success' ? 'bg-green-100 text-green-600' :
										activity.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
										activity.type === 'error' ? 'bg-red-100 text-red-600' :
										'bg-blue-100 text-blue-600'
									}`}>
										{activity.type === 'success' && <CheckCircle className="h-3 w-3" />}
										{activity.type === 'warning' && <AlertTriangle className="h-3 w-3" />}
										{activity.type === 'error' && <XCircle className="h-3 w-3" />}
										{activity.type === 'info' && <Activity className="h-3 w-3" />}
									</div>
									<div className="flex-1 space-y-1">
										<p className="text-sm font-medium leading-none">{activity.action}</p>
										<p className="text-xs text-muted-foreground">{activity.user}</p>
									</div>
									<div className="flex items-center gap-1 text-xs text-muted-foreground">
										<Clock className="h-3 w-3" />
										{activity.time}
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Alerts & Notifications */}
				<Card>
					<CardHeader>
						<CardTitle>Alertes & Notifications</CardTitle>
						<CardDescription>Actions requises et informations importantes</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							<div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
								<AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
								<div className="flex-1">
									<p className="text-sm font-medium text-yellow-800">{stats.pendingPayments} paiements en attente</p>
									<p className="text-xs text-yellow-700">Requiert votre attention</p>
								</div>
								<Button variant="outline" size="sm" className="border-yellow-300 text-yellow-700 hover:bg-yellow-100" asChild>
									<Link href="/manager/payments">Voir</Link>
								</Button>
							</div>

							<div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
								<HandCoins className="h-5 w-5 text-blue-600 flex-shrink-0" />
								<div className="flex-1">
									<p className="text-sm font-medium text-blue-800">Revenus mensuels à 78%</p>
									<p className="text-xs text-blue-700">Objectif: 1 000 000 F CFA</p>
								</div>
							</div>

							<div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
								<CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
								<div className="flex-1">
									<p className="text-sm font-medium text-green-800">Tous les contrats à jour</p>
									<p className="text-xs text-green-700">{stats.activeContracts} contrats actifs</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
