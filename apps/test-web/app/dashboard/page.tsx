import { getCurrentUser, hackkit } from "@/lib/hackkit";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
	const currentUser = await getCurrentUser();
	const userData = await hackkit.userData.getUserData(currentUser.authId);

	return (
		<main className="min-h-screen px-6 py-10">
			<div className="mx-auto max-w-3xl space-y-4">
				<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
				<p className="text-muted-foreground">
					User Data submission succeeded.
				</p>
				<pre className="overflow-auto rounded-lg border bg-muted p-4 text-sm">
					{JSON.stringify(userData, null, 2)}
				</pre>
			</div>
		</main>
	);
}
