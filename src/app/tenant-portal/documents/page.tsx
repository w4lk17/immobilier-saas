"use client";

import { FileText, Download, Eye, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Mock documents data
const mockDocuments = [
	{
		id: 1,
		name: "Contrat de Location",
		type: "contract",
		date: "2026-01-01",
		size: "245 KB",
		format: "PDF",
	},
	{
		id: 2,
		name: "Quittance Janvier 2026",
		type: "receipt",
		date: "2026-01-31",
		size: "128 KB",
		format: "PDF",
	},
	{
		id: 3,
		name: "Quittance Décembre 2025",
		type: "receipt",
		date: "2025-12-31",
		size: "125 KB",
		format: "PDF",
	},
];

function getDocumentIcon(type: string) {
	return <FileText className="h-5 w-5 text-red-500" />;
}

function getTypeBadge(type: string) {
	switch (type) {
		case "contract":
			return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Contrat</Badge>;
		case "receipt":
			return <Badge variant="secondary" className="bg-green-100 text-green-800">Quittance</Badge>;
		case "invoice":
			return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Facture</Badge>;
		default:
			return <Badge variant="secondary">Autre</Badge>;
	}
}

export default function TenantDocumentsPage() {
	return (
		<div className="h-full flex-1 flex-col gap-8 p-4 md:flex">
			<div className="flex items-center justify-between gap-2">
				<div className="flex flex-col gap-1">
					<h2 className="text-2xl font-bold tracking-tight">Documents</h2>
					<p className="text-muted-foreground">
						Vos contrats, quittances et autres documents
					</p>
				</div>
			</div>

			{/* Search Bar */}
			<div className="relative">
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
				<Input
					placeholder="Rechercher des documents..."
					className="pl-10 max-w-md"
				/>
			</div>

			{/* Documents Grid */}
			<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
				{mockDocuments.map((doc) => (
					<Card key={doc.id} className="hover:shadow-md transition-shadow">
						<CardContent className="p-4">
							<div className="flex items-start gap-4">
								<Avatar className="h-12 w-12 bg-red-50">
									<AvatarFallback className="bg-red-50 text-red-500">
										{getDocumentIcon(doc.type)}
									</AvatarFallback>
								</Avatar>
								<div className="flex-1 min-w-0">
									<h4 className="font-medium text-sm truncate">{doc.name}</h4>
									<div className="flex items-center gap-2 mt-1">
										{getTypeBadge(doc.type)}
										<span className="text-xs text-muted-foreground">{doc.format}</span>
									</div>
									<div className="flex items-center justify-between mt-3">
										<div className="text-xs text-muted-foreground">
											<div>{doc.size}</div>
											<div>{new Date(doc.date).toLocaleDateString('fr-FR')}</div>
										</div>
										<div className="flex gap-1">
											<Button size="sm" variant="outline" className="h-8 w-8 p-0">
												<Eye className="h-3 w-3" />
											</Button>
											<Button size="sm" variant="outline" className="h-8 w-8 p-0">
												<Download className="h-3 w-3" />
											</Button>
										</div>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Empty State (hidden when there are documents) */}
			{mockDocuments.length === 0 && (
				<Card>
					<CardContent className="flex flex-col items-center justify-center py-12">
						<FileText className="h-12 w-12 text-muted-foreground mb-4" />
						<p className="text-muted-foreground">Aucun document disponible</p>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
