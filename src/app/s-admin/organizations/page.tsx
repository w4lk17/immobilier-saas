"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrgTable, PageTitle } from "@/features/s-admin/components/super-admin-ui";

export default function Page() {
  return (
    <div>
      <PageTitle
        title="Organisations"
        description="Gérez tous les tenants et leurs quotas."
        action={
          <Button>
            <Plus className="mr-2 size-4" />
            Nouvelle organisation
          </Button>
        }
      />
      <div className="p-6">
        <OrgTable />
      </div>
    </div>
  );
}
