import { AdminOverviewPanel } from "@hackkit/ui";
import { getRuntime } from "@/lib/runtime";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
	const runtime = await getRuntime();
	const actorAuthId = await runtime.getAuthId();
	const overview = await runtime.hackkit.admin.getOverview({ actorAuthId });

	return (
		<main className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Admin Overview</h1>
				<p className="text-muted-foreground">
					Registration, approval, suspension, and check-in summary.
				</p>
			</div>
			<AdminOverviewPanel overview={overview} />
		</main>
	);
}
