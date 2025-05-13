"use client"

import { type LucideIcon } from "lucide-react"

import {
	SidebarGroupContent,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuBadge,
} from "@/components/ui/sidebar"
import Link from "next/link"

export function NavMain({
	items,
}: {
	items: {
		title: string
		url: string
		icon?: LucideIcon
		isActive?: boolean
	}[]
}) {
	return (
		<SidebarGroup>
			<SidebarGroupContent>
				<SidebarMenu>
					{items.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton isActive={item.isActive} tooltip={item.title}>
								{item.icon && <item.icon />}
								<Link href={item.url}>
									<span>{item.title}</span>
								</Link>
							</SidebarMenuButton>
							{item.title === "Documentation" && (<SidebarMenuBadge>5</SidebarMenuBadge>)}
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	)
}
