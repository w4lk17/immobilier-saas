"use client";

import { CreditCard, DollarSign, Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Kpi, organizations, PageTitle } from "@/features/s-admin/components/super-admin-ui";

export default function Page() {
  return (
    <div>
      <PageTitle
        title="Abonnements & facturation"
        description="Pilotez les plans, revenus et limites des organisations."
        action={
          <Button>
            <Plus className="mr-2 size-4" />
            Nouveau plan
          </Button>
        }
      />
      <div className="space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Kpi
            label="MRR"
            value="4,28 M FCFA"
            change="+15%"
            icon={DollarSign}
          />
          <Kpi
            label="Abonnements actifs"
            value="104"
            icon={CreditCard}
          />
          <Kpi
            label="Périodes d’essai"
            value="18"
            icon={Package}
          />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Abonnements par organisation</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground border-b text-left">
                  <th className="pb-3">Organisation</th>
                  <th className="pb-3">Plan</th>
                  <th className="pb-3">Statut</th>
                  <th className="pb-3">Échéance</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {organizations.map((o) => (
                  <tr key={o.id} className="border-b last:border-0">
                    <td className="py-4 font-medium">{o.name}</td>
                    <td>{o.plan}</td>
                    <td>
                      <Badge variant="outline" className="text-emerald-700">
                        {o.status}
                      </Badge>
                    </td>
                    <td>12 avril 2026</td>
                    <td className="text-right">
                      <Button variant="outline" size="sm">
                        Modifier
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
