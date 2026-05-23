import Link from "next/link";
import { CheckInScanner } from "@hackkit/ui";
import { CorePermission, requireActorPermission } from "@/lib/actor";
import { hackkit } from "@/lib/hackkit";

export const dynamic = "force-dynamic";

export default async function CheckInPage({
	searchParams,
}: {
	searchParams: { user?: string; qrIssuedAt?: string };
}) {
	await requireActorPermission(CorePermission.UsersCheckIn);

	const targetUser = searchParams.user
		? await hackkit.users.getUser(searchParams.user)
		: null;

	const qrIssuedAt = searchParams.qrIssuedAt
		? new Date(Number(searchParams.qrIssuedAt))
		: null;

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
				<CheckInScanner
					targetUser={targetUser}
					qrIssuedAt={
						qrIssuedAt && !Number.isNaN(qrIssuedAt.getTime())
							? qrIssuedAt
							: null
					}
				/>
			</div>
		</main>
	);
}
