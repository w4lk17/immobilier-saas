"use client"

import { usePathname } from "next/navigation"

import {
	NavigationMenu,
} from "@/components/ui/navigation-menu"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { UserRole } from "@/types/enums"
export function NavHeader() {
	const pathname = usePathname()
	const { user } = useAuth();

	return (
		<NavigationMenu className="hidden sm:flex">
			{user?.organizationId && user?.role === UserRole.ADMIN && (
				<span className="flex items-center px-2 text-xs  space-x-4">
					{/* Nom d'organisation/entreprise : affiché à gauche du menu */}
					{/* <span>
						<span className="text-xl font-bold ml-1">{user?.organization.name}</span> */}
						{/* Organisme : <span className="font-semibold ml-1">{user?.organization.name}</span> */}
					{/* </span> */}
					<span>
						Plan : <span className="font-bold ml-1">{user?.organization.plan?.name}</span>
					</span>
				</span>
			)}
			{/* <NavigationMenuList className="gap-2 *:data-[slot=navigation-menu-item]:h-7 **:data-[slot=navigation-menu-link]:py-1 **:data-[slot=navigation-menu-link]:font-medium">
				<NavigationMenuItem>
					<NavigationMenuLink asChild data-active={pathname === "/"}>
						<Link href="/">Home</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink asChild data-active={pathname === "/charts"}>
						<Link href="/charts">Charts</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink asChild data-active={pathname === "/forms"}>
						<Link href="/forms">Forms</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>
			</NavigationMenuList>*/}
		</NavigationMenu> 
	)
}