"use client";

import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Kpi,
  OrgTable,
  AuditTable,
  PageTitle,
} from "@/features/s-admin/components/super-admin-ui";

export default function S_AdminDashboardPage() {
  return (
    <div>
      <PageTitle
        title="Vue globale de la plateforme"
        description="Pilotez vos organisations, utilisateurs et services depuis un seul espace."
        action={
          <Button asChild>
            <Link href="/s-admin/organizations">
              Gérer les organisations
            </Link>
          </Button>
        }
      />
      <div className="space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Kpi
            label="Organisations actives"
            value="128"
            change="+12%"
            icon={Building2}
          />
          <Kpi
            label="Utilisateurs"
            value="1 842"
            change="+8,4%"
            icon={Users}
          />
          <Kpi
            label="MRR"
            value="4,28 M FCFA"
            change="+15%"
            icon={Wallet}
          />
          <Kpi
            label="Alertes critiques"
            value="3"
            icon={AlertTriangle}
          />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Croissance des organisations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-52 items-end gap-3 border-b px-4">
                {[35, 48, 42, 60, 55, 72, 88, 78, 96, 84, 100, 92].map(
                  (v, i) => (
                    <div
                      key={i}
                      className="bg-primary/80 flex-1 rounded-t"
                      style={{ height: `${v}%` }}
                    />
                  )
                )}
              </div>
              <p className="text-muted-foreground mt-3 text-xs">
                Octobre · Novembre · Décembre
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Santé de la plateforme</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                <CheckCircle2 className="mr-2 inline size-4 text-emerald-600" />
                Disponibilité
                <b className="float-right">99,98%</b>
              </p>
              <p>
                <Activity className="mr-2 inline size-4 text-blue-600" />
                Temps de réponse
                <b className="float-right">42 ms</b>
              </p>
              <p>
                <ShieldCheck className="mr-2 inline size-4 text-emerald-600" />
                Sécurité
                <b className="float-right text-emerald-600">Protégée</b>
              </p>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/s-admin/system">Voir les services</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <OrgTable compact />
        <AuditTable limit={4} />
      </div>
    </div>
  );
}
