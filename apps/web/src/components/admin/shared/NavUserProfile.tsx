"use client";

import { ChevronsUpDown } from "lucide-react";

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/shadcn/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/shadcn/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/shadcn/ui/sidebar";
import { UserWithRole } from "db/types";
import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import { DropdownSwitcher } from "@/components/shared/ThemeSwitcher";
import Restricted from "@/components/Restricted";
import { PermissionType } from "@/lib/constants/permission";

export function NavUserProfile({ user }: { user: UserWithRole }) {
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<Avatar className="h-8 w-8">
								<AvatarImage
									src={user.profilePhoto}
									alt={
										`${user.firstName} ${user.lastName}`.trim() ||
										"User avatar"
									}
								/>
								<AvatarFallback>
									{user.firstName.charAt(0) +
										user.lastName.charAt(0)}
								</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">
									{user.firstName + " " + user.lastName}
								</span>
								<span className="truncate text-xs">
									{user.email}
								</span>
							</div>
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
						side={"bottom"}
						align="start"
						sideOffset={4}
					>
						<DropdownMenuGroup>
							<Link href={`/@${user.hackerTag}`}>
								<DropdownMenuItem className="cursor-pointer">
									Profile
								</DropdownMenuItem>
							</Link>
							<Link href={`/dash/pass`}>
								<DropdownMenuItem className="cursor-pointer">
									Event Pass
								</DropdownMenuItem>
							</Link>

							<Restricted
								user={user}
								permissions={PermissionType.ADMIN}
							>
								<Link href={`/admin`}>
									<DropdownMenuItem className="cursor-pointer text-hackathon">
										Admin
									</DropdownMenuItem>
								</Link>
							</Restricted>
							<DropdownMenuSeparator className="bg-[rgb(228,228,231)] dark:bg-[rgb(39,39,42)]" />
							<Link href={`/bug-report`}>
								<DropdownMenuItem className="cursor-pointer">
									Report a Bug
								</DropdownMenuItem>
							</Link>
							<Link href={"/settings"}>
								<DropdownMenuItem className="cursor-pointer">
									Settings
								</DropdownMenuItem>
							</Link>
						</DropdownMenuGroup>
						<DropdownMenuSeparator className="bg-[rgb(228,228,231)] dark:bg-[rgb(39,39,42)]" />
						<DropdownSwitcher />
						<SignOutButton redirectUrl={"/"}>
							<DropdownMenuItem className="cursor-pointer text-red-500 hover:!bg-destructive hover:text-muted">
								Sign out
							</DropdownMenuItem>
						</SignOutButton>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
