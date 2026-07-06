import type * as React from "react";
import { getPageGuards } from "@/lib/runtime";

export const dynamic = "force-dynamic";

export default async function ApprovalLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const guards = await getPageGuards();
	await guards.requireApprovalPendingAccess();
	return children;
}
