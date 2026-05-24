import { CheckInScanner } from "@hackkit/ui";
import { CorePermission } from "@hackkit/core";
import Link from "next/link";
import { getPageGuards } from "@/lib/runtime";

export const dynamic = "force-dynamic";

export default async function CheckInPage() {
	const pageGuards = await getPageGuards();
	await pageGuards.requirePermission(CorePermission.UsersCheckIn);

	return (
		<main className="min-h-screen px-6 py-10">
			<div className="mx-auto max-w-3xl space-y-6">
				<div className="flex items-center justify-between gap-4">
					<h1 className="text-2xl font-bold tracking-tight">
						Hackathon check-in
					</h1>
					<Link
						href="/dashboard"
						className="text-sm text-primary hover:underline"
					>
						Dashboard
					</Link>
				</div>
				<CheckInScanner />
			</div>
		</main>
	);
}
