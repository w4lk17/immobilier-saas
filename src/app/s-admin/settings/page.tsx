"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PageTitle } from "@/features/s-admin/components/super-admin-ui";
import { toast } from "sonner";

export default function Page() {
  const [mfa, setMfa] = useState(true);

  return (
    <div>
      <PageTitle
        title="Paramètres globaux"
        description="Configurez l’identité, la sécurité et les fonctionnalités de la plateforme."
      />
      <div className="grid gap-6 p-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Identité de la plateforme</CardTitle>
            <CardDescription>
              Informations visibles par les utilisateurs.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nom de la plateforme</Label>
              <Input defaultValue="Hofeti" />
            </div>
            <div className="space-y-2">
              <Label>Email support</Label>
              <Input defaultValue="support@hofeti.com" />
            </div>
            <Button onClick={() => toast.success("Paramètres enregistrés")}>
              Enregistrer
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sécurité</CardTitle>
            <CardDescription>Règles d’accès globales.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex justify-between">
              <div>
                <b>MFA obligatoire</b>
                <p className="text-muted-foreground text-xs">
                  Pour les comptes administrateurs
                </p>
              </div>
              <Switch checked={mfa} onCheckedChange={setMfa} />
            </div>
            <div className="flex justify-between">
              <div>
                <b>Mode maintenance</b>
                <p className="text-muted-foreground text-xs">
                  Bloquer temporairement les accès
                </p>
              </div>
              <Switch />
            </div>
            <Button
              variant="outline"
              onClick={() => toast.success("Politique enregistrée")}
            >
              Enregistrer la politique
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
