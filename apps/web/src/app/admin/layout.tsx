import FullScreenMessage from "@/components/shared/FullScreenMessage";
import React, { Suspense } from "react";
import ClientToast from "@/components/shared/ClientToast";
import { isUserAdmin } from "../../lib/utils/server/admin";
import { getCurrentUser } from "@/lib/utils/server/user";
import { AdminSidebar } from "@/components/admin/shared/sidebar/AdminSidebar";
import { Separator } from "@/components/shadcn/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/shadcn/ui/sidebar";
import { AdminBreadcrumbs } from "@/components/admin/shared/AdminBreadcrumbs";
import { NavUserProfile } from "@/components/admin/shared/NavUserProfile";

interface AdminLayoutProps {
	children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
	const user = await getCurrentUser();

	if (!isUserAdmin(user)) {
		return (
			<FullScreenMessage
				title="Access Denied"
				message="You are not an admin. If you believe this is a mistake, please contact an administrator."
			/>
		);
	}

	return (
		<>
			<ClientToast duration={2500} position="top-right" />
			<SidebarProvider className="bg-background text-foreground">
				<AdminSidebar user={user} />
				<SidebarInset>
					<header className="flex h-16 shrink-0 items-center gap-2">
						<div className="flex items-center gap-2 px-4">
							<SidebarTrigger className="-ml-1" />
							<Separator
								orientation="vertical"
								className="mr-2 h-4"
							/>
							<AdminBreadcrumbs />
						</div>
						<div className="ml-auto flex pr-4">
							<NavUserProfile user={user} />
						</div>
					</header>
					<div className="flex flex-1 flex-col gap-4 p-4 pt-8">
						<Suspense fallback={<p>Loading...</p>}>
							{children}
						</Suspense>
					</div>
				</SidebarInset>
			</SidebarProvider>
		</>
	);
}
