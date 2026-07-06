import type { AdminUserRecord } from "@hackkit/core";
import type * as React from "react";
import { cn } from "./cn";

export function fullName(record: AdminUserRecord): string {
	return `${record.user.firstName} ${record.user.lastName}`.trim();
}

export function formatDateTime(date: Date): string {
	return new Intl.DateTimeFormat("en", {
		dateStyle: "medium",
		timeStyle: "short",
	}).format(date);
}

export function BadgeText({
	children,
	tone = "muted",
}: {
	children: React.ReactNode;
	tone?: "muted" | "success" | "danger" | "info";
}) {
	return (
		<span
			className={cn(
				"inline-flex rounded-full px-2 py-1 text-xs font-medium",
				tone === "muted" && "bg-muted text-muted-foreground",
				tone === "success" && "bg-green-100 text-green-800",
				tone === "danger" && "bg-red-100 text-red-800",
				tone === "info" && "bg-blue-100 text-blue-800",
			)}
		>
			{children}
		</span>
	);
}
