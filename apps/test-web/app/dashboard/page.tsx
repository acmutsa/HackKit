import Link from "next/link";
import { getCurrentUser, getHackkit } from "@/lib/runtime";
import { BootstrapOwnerButton } from "./bootstrap-owner-button";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
	const currentUser = await getCurrentUser();
	const hackkit = await getHackkit();
	const userData = await hackkit.userData.getUserData(currentUser.authId);
	const role = currentUser.roleId
		? await hackkit.roles.getRole(currentUser.roleId)
		: null;

	return (
		<main className="min-h-screen px-6 py-10">
			<div className="mx-auto max-w-3xl space-y-8">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
					<p className="text-muted-foreground">
						Role: {role?.name ?? "None"} · Check-in:{" "}
						{currentUser.checkedInAt ? "Yes" : "No"}
					</p>
				</div>

				<section className="space-y-3">
					<h2 className="text-lg font-semibold">Participant</h2>
					<div className="flex flex-wrap gap-3 text-sm">
						<Link href="/schedule" className="text-primary hover:underline">
							Schedule
						</Link>
						<Link href="/pass" className="text-primary hover:underline">
							Event Pass
						</Link>
					</div>
				</section>

				<section className="space-y-3">
					<h2 className="text-lg font-semibold">Volunteer / admin</h2>
					<div className="flex flex-wrap gap-3 text-sm">
						<Link
							href="/admin/events"
							className="text-primary hover:underline"
						>
							Manage events
						</Link>
						<Link
							href="/admin/check-in"
							className="text-primary hover:underline"
						>
							Check-in scanner
						</Link>
					</div>
					<BootstrapOwnerButton />
				</section>

				<section className="space-y-2">
					<h2 className="text-lg font-semibold">User Data</h2>
					<pre className="overflow-auto rounded-lg border bg-muted p-4 text-sm">
						{JSON.stringify(userData, null, 2)}
					</pre>
				</section>
			</div>
		</main>
	);
}
