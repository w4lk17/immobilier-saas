"use client"

import { useRouter } from "next/navigation"
import {
	BadgeCheck,
	ChevronsUpDown,
	LogOut,
	Settings,
	Sparkles,
} from "lucide-react"

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui/avatar"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { formatDateTime } from "@/lib/dateUtils"
import Link from "next/link"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"

export function NavUser() {
	const { user, logout, isLoading } = useAuth()
	const { isMobile } = useSidebar()
	const router = useRouter()

	const [isAlertOpen, setIsAlertOpen] = useState(false);

	if (!user) {
		return null
	}

	const handleLogout = async () => {
		await logout()
		setIsAlertOpen(false);
		router.push("/login")
	}

	const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'U'
	const fullName = `${user.firstName} ${user.lastName}`.trim()

	return (
		<>
			<SidebarMenu>
				<SidebarMenuItem>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<SidebarMenuButton
								size="lg"
								className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
								disabled={isLoading}
							>
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarImage src="" alt={fullName} />
									<AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">{fullName}</span>
									<span className="truncate text-xs">{user.email}</span>
								</div>
								<ChevronsUpDown className="ml-auto size-4" />
							</SidebarMenuButton>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
							side={isMobile ? "bottom" : "right"}
							align="end"
							sideOffset={4}
						>
							<DropdownMenuLabel className="p-0 font-normal">
								<div className="flex flex-col gap-1 px-1 py-1.5 text-left text-sm">
									<Avatar className="h-8 w-8 rounded-lg">
										<AvatarImage src="" alt={fullName} />
										<AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
									</Avatar>
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-semibold">{fullName}</span>
										<span className="truncate text-xs">{user.email}</span>
										<span className="truncate text-xs text-muted-foreground">
											{formatDateTime(user.createdAt)}
										</span>
									</div>
								</div>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuGroup>
								<DropdownMenuItem>
									<Sparkles />
									Upgrade to Pro
								</DropdownMenuItem>
							</DropdownMenuGroup>
							<DropdownMenuSeparator />
							<DropdownMenuGroup>
								<DropdownMenuItem asChild>
									<Link href="/profile" className="flex items-center gap-2 w-full">
										<BadgeCheck />
										Compte
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Settings />
									Paramètres
								</DropdownMenuItem>
							</DropdownMenuGroup>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() => setIsAlertOpen(true)} disabled={isLoading}>
								<LogOut />
								Se déconnecter

							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</SidebarMenuItem>
			</SidebarMenu>

			<Dialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Déconnexion</DialogTitle>
						<DialogDescription>
							Êtes-vous sûr de vouloir vous déconnecter&nbsp;?

						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsAlertOpen(false)}
							disabled={isLoading}
						>
							Annuler
						</Button>
						<Button
							variant="destructive"
							onClick={handleLogout}
							disabled={isLoading}
						>
							{isLoading ? 'Déconnexion...' : 'Déconnexion'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog >
		</>
	)
}