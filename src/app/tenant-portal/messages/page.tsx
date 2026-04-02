"use client";

import { Mail, Send, User, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

// Mock messages data
const mockMessages = [
	{
		id: 1,
		from: "Propriétaire",
		subject: "Bienvenue dans votre nouveau logement",
		content: "Bonjour, nous sommes ravis de vous accueillir. N'hésitez pas à nous contacter pour任何 question.",
		date: "2026-02-01",
		read: false,
	},
	{
		id: 2,
		from: "Gestionnaire",
		subject: "Paiement reçu",
		content: "Votre paiement de loyer pour janvier a bien été reçu. Merci.",
		date: "2026-01-31",
		read: true,
	},
];

export default function TenantMessagesPage() {
	return (
		<div className="h-full flex-1 flex-col gap-8 p-4 md:flex">
			<div className="flex items-center justify-between gap-2">
				<div className="flex flex-col gap-1">
					<h2 className="text-2xl font-bold tracking-tight">Messages</h2>
					<p className="text-muted-foreground">
						Communiquez avec votre propriétaire et gestionnaire
					</p>
				</div>
			</div>

			<div className="grid lg:grid-cols-3 gap-6">
				{/* Messages List */}
				<div className="lg:col-span-2 space-y-4">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-semibold">Boîte de réception</h3>
						<Badge variant="secondary">{mockMessages.filter(m => !m.read).length} non-lus</Badge>
					</div>

					{mockMessages.length === 0 ? (
						<Card>
							<CardContent className="flex flex-col items-center justify-center py-12">
								<Mail className="h-12 w-12 text-muted-foreground mb-4" />
								<p className="text-muted-foreground">Aucun message</p>
							</CardContent>
						</Card>
					) : (
						mockMessages.map((message) => (
							<Card key={message.id} className={!message.read ? "border-primary" : ""}>
								<CardHeader>
									<div className="flex items-start justify-between gap-4">
										<div className="flex items-start gap-3 flex-1">
											<Avatar>
												<AvatarFallback>
													{message.from === "Propriétaire" ? (
														<Building className="h-4 w-4" />
													) : (
														<User className="h-4 w-4" />
													)}
												</AvatarFallback>
											</Avatar>
											<div className="flex-1">
												<div className="flex items-center justify-between mb-1">
													<CardTitle className="text-base">{message.subject}</CardTitle>
													{!message.read && <Badge className="ml-2">Nouveau</Badge>}
												</div>
												<p className="text-sm text-muted-foreground">{message.from}</p>
											</div>
										</div>
										<span className="text-xs text-muted-foreground whitespace-nowrap">
											{new Date(message.date).toLocaleDateString('fr-FR')}
										</span>
									</div>
								</CardHeader>
								<CardContent>
									<Separator className="mb-3" />
									<p className="text-sm">{message.content}</p>
								</CardContent>
							</Card>
						))
					)}
				</div>

				{/* New Message Form */}
				<div className="lg:col-span-1">
					<Card className="sticky top-4">
						<CardHeader>
							<CardTitle className="text-base">Nouveau message</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<label className="text-sm font-medium">Destinataire</label>
								<select className="w-full px-3 py-2 border rounded-md text-sm">
									<option>Propriétaire</option>
									<option>Gestionnaire</option>
								</select>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium">Sujet</label>
								<Input placeholder="Sujet du message..." />
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium">Message</label>
								<Textarea
									placeholder="Écrivez votre message..."
									rows={6}
								/>
							</div>
							<Button className="w-full">
								<Send className="mr-2 h-4 w-4" />
								Envoyer
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
