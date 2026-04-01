"use client";

import { Plus, Wrench, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { MaintenanceRequestForm } from "@/features/maintenance/components/MaintenanceRequestForm";

// Mock data for maintenance requests
const mockRequests = [
	{
		id: 1,
		title: "Fuite d'eau dans la salle de bain",
		description: "Le robinet du lavabo fuit constamment",
		status: "pending",
		date: "2026-02-20",
		category: "Plomberie",
		priority: "high",
	},
	{
		id: 2,
		title: "Remplacement ampoule cuisine",
		description: "L'ampoule du plafond ne fonctionne plus",
		status: "in_progress",
		date: "2026-02-10",
		category: "Électricité",
		priority: "low",
	},
	{
		id: 3,
		title: "Climatisation bruyante",
		description: "Le climatiseur du salon fait beaucoup de bruit",
		status: "completed",
		date: "2026-01-15",
		category: "Climatisation",
		priority: "medium",
	},
];

function getStatusBadge(status: string) {
	switch (status) {
		case "pending":
			return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" /> En attente</Badge>;
		case "in_progress":
			return <Badge variant="secondary" className="bg-blue-100 text-blue-800"><Wrench className="w-3 h-3 mr-1" /> En cours</Badge>;
		case "completed":
			return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> Terminé</Badge>;
		default:
			return <Badge variant="secondary">Inconnu</Badge>;
	}
}

function getPriorityBadge(priority: string) {
	switch (priority) {
		case "high":
			return <Badge variant="outline" className="border-red-500 text-red-700">Élevée</Badge>;
		case "medium":
			return <Badge variant="outline" className="border-orange-500 text-orange-700">Moyenne</Badge>;
		case "low":
			return <Badge variant="outline" className="border-green-500 text-green-700">Faible</Badge>;
		default:
			return null;
	}
}

export default function TenantMaintenancePage() {
	const [requests, setRequests] = useState(mockRequests);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const handleNewRequest = () => {
		// In a real app, this would be handled by the API response
		setIsDialogOpen(false);
		// You could refresh the data here or add the new request to the list
	};

	return (
		<div className="h-full flex-1 flex-col gap-8 p-4 md:flex">
			<div className="flex items-center justify-between gap-2">
				<div className="flex flex-col gap-1">
					<h2 className="text-2xl font-bold tracking-tight">Demandes de Maintenance</h2>
					<p className="text-muted-foreground">
						Suivez vos demandes et signalez des problèmes
					</p>
				</div>
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogTrigger asChild>
						<Button>
							<Plus className="mr-2 h-4 w-4" />
							Nouvelle demande
						</Button>
					</DialogTrigger>
					<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
						<DialogHeader>
							<DialogTitle>Nouvelle demande de maintenance</DialogTitle>
							<DialogDescription>
								Décrivez le problème que vous rencontrez. Notre équipe traitera votre demande dans les plus brefs délais.
							</DialogDescription>
						</DialogHeader>
						<MaintenanceRequestForm onSuccess={handleNewRequest} onCancel={() => setIsDialogOpen(false)} />
					</DialogContent>
				</Dialog>
			</div>

			<div className="grid gap-4">
				{requests.length === 0 ? (
					<Card>
						<CardContent className="flex flex-col items-center justify-center py-12">
							<AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
							<p className="text-muted-foreground">Aucune demande de maintenance</p>
						</CardContent>
					</Card>
				) : (
					requests.map((request) => (
						<Card key={request.id}>
							<CardHeader>
								<div className="flex items-start justify-between gap-4">
									<div className="flex-1">
										<div className="flex items-center gap-2 mb-1">
											<CardTitle className="text-lg">{request.title}</CardTitle>
											{getPriorityBadge(request.priority)}
										</div>
										<p className="text-sm text-muted-foreground">{request.description}</p>
									</div>
									{getStatusBadge(request.status)}
								</div>
							</CardHeader>
							<CardContent>
								<Separator className="mb-4" />
								<div className="flex items-center justify-between text-sm">
									<div className="flex items-center gap-4">
										<span className="text-muted-foreground">Catégorie:</span>
										<span className="font-medium">{request.category}</span>
									</div>
									<div className="flex items-center gap-4">
										<span className="text-muted-foreground">Date:</span>
										<span className="font-medium">{new Date(request.date).toLocaleDateString('fr-FR')}</span>
									</div>
								</div>
							</CardContent>
						</Card>
					))
				)}
			</div>
		</div>
	);
}
