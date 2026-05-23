import Link from "next/link";
import { notFound } from "next/navigation";
import { EventScanner } from "@hackkit/ui";
import { CorePermission, requireActorPermission } from "@/lib/actor";
import { hackkit } from "@/lib/hackkit";

export const dynamic = "force-dynamic";

export default async function EventScannerPage({
	params,
	searchParams,
}: {
	params: { eventId: string };
	searchParams: { user?: string; qrIssuedAt?: string };
}) {
	const actor = await requireActorPermission(CorePermission.EventsScan);
	const event = await hackkit.events.getEvent({
		eventId: params.eventId,
		actorAuthId: actor.authId,
	});

	if (!event) notFound();

	const targetUser = searchParams.user
		? await hackkit.users.getUser(searchParams.user)
		: null;

	const priorScans =
		targetUser && searchParams.user
			? await hackkit.events.listEventScans({
					actorAuthId: actor.authId,
					eventId: event.id,
					targetAuthId: searchParams.user,
				})
			: [];

	const qrIssuedAt = searchParams.qrIssuedAt
		? new Date(Number(searchParams.qrIssuedAt))
		: null;

	return (
		<main className="min-h-screen px-6 py-10">
			<div className="mx-auto max-w-3xl space-y-6">
				<div className="flex items-center justify-between gap-4">
					<h1 className="text-2xl font-bold tracking-tight">Event scanner</h1>
					<Link
						href="/admin/events"
						className="text-sm text-primary hover:underline"
					>
						Back to events
					</Link>
				</div>
				<EventScanner
					event={event}
					targetUser={targetUser}
					priorScans={priorScans}
					qrIssuedAt={
						qrIssuedAt && !Number.isNaN(qrIssuedAt.getTime())
							? qrIssuedAt
							: null
					}
					onDone={() => undefined}
				/>
			</div>
		</main>
	);
}
