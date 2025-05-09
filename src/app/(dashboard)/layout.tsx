
import { cookies } from "next/headers";

import { AppSidebar } from "@/components/layouts/app-sidebar";
import { NavHeader } from "@/components/layouts/nav-header";
import { ModeSwitcher } from "@/components/shared/ModeSwitcher";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ClientGuard } from "@/features/auth/components/client-guard";

export default  async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {

	const cookieStore = await cookies();
	const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
	
	return (
	<SidebarProvider defaultOpen={defaultOpen}>
		<AppSidebar />
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
						{/* <ThemeSelector /> */}
						{/* <Notification /> */}
						<ModeSwitcher />
					</div>
				</div>
			</header>
				<ClientGuard>{children}</ClientGuard>
		</SidebarInset>
	</SidebarProvider>
	)
}