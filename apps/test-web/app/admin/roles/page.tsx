import { CorePermission } from "@hackkit/core";
import { AdminRolesPanel } from "@hackkit/ui";
import { getRuntime } from "@/lib/runtime";

export const dynamic = "force-dynamic";

export default async function AdminRolesPage() {
	const runtime = await getRuntime();
	const actorAuthId = await runtime.getAuthId();
	const roles = await runtime.hackkit.roles.listRoles({ actorAuthId });

	return (
		<main className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Roles</h1>
				<p className="text-muted-foreground">
					Manage admin roles and permissions.
				</p>
			</div>
			<AdminRolesPanel roles={roles} permissions={Object.values(CorePermission)} />
		</main>
	);
}
