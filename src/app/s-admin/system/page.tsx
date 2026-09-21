"use client";

import { RefreshCw, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  HealthCard,
  PageTitle,
  serviceHealth,
} from "@/features/s-admin/components/super-admin-ui";

export default function Page() {
  return (
    <div>
      <PageTitle
        title="Santé de la plateforme"
        description="Surveillez les services critiques et les incidents."
        action={
          <Button variant="outline">
            <RefreshCw className="mr-2 size-4" />
            Actualiser
          </Button>
        }
      />
      <div className="space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>
              <Server className="mr-2 inline size-5 text-emerald-600" />
              Tous les systèmes sont opérationnels
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {serviceHealth.map((s) => (
              <HealthCard key={s.name} {...s} />
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Incidents et alertes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Aucun incident non traité.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
