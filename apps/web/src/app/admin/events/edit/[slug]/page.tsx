import { getEventById } from "db/functions";
import { notFound } from "next/navigation";
import EditEventForm from "@/components/events/admin/EditEventForm";

export default async function EditEventPage({
	params,
}: {
	params: { slug: string };
}) {
	const eventId = parseInt(params.slug);

	if (!eventId) {
		return notFound();
	}

	const event = await getEventById(eventId);

	if (!event) {
		return notFound();
	}

	return (
		<div className="mx-auto max-w-3xl pt-32">
			<div className="grid grid-cols-2">
				<h1 className="text-3xl font-bold tracking-tight">
					Edit Event
				</h1>
			</div>
			<div className="mt-2 rounded-xl border border-muted p-5">
				<EditEventForm {...event} />
			</div>
		</div>
	);
}
