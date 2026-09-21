"use client";

import { use } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, FileText, Users } from "lucide-react";
import {
  AuditTable,
  Kpi,
  organizations,
  PageTitle,
  StatusBadge,
} from "@/features/s-admin/components/super-admin-ui";

export default function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const o = organizations.find((x) => x.id === id) || organizations[0];

  return (
    <div>
      <PageTitle
        title={o.name}
        description={`Organisation créée le ${o.created}`}
        action={
          <Button variant="outline">
            {o.status === "Suspendu" ? "Réactiver" : "Suspendre"}
          </Button>
        }
      />
      <div className="space-y-6 p-6">
        <div className="flex gap-3">
          <StatusBadge status={o.status} />
          <span className="text-muted-foreground text-sm">
            Plan {o.plan} · {o.lastActive}
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Kpi label="Utilisateurs" value={`${o.users}`} icon={Users} />
          <Kpi label="Biens" value={`${o.properties}`} icon={Building2} />
          <Kpi label="Contrats actifs" value="67" icon={FileText} />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Informations du tenant</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>
                Responsable : <b>{o.owner}</b>
              </p>
              <p>Identifiant : {o.id}</p>
              <p>Quota utilisé : {o.usage}%</p>
              <Button variant="outline">Modifier les quotas</Button>
            </CardContent>
          </Card>
          <AuditTable limit={3} />
        </div>
      </div>
    </div>
  );
}
