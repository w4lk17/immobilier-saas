"use client"

import * as React from "react"
import {
	BookOpen,
	Bot,
	Building2,
	Command,
	Contact,
	CreditCard,
	FileBox,
	FileChartColumn,
	FileText,
	Hourglass,
	House,
	LayoutDashboard,
	Mail,
	ReceiptTextIcon,
	Settings2,
	User,
	UserPlus,
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

// This is sample data.
const data = {
	user: {
		name: "shadcn",
		email: "m@example.com",
		avatar: "/avatar.png",
	},
	teams: {
		name: "Evil Corp.",
		logo: Command,
		plan: "Free",
	},
	navMain: [
		{
			title: "Tableau de bord",
			url: "/accueil",
			icon: LayoutDashboard,
			isActive: true
		},
		{
			title: "Employee",
			url: "/employees",
			icon: UserRoundCog,
			isActive: false
		},
		{
			title: "Propretaire",
			url: "/owners",
			icon: User,
			isActive: false
		},
		{
			title: "Locataire",
			url: "/tenants",
			icon: Contact,
			isActive: false
		},
		{
			title: "Biens",
			url: "/properties",
			icon: Building2,
			isActive: false
		},
		{
			title: "Locative",
			url: "/rentals",
			icon: House,
			isActive: false
		},
		{
			title: "Contrat",
			url: "/contracts",
			icon: FileText,
			isActive: false
		},
		{
			title: "Payement",
			url: "/payments",
			icon: CreditCard,
			isActive: false
		},
		{
			title: "Payement a venir",
			url: "/rentals",
			icon: ReceiptTextIcon,
			isActive: false
		},
		{
			title: "Depenses",
			url: "/expenses",
			icon: Hourglass,
			isActive: false
		},
		{
			title: "Fichiers",
			url: "/rentals",
			icon: FileBox,
			isActive: false
		},
		{
			title: "Messages",
			url: "/rentals",
			icon: Mail,
			isActive: false
		},
		{
			title: "Rapports",
			url: "/rentals",
			icon: FileChartColumn,
			isActive: false
		},
		
	],
}


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<AppName teams={data.teams} />
				{/* <SidebarGroup className="py-0 group-data-[collapsible=icon]:hidden">
					<SidebarGroupContent>
						<form className="relative">
							<Label htmlFor="search" className="sr-only">
								Search
							</Label>
							<SidebarInput
								id="search"
								placeholder="Search the docs..."
								className="pl-8"
							/>
							<Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
						</form>
					</SidebarGroupContent>
				</SidebarGroup> */}
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}
