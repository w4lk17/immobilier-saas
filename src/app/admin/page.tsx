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
	Shield,
	CheckCircle,
	XCircle,
	Clock,
	AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

// Mock data - will be replaced with real API data
const stats = {
	totalUsers: 248,
	totalManagers: 42,
	totalProperties: 156,
	totalContracts: 89,
	totalRevenue: 125000,
	activeUsers: 189,
	systemHealth: "Operational",
};

const recentActivity = [
	{ id: 1, action: "Nouvel utilisateur créé", user: "Admin", time: "Il y a 5 min", type: "success" },
	{ id: 2, action: "Contrat signé", user: "Manager Dupont", time: "Il y a 15 min", type: "success" },
	{ id: 3, action: "Paiement en retard", user: "Système", time: "Il y a 1 heure", type: "warning" },
	{ id: 4, action: "Nouveau bien ajouté", user: "Manager Martin", time: "Il y a 2 heures", type: "info" },
	{ id: 5, action: "Employé créé", user: "Admin", time: "Il y a 3 heures", type: "success" },
];

const systemMetrics = [
	{ label: "Performance", value: "98%", status: "good", trend: "+2%" },
	{ label: "Uptime", value: "99.9%", status: "good", trend: "+0.1%" },
	{ label: "Response Time", value: "45ms", status: "good", trend: "-5ms" },
	{ label: "Error Rate", value: "0.1%", status: "good", trend: "-0.05%" },
];

export default function AdminDashboardPage() {
	return (
		<div className="space-y-6 p-4">
			{/* Header */}
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Tableau de Bord Admin</h1>
					<p className="text-muted-foreground">
						Vue d&apos;ensemble de l&apos;ensemble du système
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Badge variant="outline" className="gap-1">
						<Shield className="h-3 w-3" />
						Admin
					</Badge>
					<Badge variant="outline" className="gap-1 text-green-600 border-green-600">
						<CheckCircle className="h-3 w-3" />
						{stats.systemHealth}
					</Badge>
				</div>
			</div>

			{/* Stats Overview Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{/* Total Users */}
				<Card className="overflow-hidden">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.totalUsers}</div>
						<p className="text-xs text-muted-foreground">
							<span className="text-green-600 font-medium flex items-center gap-1">
								<ArrowUpRight className="h-3 w-3" />
								+12%
							</span>{" "}
							ce mois
						</p>
						<div className="mt-3 flex items-center gap-2 text-xs">
							<span className="text-green-600">{stats.activeUsers} actifs</span>
							<span className="text-muted-foreground">•</span>
							<span className="text-muted-foreground">{stats.totalUsers - stats.activeUsers} inactifs</span>
						</div>
					</CardContent>
				</Card>

				{/* Total Managers */}
				<Card className="overflow-hidden">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Employés</CardTitle>
						<UserRoundCog className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.totalManagers}</div>
						<p className="text-xs text-muted-foreground">
							<span className="text-green-600 font-medium flex items-center gap-1">
								<ArrowUpRight className="h-3 w-3" />
								+3
							</span>{" "}
							cette semaine
						</p>
						<Button variant="ghost" size="sm" className="mt-2 w-full justify-start px-0 h-6" asChild>
							<Link href="/admin-panel/managers">
								Gérer les employés →
							</Link>
						</Button>
					</CardContent>
				</Card>

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
								+8
							</span>{" "}
							ce mois
						</p>
						<div className="mt-3 flex items-center gap-2 text-xs">
							<span className="text-green-600">142 occupés</span>
							<span className="text-muted-foreground">•</span>
							<span className="text-orange-600">14 vacants</span>
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
								+5
							</span>{" "}
							cette semaine
						</p>
						<div className="mt-3 flex items-center gap-2 text-xs">
							<span className="text-green-600">82 actifs</span>
							<span className="text-muted-foreground">•</span>
							<span className="text-gray-600">7 inactifs</span>
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
								<CardDescription>Février 2026</CardDescription>
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
								+18.2%
							</span>{" "}
							par rapport au mois dernier
						</p>
						<div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
							<div className="h-full bg-green-600 rounded-full" style={{ width: "78%" }}></div>
						</div>
						<p className="text-xs text-muted-foreground mt-2">78% de l&apos;objectif mensuel</p>
					</CardContent>
				</Card>

				{/* Quick Actions */}
				<Card>
					<CardHeader>
						<CardTitle>Actions Rapides</CardTitle>
						<CardDescription>Tâches administratives courantes</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2">
						<Button variant="outline" size="sm" className="w-full justify-start" asChild>
							<Link href="/admin/users/new">
								<Users className="mr-2 h-4 w-4" />
								Ajouter un utilisateur
							</Link>
						</Button>
						<Button variant="outline" size="sm" className="w-full justify-start" asChild>
							<Link href="/admin/managers/new">
								<UserRoundCog className="mr-2 h-4 w-4" />
								Ajouter un employé
							</Link>
						</Button>
						<Button variant="outline" size="sm" className="w-full justify-start" asChild>
							<Link href="/dashboard/reports">
								<TrendingUp className="mr-2 h-4 w-4" />
								Voir les rapports
							</Link>
						</Button>
						<Button variant="outline" size="sm" className="w-full justify-start" asChild>
							<Link href="/admin/settings">
								<Shield className="mr-2 h-4 w-4" />
								Paramètres système
							</Link>
						</Button>
					</CardContent>
				</Card>
			</div>

			{/* System Health & Recent Activity */}
			<div className="grid gap-4 md:grid-cols-2">
				{/* System Metrics */}
				<Card>
					<CardHeader>
						<CardTitle>État du Système</CardTitle>
						<CardDescription>Métriques de performance en temps réel</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{systemMetrics.map((metric, index) => (
								<div key={index} className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<div className={`h-2 w-2 rounded-full ${metric.status === 'good' ? 'bg-green-500' :
											metric.status === 'warning' ? 'bg-yellow-500' :
												'bg-red-500'
											}`}></div>
										<span className="text-sm font-medium">{metric.label}</span>
									</div>
									<div className="flex items-center gap-2">
										<span className="text-sm font-bold">{metric.value}</span>
										<Badge variant="outline" className={`text-xs ${metric.trend.startsWith('+') ? 'text-green-600 border-green-600' :
											metric.trend.startsWith('-') ? 'text-red-600 border-red-600' :
												'text-gray-600'
											}`}>
											{metric.trend}
										</Badge>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Recent Activity */}
				<Card>
					<CardHeader>
						<CardTitle>Activité Récente</CardTitle>
						<CardDescription>Dernières actions dans le système</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{recentActivity.map((activity) => (
								<div key={activity.id} className="flex items-start gap-3">
									<div className={`mt-0.5 rounded-full p-1 ${activity.type === 'success' ? 'bg-green-100 text-green-600' :
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
			</div>

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
								<p className="text-sm font-medium text-yellow-800">3 paiements en retard</p>
								<p className="text-xs text-yellow-700">Requiert une attention immédiate</p>
							</div>
							<Button variant="outline" size="sm" className="border-yellow-300 text-yellow-700 hover:bg-yellow-100" asChild>
								<Link href="/dashboard/payments">Voir</Link>
							</Button>
						</div>

						<div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
							<Users className="h-5 w-5 text-blue-600 flex-shrink-0" />
							<div className="flex-1">
								<p className="text-sm font-medium text-blue-800">5 utilisateurs à valider</p>
								<p className="text-xs text-blue-700">Demandes d&apos;inscription en attente</p>
							</div>
							<Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-100" asChild>
								<Link href="/admin-panel/users">Voir</Link>
							</Button>
						</div>

						<div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
							<CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
							<div className="flex-1">
								<p className="text-sm font-medium text-green-800">Système à jour</p>
								<p className="text-xs text-green-700">Tous les services fonctionnent normalement</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
