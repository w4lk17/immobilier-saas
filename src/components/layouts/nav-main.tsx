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
import { usePathname } from "next/navigation"

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
	
	const pathname = usePathname();
	
	return (
		<SidebarGroup>
			<SidebarGroupContent>
				<SidebarMenu className="gap-2">
					{items.map((item) => (
						<SidebarMenuItem key={item.title}>
							<Link href={item.url}>
								<SidebarMenuButton isActive={pathname === item.url} tooltip={item.title}>
									{item.icon && <item.icon />}
									<span>{item.title}</span>
								</SidebarMenuButton>
							{item.title === "Paiement" && (<SidebarMenuBadge>3</SidebarMenuBadge>)}
							{item.title === "Messages" && (<SidebarMenuBadge>2</SidebarMenuBadge>)}
							</Link>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	)
}
