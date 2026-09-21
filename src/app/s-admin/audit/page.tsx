"use client";

import { LockKeyhole } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  AuditTable,
  PageTitle,
} from "@/features/s-admin/components/super-admin-ui";

export default function Page() {
  return (
    <div>
      <PageTitle
        title="Audit & sécurité"
        description="Journal immuable des actions sensibles et événements d’accès."
      />
      <div className="space-y-6 p-6">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <LockKeyhole className="size-5 text-emerald-600" />
            <div>
              <b>Journal protégé</b>
              <p className="text-muted-foreground text-sm">
                Les événements ne peuvent pas être modifiés depuis l’interface.
              </p>
            </div>
            <Badge variant="outline" className="ml-auto text-emerald-700">
              Actif
            </Badge>
          </CardContent>
        </Card>
        <AuditTable />
      </div>
    </div>
  );
}
