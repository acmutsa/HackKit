"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "ui/components/collapsible";
import {
	SidebarGroup,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "ui/components/sidebar";

export function NavMain({
	items,
}: {
	items: {
		title: string;
		url: string;
		icon: LucideIcon;
		isActive?: boolean;
		items?: {
			title: string;
			url: string;
		}[];
	}[];
}) {
	const pathname = usePathname();

	const isUrlActive = (itemUrl: string) => {
		if (!pathname) return false;
		return (
			pathname === itemUrl ||
			pathname.startsWith(`${itemUrl}/`) ||
			pathname.startsWith(`${itemUrl}?`)
		);
	};

	const isUrlExactActive = (itemUrl: string) => {
		if (!pathname) return false;
		return pathname === itemUrl || pathname.startsWith(`${itemUrl}?`);
	};

	return (
		<SidebarGroup>
			<SidebarMenu>
				{items.map((item) => {
					const hasSubItems = (item.items?.length ?? 0) > 0;
					const isItemActiveSelf = isUrlExactActive(item.url);
					const isAnySubItemActive = item.items?.some((subItem) =>
						isUrlExactActive(subItem.url),
					);
					const shouldBeOpen =
						hasSubItems &&
						(isUrlActive(item.url) || isAnySubItemActive);

					return (
						<Collapsible
							key={`${item.title}-${pathname}`}
							asChild
							defaultOpen={shouldBeOpen}
						>
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									tooltip={item.title}
									size="lg"
									className="text-base [&_svg]:h-5 [&_svg]:w-5"
									isActive={isItemActiveSelf}
								>
									<a href={item.url}>
										<item.icon />
										<span>{item.title}</span>
									</a>
								</SidebarMenuButton>
								{hasSubItems ? (
									<>
										<CollapsibleTrigger asChild>
											<SidebarMenuAction className="mt-0 h-7 w-7 data-[state=open]:rotate-90 [&>svg]:h-6 [&>svg]:w-6">
												<ChevronRight />
											</SidebarMenuAction>
										</CollapsibleTrigger>
										<CollapsibleContent>
											<SidebarMenuSub>
												{item.items?.map((subItem) => {
													const isSubItemActive =
														isUrlActive(
															subItem.url,
														);

													return (
														<SidebarMenuSubItem
															key={subItem.title}
														>
															<SidebarMenuSubButton
																asChild
																isActive={
																	isSubItemActive
																}
																className="py-5 text-sm"
															>
																<a
																	href={
																		subItem.url
																	}
																>
																	<span>
																		{
																			subItem.title
																		}
																	</span>
																</a>
															</SidebarMenuSubButton>
														</SidebarMenuSubItem>
													);
												})}
											</SidebarMenuSub>
										</CollapsibleContent>
									</>
								) : null}
							</SidebarMenuItem>
						</Collapsible>
					);
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}
