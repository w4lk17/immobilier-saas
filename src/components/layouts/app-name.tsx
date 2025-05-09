"use client"

import * as React from "react"

import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AppName({
	teams,
}: {
	teams: {
		name: string
		logo: React.ElementType
		plan: string
	}
}) {

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton
					size="lg"
					className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
				>
					<div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
						<teams.logo className="size-4" />
					</div>
					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="truncate font-semibold">
							{teams.name}
						</span>
						<span className="truncate text-xs">{teams.plan}</span>
					</div>
					{/* <ChevronsUpDown className="ml-auto" /> */}
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}