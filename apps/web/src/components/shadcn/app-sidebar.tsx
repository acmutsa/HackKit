"use client";

import * as React from "react";
import { NavMain } from "@/components/shadcn/nav-main";
import { NavSecondary } from "@/components/shadcn/nav-secondary";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/shadcn/ui/sidebar";
import c from "config";
import Image from "next/image";
import Link from "next/link";
import { UserWithRole } from "db/types";
import { userHasPermission } from "@/lib/utils/server/admin";
import { adminSidebarData as data } from "@/lib/constants/admin";

export function AppSidebar({
	user,
	...props
}: React.ComponentProps<typeof Sidebar> & {
	user: UserWithRole;
}) {
	const mainItems = data.navMain.filter((item) =>
		item.permission ? userHasPermission(user, item.permission) : true,
	);
	const secondaryItems = data.navSecondary.filter((item) =>
		item.permission ? userHasPermission(user, item.permission) : true,
	);

	return (
		<Sidebar variant="inset" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<div className="flex items-center gap-x-4">
								<Link
									href={"/"}
									className="mr-5 flex items-center gap-x-1"
								>
									<Image
										src={c.icon.svg}
										alt={c.hackathonName + " Logo"}
										width={32}
										height={32}
									/>
									<div className="h-[45%] w-[2px] rotate-[25deg] bg-muted-foreground" />
									<h2 className="text-lg font-bold tracking-tight">
										Admin
									</h2>
								</Link>
							</div>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={mainItems} />
				{/* <NavProjects projects={data.projects} /> */}
				<NavSecondary items={secondaryItems} className="mt-auto" />
			</SidebarContent>
			<SidebarFooter>
				<div className="rounded-md border border-sidebar-border px-3 py-2 text-center text-xs text-muted-foreground">
					<span className="uppercase tracking-wide">
						Powered by HackKit
					</span>
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}
