"use client";

import type { ReactNode } from "react";
import {
	CalendarDays,
	MapPin,
	ShieldCheck,
	User,
	Users,
	Briefcase,
	Download,
} from "lucide-react";

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatDateTime, formatOptionalDate } from "@/lib/dateUtils";
import { formatPhone } from "@/lib/utils";
import { FrontendTenant } from "@/types";

interface TenantDetailsModalProps {
	tenant: FrontendTenant | null;
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
}

interface DetailItemProps {
	label: string;
	value?: string | null;
}

function DetailItem({ label, value }: DetailItemProps) {
	return (
		<div className="space-y-1">
			<p className="text-sm font-medium  text-foreground">
				{label}
			</p>
			<p className="text-sm leading-6 text-muted-foreground">
				{value?.trim() || "-"}
			</p>
		</div>
	);
}

interface SectionProps {
	title: string;
	icon: ReactNode;
	children: ReactNode;
}

function Section({ title, icon, children }: SectionProps) {
	return (
		<section className="space-y-3">
			<div className="flex items-center gap-2">
				<div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
					{icon}
				</div>
				<h3 className="text-base font-semibold text-foreground">{title}</h3>
			</div>
			<div className="rounded-xl border bg-background p-4 sm:p-5">
				{children}
			</div>
		</section>
	);
}

export function TenantDetailsModal({ tenant, isOpen, onOpenChange }: TenantDetailsModalProps) {
	if (!tenant) return null;

	const fullName =
		`${tenant.lastName || ""} ${tenant.firstName || ""}`.trim() || "Locataire";

	const getInitials = (firstName?: string | null, lastName?: string | null) => {
		const first = firstName?.[0] || "";
		const last = lastName?.[0] || "";
		return (last + first).toUpperCase() || "TE";
	};

	const phone = tenant.phoneNumber ? formatPhone(tenant.phoneNumber) : "-";
	const emergencyContactName = `${tenant.pacLastName || "-"} ${tenant.pacFirstName || ""}`.trim();
	const emergencyContactPhone = tenant.pacPhoneNumber ? formatPhone(tenant.pacPhoneNumber) : "-";

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[92vh] max-w-4xl overflow-y-auto p-0">
				<DialogHeader className="px-6 pt-5 pb-4 sm:px-8">
					<div className="flex items-start gap-4">
						<Avatar className="h-16 w-16 border">
							<AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
								{getInitials(tenant.firstName, tenant.lastName)}
							</AvatarFallback>
						</Avatar>
						<div className="min-w-0 flex-1">
							<div className="flex flex-wrap items-center gap-2">
								<DialogTitle className="text-xl sm:text-2xl">{fullName}</DialogTitle>
								<Badge variant={tenant.isActive ? "success" : "secondary"}>
									{tenant.isActive ? "Actif" : "Inactif"}
								</Badge>
							</div>
							<div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
								{/* <span>ID : #{tenant.id}</span> */}
								<span>Né(e) le : {formatOptionalDate(tenant.dateOfBirth)}</span>
								<span>Créé le : {formatDateTime(tenant.createdAt)}</span>
							</div>
						</div>
					</div>
				</DialogHeader>

				<Separator />

				<div className="space-y-5 px-6 py-5 sm:px-8 sm:py-6">
					<Section title="Coordonnées" icon={<User className="h-4 w-4" />}>
						<div className="grid gap-4 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-5">
							<DetailItem label="Nom complet" value={fullName} />
							<DetailItem label="Téléphone" value={phone} />
							<DetailItem label="E-mail" value={tenant.email} />
							<DetailItem label="Adresse actuelle" value={tenant.address} />
							<DetailItem label="Ancienne adresse" value={tenant.tenantProfile?.oldAddress} />
						</div>
					</Section>

					<Section title="Identité" icon={<ShieldCheck className="h-4 w-4" />}>
						<div className="grid gap-4 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-5">
							<DetailItem
								label="Date de naissance"
								value={formatOptionalDate(tenant.dateOfBirth)}
							/>
							<DetailItem label="Type de pièce" value={tenant.identityDocumentType} />
							<DetailItem label="Numéro de pièce" value={tenant.identityDocumentNumber} />
						</div>
					</Section>

					<Section title="Activité professionnelle" icon={<Briefcase className="h-4 w-4" />}>
						<div className="grid gap-4 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-5">
							<DetailItem label="Profession" value={tenant.occupation} />
							<DetailItem label="Lieu de travail" value={tenant.workPlace} />
						</div>
					</Section>

					<Section title="Contact d'urgence" icon={<Users className="h-4 w-4" />}>
						<div className="grid gap-4 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-5">
							<DetailItem label="Personne à prévenir" value={emergencyContactName} />
							<DetailItem label="Téléphone" value={emergencyContactPhone} />
						</div>
					</Section>

					<Section title="Suivi du dossier" icon={<CalendarDays className="h-4 w-4" />}>
						<div className="grid gap-4 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-5">
							<DetailItem label="Créé le" value={formatDateTime(tenant.createdAt)} />
							<DetailItem label="Mis à jour le" value={formatDateTime(tenant.updatedAt)} />
							<DetailItem
								label="Statut du compte"
								value={tenant.isActive ? "Compte actif" : "Compte inactif"}
							/>
						</div>
					</Section>
				</div>

				<Separator />

				<DialogFooter className="px-6 py-4 sm:px-8">
						{/* <Button variant="outline" disabled>
							<Download className="h-4 w-4" />
							Export PDF bientôt
						</Button> */}
					<DialogClose asChild>
						<Button type="button" variant="secondary">
							Fermer
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
