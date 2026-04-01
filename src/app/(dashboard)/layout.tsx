import { cookies } from "next/headers";

import { AppSidebar } from "@/components/layouts/app-sidebar";
import { NavHeader } from "@/components/layouts/nav-header";
import { ModeSwitcher } from "@/components/shared/ModeSwitcher";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { RoleGuard } from "@/features/auth/components/role-guard";
import { UserRole } from "@/types/enums";
import { Notification } from "@/components/shared/Notifications";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {

	const cookieStore = await cookies();
	const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

	return (
		<RoleGuard allowedRoles={[UserRole.MANAGER, UserRole.OWNER, UserRole.ADMIN]}>
			<SidebarProvider defaultOpen={defaultOpen}>
				<AppSidebar roleVariant="manager" />
				<SidebarInset>
					<header className="bg-background sticky inset-x-0 top-0 isolate z-10 flex shrink-0 items-center gap-2 border-b">
						<div className="flex h-14 w-full items-center gap-2 px-4">
							<SidebarTrigger className="-ml-1.5" />
							<Separator
								orientation="vertical"
								className="mr-2 data-[orientation=vertical]:h-4"
							/>
							<NavHeader />
							<div className="ml-auto flex items-center gap-2">
								<ModeSwitcher />
								<Notification />
							</div>
						</div>
					</header>
					<div className="container-wrapper section-soft flex flex-1 flex-col pb-6">
						<div className="theme-container flex scroll-mt-20 flex-col">
							<div className="bg-background flex flex-col overflow-hidden rounded-lg m-4 border bg-clip-padding md:flex-1 xl:rounded-xl">
								{children}
							</div>
						</div>
					</div>
				</SidebarInset>
			</SidebarProvider>
		</RoleGuard>
	)
}
