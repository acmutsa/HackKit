import { notFound } from "next/navigation";
import { EventAdminForm, toDateTimeLocalValue } from "@hackkit/ui";
import { CorePermission, requireActorPermission } from "@/lib/actor";
import { hackkit } from "@/lib/hackkit";

export const dynamic = "force-dynamic";

export default async function EditEventPage({
	params,
}: {
	params: { id: string };
}) {
	const actor = await requireActorPermission(CorePermission.EventsUpdate);
	const event = await hackkit.events.getEvent({
		eventId: params.id,
		actorAuthId: actor.authId,
	});

	if (!event) notFound();

	return (
		<main className="min-h-screen px-6 py-10">
			<div className="mx-auto max-w-3xl space-y-6">
				<h1 className="text-3xl font-bold tracking-tight">Edit event</h1>
				<EventAdminForm
					eventId={event.id}
					eventTypes={hackkit.events.options}
					defaultValues={{
						title: event.title,
						description: event.description,
						startTime: toDateTimeLocalValue(event.startTime),
						endTime: toDateTimeLocalValue(event.endTime),
						location: event.location,
						type: event.type,
						host: event.host ?? "",
						hidden: event.hidden,
					}}
					submitLabel="Save changes"
				/>
			</div>
		</main>
	);
}
