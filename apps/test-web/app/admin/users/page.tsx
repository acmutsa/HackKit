import { AdminUsersTable } from "@hackkit/ui";
import { getRuntime } from "@/lib/runtime";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
	const runtime = await getRuntime();
	const actorAuthId = await runtime.getAuthId();
	const users = await runtime.hackkit.admin.listUsers({ actorAuthId });

	return (
		<main className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Users</h1>
				<p className="text-muted-foreground">
					Review registrations, approvals, roles, suspensions, and check-ins.
				</p>
			</div>
			<AdminUsersTable users={users} exportHref="/api/admin/export" />
		</main>
	);
}
