import Link from "next/link";
import { notFound } from "next/navigation";
import { EventScanner } from "@hackkit/ui";
import { CorePermission } from "@hackkit/core";
import { getHackkit, getPageGuards } from "@/lib/runtime";

export const dynamic = "force-dynamic";

export default async function EventScannerPage({
	params,
}: {
	params: { eventId: string };
}) {
	const pageGuards = await getPageGuards();
	const principal = await pageGuards.requirePermission(
		CorePermission.EventsScan,
	);
	const hackkit = await getHackkit();
	const event = await hackkit.events.getEvent({
		eventId: params.eventId,
		actorAuthId: principal.user.authId,
	});

	if (!event) notFound();

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
				<EventScanner event={event} />
			</div>
		</main>
	);
}
