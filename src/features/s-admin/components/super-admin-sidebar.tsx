"use client";

import Link from "next/link";
import {
  Activity,
  Building2,
  FileChartColumn,
  LayoutDashboard,
  ReceiptText,
  Settings,
  Shield,
  Users,
  Command,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/layouts/nav-main";
import { NavUser } from "@/components/layouts/nav-user";
import { AppName } from "@/components/layouts/app-name";

const items = [
  {
    title: "Tableau de bord",
    url: "/s-admin",
    icon: LayoutDashboard,
  },
  {
    title: "Organisations",
    url: "/s-admin/organizations",
    icon: Building2,
  },
  {
    title: "Utilisateurs",
    url: "/s-admin/users",
    icon: Users,
  },
  {
    title: "Abonnements",
    url: "/s-admin/billing",
    icon: ReceiptText,
  },
  {
    title: "Activité",
    url: "/s-admin/activity",
    icon: Activity,
  },
  {
    title: "Audit & sécurité",
    url: "/s-admin/audit",
    icon: Shield,
  },
  {
    title: "Santé système",
    url: "/s-admin/system",
    icon: FileChartColumn,
  },
  {
    title: "Paramètres",
    url: "/s-admin/settings",
    icon: Settings,
  },
];

export function SuperAdminSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link href="/s-admin">
          <AppName
            teams={{
              name: "Hofeti",
              logo: Command,
              espace: "Espace Super-admin",
            }}
          />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={items} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
