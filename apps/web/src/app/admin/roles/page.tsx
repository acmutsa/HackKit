import { db } from "db";
import RolesManager from "@/components/admin/roles/RolesManager";
import { notFound } from "next/navigation";
import { userHasPermission } from "@/lib/utils/server/admin";
import { PermissionType } from "@/lib/constants/permission";
import { getCurrentUser } from "@/lib/utils/server/user";
import { Suspense } from "react";

export default async function Page() {
	// server-side fetch roles and current user
	const resRoles = await db.query.roles.findMany();
	const user = await getCurrentUser();

	if (!userHasPermission(user, PermissionType.VIEW_ROLES)) return notFound();

	// pass serializable data to client
	return (
		<div className="mx-auto max-w-7xl px-5 pt-40">
			<h1 className="mb-4 text-2xl font-bold">Roles</h1>
			<Suspense
				fallback={
					<div className="py-8 text-center">Loading roles...</div>
				}
			>
				<RolesManager roles={resRoles} currentUser={user} />
			</Suspense>
		</div>
	);
}
