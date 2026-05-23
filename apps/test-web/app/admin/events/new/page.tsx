import { EventAdminForm, toDateTimeLocalValue } from "@hackkit/ui";
import { CorePermission, requireActorPermission } from "@/lib/actor";
import { hackkit } from "@/lib/hackkit";

export const dynamic = "force-dynamic";

export default async function NewEventPage() {
	await requireActorPermission(CorePermission.EventsCreate);

	return (
		<main className="min-h-screen px-6 py-10">
			<div className="mx-auto max-w-3xl space-y-6">
				<h1 className="text-3xl font-bold tracking-tight">New event</h1>
				<EventAdminForm
					eventTypes={hackkit.events.options}
					defaultValues={{
						startTime: toDateTimeLocalValue(new Date()),
						endTime: toDateTimeLocalValue(
							new Date(Date.now() + 60 * 60 * 1000),
						),
					}}
					submitLabel="Create event"
				/>
			</div>
		</main>
	);
}
