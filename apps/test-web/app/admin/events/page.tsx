import Link from "next/link";
import { EventAdminList } from "@hackkit/ui";
import { CorePermission } from "@hackkit/core";
import { getHackkit, getPageGuards } from "@/lib/runtime";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
	const pageGuards = await getPageGuards();
	const principal = await pageGuards.requirePermission(
		CorePermission.EventsView,
	);
	const hackkit = await getHackkit();
	const events = await hackkit.events.listEvents({
		actorAuthId: principal.user.authId,
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
