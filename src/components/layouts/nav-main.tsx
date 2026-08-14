"use client"

import { type LucideIcon } from "lucide-react"

import {
	SidebarGroupContent,
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuBadge,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"

function isNavItemMatch(pathname: string, url: string) {
	return pathname === url || pathname.startsWith(`${url}/`)
}

function getActiveNavUrl(pathname: string, items: { url: string }[]) {
	const matches = items.filter((item) => isNavItemMatch(pathname, item.url))
	return matches.sort((a, b) => b.url.length - a.url.length)[0]?.url
}

export function NavMain({
	items,
}: {
	items: {
		title: string
		url: string
		icon?: LucideIcon
	}[]
	}) {
	const pathname = usePathname()
	const activeUrl = getActiveNavUrl(pathname, items)

	return (
		<SidebarGroup>
			<SidebarGroupContent>
				<SidebarMenu className="gap-2">
					{items.map((item) => (
						<SidebarMenuItem key={item.title}>
							<Link href={item.url}>
								<SidebarMenuButton isActive={item.url === activeUrl} tooltip={item.title}>
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
