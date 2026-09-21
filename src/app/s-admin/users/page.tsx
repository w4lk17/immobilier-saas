"use client";

import { Search, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageTitle } from "@/features/s-admin/components/super-admin-ui";

const users = [
  [
    "Awa Diop",
    "awa@hofeti.com",
    "Super-admin",
    "Hofeti Immobilier",
    "Actif",
  ],
  [
    "Marc Martin",
    "marc@horizon.fr",
    "Admin",
    "Agence Horizon",
    "Actif",
  ],
  [
    "Fatou Sow",
    "fatou@teranga.fr",
    "Manager",
    "Cabinet Teranga",
    "Actif",
  ],
  [
    "Jean Kouassi",
    "jean@immoplus.fr",
    "Admin",
    "Immo Plus",
    "Suspendu",
  ],
];

export default function Page() {
  return (
    <div>
      <PageTitle
        title="Utilisateurs & rôles"
        description="Supervisez les comptes et les accès de toute la plateforme."
        action={
          <Button>
            <UserPlus className="mr-2 size-4" />
            Inviter un utilisateur
          </Button>
        }
      />
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between">
              Tous les utilisateurs
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 size-4" />
                <Input placeholder="Rechercher..." className="pl-8" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground border-b text-left">
                  <th className="pb-3">Utilisateur</th>
                  <th className="pb-3">Organisation</th>
                  <th className="pb-3">Rôle</th>
                  <th className="pb-3">Statut</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u[1]} className="border-b last:border-0">
                    <td className="py-4">
                      <b>{u[0]}</b>
                      <p className="text-muted-foreground text-xs">{u[1]}</p>
                    </td>
                    <td>{u[3]}</td>
                    <td>
                      <Badge variant="secondary">{u[2]}</Badge>
                    </td>
                    <td>
                      <Badge
                        variant="outline"
                        className={
                          u[4] === "Actif" ? "text-emerald-700" : "text-red-700"
                        }
                      >
                        {u[4]}
                      </Badge>
                    </td>
                    <td className="text-right">
                      <Button variant="outline" size="sm">
                        Gérer
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
