"use client";

import { Activity, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageTitle } from "@/features/s-admin/components/super-admin-ui";

const events = [
  ["Création de bien", "Hofeti Immobilier", "Awa Diop", "Il y a 3 min"],
  ["Document exporté", "Agence Horizon", "Marc Martin", "Il y a 18 min"],
  ["Contrat signé", "Cabinet Teranga", "Fatou Sow", "Il y a 1 h"],
  ["Utilisateur ajouté", "Immo Plus", "Jean Kouassi", "Il y a 2 h"],
];

export default function Page() {
  return (
    <div>
      <PageTitle
        title="Activité plateforme"
        description="Suivez l’activité métier de tous les tenants."
        action={
          <Button variant="outline">
            <Download className="mr-2 size-4" />
            Exporter CSV
          </Button>
        }
      />
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>
              <Activity className="mr-2 inline size-5" />
              Événements récents
            </CardTitle>
          </CardHeader>
          <CardContent>
            {events.map(([action, org, user, time]) => (
              <div
                key={`${action}-${user}-${time}`}
                className="flex items-center gap-4 border-b p-4 last:border-0"
              >
                <Activity className="text-primary size-4" />
                <div className="flex-1">
                  <b>{action}</b>
                  <p className="text-muted-foreground text-xs">
                    {user} · {org}
                  </p>
                </div>
                <span className="text-muted-foreground text-xs">{time}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
