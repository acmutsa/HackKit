import Link from "next/link";
import { EventAdminList } from "@hackkit/ui";
import { CorePermission, requireActorPermission } from "@/lib/actor";
import { hackkit } from "@/lib/hackkit";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
	const actor = await requireActorPermission(CorePermission.EventsView);
	const events = await hackkit.events.listEvents({
		actorAuthId: actor.authId,
	});

	return (
		<main className="min-h-screen px-6 py-10">
			<div className="mx-auto max-w-5xl space-y-6">
				<div className="flex flex-wrap items-center justify-between gap-4">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">Events</h1>
						<p className="text-muted-foreground">
							Manage the hackathon schedule.
						</p>
					</div>
					<Link
						href="/admin/events/new"
						className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
					>
						New event
					</Link>
				</div>
				<EventAdminList
					events={events}
					eventTypes={hackkit.events.options}
				/>
			</div>
		</main>
	);
}
