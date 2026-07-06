import type * as React from "react";
import { CorePermission } from "@hackkit/core";
import Link from "next/link";
import { getPageGuards } from "@/lib/runtime";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const guards = await getPageGuards();
	await guards.requireNotBanned();
	await guards.requirePermission(CorePermission.Admin);

	const navItems = [
		{ href: "/admin", label: "Overview" },
		{ href: "/admin/users", label: "Users" },
		{ href: "/admin/roles", label: "Roles" },
		{ href: "/admin/events", label: "Events" },
		{ href: "/admin/check-in", label: "Check-in" },
		{ href: "/admin/settings", label: "Settings" },
	];

	return (
		<div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl gap-8 px-6 py-8 md:grid-cols-[14rem_1fr]">
			<aside className="space-y-4">
				<div>
					<h1 className="text-lg font-semibold">Admin</h1>
					<p className="text-sm text-muted-foreground">
						Hackathon operations
					</p>
				</div>
				<nav className="flex flex-col gap-1 text-sm">
					{navItems.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className="rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
						>
							{item.label}
						</Link>
					))}
				</nav>
			</aside>
			<div className="min-w-0">{children}</div>
		</div>
	);
}
