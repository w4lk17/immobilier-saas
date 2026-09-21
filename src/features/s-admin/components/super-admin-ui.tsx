"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight,
  Database,
  Download,
  FileText,
  Globe2,
  Mail,
  MoreHorizontal,
  Search,
  Server,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export type OrgStatus = "Actif" | "Essai" | "Suspendu";

export type Organization = {
  id: string;
  name: string;
  owner: string;
  plan: string;
  status: OrgStatus;
  users: number;
  properties: number;
  usage: number;
  lastActive: string;
  created: string;
};

export const organizations: Organization[] = [
  {
    id: "org-001",
    name: "Hofeti Immobilier",
    owner: "Awa Diop",
    plan: "Business",
    status: "Actif",
    users: 24,
    properties: 184,
    usage: 72,
    lastActive: "Il y a 3 min",
    created: "12 janv. 2025",
  },
  {
    id: "org-002",
    name: "Agence Horizon",
    owner: "Marc Martin",
    plan: "Pro",
    status: "Actif",
    users: 11,
    properties: 76,
    usage: 48,
    lastActive: "Il y a 18 min",
    created: "08 févr. 2025",
  },
  {
    id: "org-003",
    name: "Cabinet Teranga",
    owner: "Fatou Sow",
    plan: "Starter",
    status: "Essai",
    users: 5,
    properties: 21,
    usage: 31,
    lastActive: "Hier",
    created: "02 mars 2025",
  },
  {
    id: "org-004",
    name: "Immo Plus",
    owner: "Jean Kouassi",
    plan: "Business",
    status: "Suspendu",
    users: 18,
    properties: 93,
    usage: 89,
    lastActive: "Il y a 4 j",
    created: "18 déc. 2024",
  },
];

export const auditEvents = [
  {
    action: "Organisation suspendue",
    actor: "S. Admin",
    target: "Immo Plus",
    time: "Il y a 12 min",
    result: "Succès",
  },
  {
    action: "Rôle modifié",
    actor: "S. Admin",
    target: "m.martin@horizon.fr",
    time: "Il y a 31 min",
    result: "Succès",
  },
  {
    action: "Tentative de connexion",
    actor: "unknown@exemple.com",
    target: "Plateforme",
    time: "Il y a 48 min",
    result: "Échec",
  },
  {
    action: "Plan mis à niveau",
    actor: "S. Admin",
    target: "Hofeti Immobilier",
    time: "Il y a 2 h",
    result: "Succès",
  },
];

export function PageTitle(props: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b p-6 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold">{props.title}</h1>
        <p className="text-muted-foreground text-sm">{props.description}</p>
      </div>
      {props.action}
    </div>
  );
}

export function Kpi(props: {
  label: string;
  value: string;
  change?: string;
  icon: React.ElementType;
}) {
  const Icon = props.icon;
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex justify-between">
          <p className="text-muted-foreground text-sm">{props.label}</p>
          <span className="bg-primary/10 text-primary rounded-lg p-2">
            <Icon className="size-4" />
          </span>
        </div>
        <div className="mt-3 flex justify-between">
          <b className="text-2xl">{props.value}</b>
          {props.change && (
            <span className="text-xs text-emerald-600">
              <ArrowUpRight className="inline size-3" />
              {props.change}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function StatusBadge({ status }: { status: OrgStatus }) {
  return (
    <Badge
      variant="outline"
      className={
        status === "Actif"
          ? "text-emerald-700"
          : status === "Essai"
          ? "text-amber-700"
          : "text-red-700"
      }
    >
      {status}
    </Badge>
  );
}

export function OrgTable({ compact = false }: { compact?: boolean }) {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState(organizations);

  const filtered = rows.filter((o) =>
    `${o.name} ${o.owner} ${o.plan}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>
            {compact ? "Organisations à surveiller" : "Toutes les organisations"}
          </CardTitle>
          <CardDescription>
            {filtered.length} organisations affichées
          </CardDescription>
        </div>
        {!compact && (
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 size-4" />
            <Input
              className="pl-8"
              placeholder="Rechercher..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground border-b text-left">
                <th className="pb-3">Organisation</th>
                <th className="pb-3">Plan</th>
                <th className="pb-3">Statut</th>
                <th className="pb-3">Utilisateurs</th>
                <th className="pb-3">Quota</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, compact ? 4 : 99).map((o) => (
                <tr key={o.id} className="border-b last:border-0">
                  <td className="py-4">
                    <Link
                      className="font-medium hover:underline"
                      href={`/s-admin/organizations/${o.id}`}
                    >
                      {o.name}
                    </Link>
                    <p className="text-muted-foreground text-xs">
                      {o.owner} · {o.lastActive}
                    </p>
                  </td>
                  <td>{o.plan}</td>
                  <td>
                    <StatusBadge status={o.status} />
                  </td>
                  <td>{o.users}</td>
                  <td>
                    <div className="flex min-w-32 items-center gap-2">
                      <Progress value={o.usage} className="h-2" />
                      <span className="text-xs">{o.usage}%</span>
                    </div>
                  </td>
                  <td className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setRows((c) =>
                          c.map((x) =>
                            x.id === o.id
                              ? {
                                  ...x,
                                  status:
                                    x.status === "Suspendu"
                                      ? "Actif"
                                      : "Suspendu",
                                }
                              : x
                          )
                        );
                        toast.success("Statut mis à jour");
                      }}
                    >
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export function AuditTable({ limit }: { limit?: number }) {
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>Journal d’audit</CardTitle>
          <CardDescription>Actions sensibles et événements de sécurité</CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => toast.success("Export CSV préparé")}
        >
          <Download className="mr-2 size-4" />
          Exporter
        </Button>
      </CardHeader>
      <CardContent>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-muted-foreground border-b text-left">
              <th className="pb-3">Action</th>
              <th className="pb-3">Acteur</th>
              <th className="pb-3">Cible</th>
              <th className="pb-3">Date</th>
              <th>Résultat</th>
            </tr>
          </thead>
          <tbody>
            {auditEvents.slice(0, limit).map((e) => (
              <tr key={e.action} className="border-b last:border-0">
                <td className="py-4 font-medium">{e.action}</td>
                <td>{e.actor}</td>
                <td>{e.target}</td>
                <td className="text-muted-foreground">{e.time}</td>
                <td>
                  <Badge
                    variant="outline"
                    className={e.result === "Succès" ? "text-emerald-700" : "text-red-700"}
                  >
                    {e.result}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

export function HealthCard({
  name,
  icon: Icon,
  detail,
}: {
  name: string;
  icon: React.ElementType;
  detail: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border p-4">
      <Icon className="size-5 text-emerald-600" />
      <div className="flex-1">
        <b>{name}</b>
        <p className="text-muted-foreground text-xs">{detail}</p>
      </div>
      <Badge variant="outline" className="text-emerald-700">
        Opérationnel
      </Badge>
    </div>
  );
}

export const serviceHealth = [
  {
    name: "API principale",
    icon: Globe2,
    detail: "42 ms · 99,98% uptime",
  },
  {
    name: "Base de données",
    icon: Database,
    detail: "12 connexions actives",
  },
  {
    name: "Stockage documents",
    icon: FileText,
    detail: "68% utilisé",
  },
  {
    name: "Service email",
    icon: Mail,
    detail: "Dernier envoi il y a 2 min",
  },
  {
    name: "Paiements",
    icon: Wallet,
    detail: "Aucun incident",
  },
  {
    name: "Tâches asynchrones",
    icon: Server,
    detail: "0 job en échec",
  },
];
