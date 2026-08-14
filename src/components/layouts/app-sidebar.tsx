"use client"

import * as React from "react"
import { useAuth } from "@/features/auth/hooks/useAuth"
import {
	Building2,
	Command,
	Contact,
	FileBox,
	FileChartColumn,
	FileText,
	Hourglass,
	House,
	HouseIcon,
	LayoutDashboard,
	Mail,
	ReceiptTextIcon,
	Settings,
	Shield,
	User,
	UserRoundCog,
	Users,
} from "lucide-react"
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar"
import { NavUser } from "./nav-user"
import { AppName } from "./app-name"
import { NavMain } from "./nav-main"
import { getRoleName } from "@/lib/authUtils"

// Define navigation items for each role
const sAdminNavItems = [
	{
		title: "Tableau de bord",
		url: "/admin",
		icon: LayoutDashboard,
	},
	{
		title: "Utilisateurs",
		url: "/admin/users",
		icon: Users,
	},
	{
		title: "Gestionnaires",
		url: "/admin/managers",
		icon: UserRoundCog,
	},
	{
		title: "Locataires",
		url: "/admin/tenants",
		icon: Contact,
	},
	{
		title: "Contrats",
		url: "/admin/contracts",
		icon: FileText,
	},
	// {
	// 	title: "Paramètres",
	// 	url: "/admin/settings",
	// 	icon: Settings,
	// },
	// {
	// 	title: "Système",
	// 	url: "/admin/system",
	// 	icon: Shield,
	// },
	// {
	// 	title: "Rapports",
	// 	url: "/manager/reports",
	// 	icon: FileChartColumn,
	// },
];

const adminNavItems = [
	{
		title: "Tableau de bord",
		url: "/admin",
		icon: LayoutDashboard,
	},
	{
		title: "Propriétés",
		url: "/admin/properties",
		icon: Building2,
	},
	{
		title: "Locaux",
		url: "/admin/rentals",
		icon: HouseIcon,
	},
	{
		title: "Locataires",
		url: "/admin/tenants",
		icon: Contact,
	},
	{
		title: "Contrats",
		url: "/admin/contracts",
		icon: FileText,
	},
	{
		title: "Factures",
		url: "/admin/invoices",
		icon: ReceiptTextIcon,
	},

];

const managerNavItems = [
	{
		title: "Tableau de bord",
		url: "/manager",
		icon: LayoutDashboard,
	},
	{
		title: "Propriétaires",
		url: "/manager/owners",
		icon: User,
	},
	{
		title: "Biens",
		url: "/manager/properties",
		icon: Building2,
	},
	{
		title: "Locataires",
		url: "/manager/tenants",
		icon: Contact,
	},
	{
		title: "Contrats",
		url: "/manager/contracts",
		icon: FileText,
	},
	{
		title: "Factures",
		url: "/manager/invoices",
		icon: ReceiptTextIcon,
	},
	{
		title: "Dépenses",
		url: "/manager/expenses",
		icon: Hourglass,
	},
	// {
	// 	title: "Rapports",
	// 	url: "/manager/reports",
	// 	icon: FileChartColumn,
	// },
];

const tenantNavItems = [
	{
		title: "Tableau de bord",
		url: "/tenant-portal",
		icon: LayoutDashboard,
	},
	{
		title: "Contrats",
		url: "/tenant-portal/my-contracts",
		icon: FileText,
	},
	{
		title: "Factures",
		url: "/tenant-portal/my-invoices",
		icon: ReceiptTextIcon,
	},
	// {
	// 	title: "Maintenance",
	// 	url: "/tenant-portal/maintenance",
	// 	icon: House,
	// },
	// {
	// 	title: "Messages",
	// 	url: "/tenant-portal/messages",
	// 	icon: Mail,
	// },
	// {
	// 	title: "Documents",
	// 	url: "/tenant-portal/documents",
	// 	icon: FileBox,
	// },
];

const ownerNavItems = [
	{
		title: "Tableau de bord",
		url: "/owner-portal",
		icon: LayoutDashboard,
	},
	{
		title: "Mes Biens",
		url: "/owner-portal/my-properties",
		icon: Building2,
	},
	{
		title: "Mes Contrats",
		url: "/owner-portal/my-contracts",
		icon: FileText,
	},
	{
		title: "Factures Reçues",
		url: "/owner-portal/my-invoices",
		icon: ReceiptTextIcon,
	},
	{
		title: "Mes Dépenses",
		url: "/owner-portal/my-expenses",
		icon: Hourglass,
	},
	{
		title: "Rapports",
		url: "/owner-portal/reports",
		icon: FileChartColumn,
	},
];

// Get navigation items based on roleVariant/role
function getNavItems(roleVariant?: "s_admin" | "admin" | "manager" | "tenant" | "owner") {
	switch (roleVariant) {
		case "s_admin":
			return sAdminNavItems;
		case "admin":
			return adminNavItems;
		case "tenant":
			return tenantNavItems;
		case "owner":
			return ownerNavItems;
		case "manager":
		default:
			return managerNavItems;
	}
}

export interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
	roleVariant?: "s_admin" | "admin" | "manager" | "tenant" | "owner";
}

export function AppSidebar({
	roleVariant = "manager",
	...props
}: AppSidebarProps) {
	const { user } = useAuth();

	// If variant is not explicitly provided, detect from user role
	const detectedVariant: "s_admin" | "admin" | "manager" | "tenant" | "owner" = React.useMemo(() => {
		if (roleVariant !== "manager") return roleVariant as "s_admin" | "admin" | "manager" | "tenant" | "owner";

		// Auto-detect based on user role when roleVariant is "manager" (default)
		if (!user?.role) return "manager";

		switch (user.role) {
			case "S_ADMIN":
				return "s_admin";
			case "ADMIN":
				return "admin";
			case "TENANT":
				return "tenant";
			case "OWNER":
				return "owner";
			case "MANAGER":
			default:
				return "manager";
		}
	}, [user?.role, roleVariant]);

	const navItems = getNavItems(detectedVariant);

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<AppName teams={{
					name: "Hofeti",
					logo: Command,
					espace: `Espace ${user?.role === "ADMIN" ? "Propriétaire" : getRoleName(user?.role ?? "MANAGER")}`,

				}} />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={navItems} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}
