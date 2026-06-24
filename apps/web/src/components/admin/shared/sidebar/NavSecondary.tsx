"use client";

import * as React from "react";
import { type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/shadcn/ui/sidebar";

export function NavSecondary({
	items,
	...props
}: {
	items: {
		title: string;
		url: string;
		icon: LucideIcon;
	}[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
	const pathname = usePathname();

	const isUrlActive = (itemUrl: string) => {
		if (!pathname) return false;
		return (
			pathname === itemUrl ||
			pathname.startsWith(`${itemUrl}/`) ||
			pathname.startsWith(`${itemUrl}?`)
		);
	};

	return (
		<SidebarGroup {...props}>
			<SidebarGroupContent>
				<SidebarMenu>
					{items.map((item) => {
						const isActive = isUrlActive(item.url);

						return (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton
									asChild
									size="lg"
									className="text-base [&_svg]:h-5 [&_svg]:w-5"
									isActive={isActive}
								>
									<a
										href={item.url}
										target="_blank"
										rel="noopener noreferrer"
									>
										<item.icon />
										<span>{item.title}</span>
									</a>
								</SidebarMenuButton>
							</SidebarMenuItem>
						);
					})}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
