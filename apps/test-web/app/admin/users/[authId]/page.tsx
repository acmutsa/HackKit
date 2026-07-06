import { notFound } from "next/navigation";
import { AdminUserDetail } from "@hackkit/ui";
import { getRuntime } from "@/lib/runtime";

export const dynamic = "force-dynamic";

export default async function AdminUserDetailPage({
	params,
}: {
	params: { authId: string };
}) {
	const runtime = await getRuntime();
	const actorAuthId = await runtime.getAuthId();
	const targetAuthId = decodeURIComponent(params.authId);
	const [record, roles] = await Promise.all([
		runtime.hackkit.admin.getUser({ actorAuthId, targetAuthId }),
		runtime.hackkit.roles.listRoles({ actorAuthId }),
	]);

	if (!record) notFound();

	return (
		<main className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">User Detail</h1>
				<p className="text-muted-foreground">
					Account, registration, approval, suspension, and role details.
				</p>
			</div>
			<AdminUserDetail record={record} roles={roles} />
		</main>
	);
}
