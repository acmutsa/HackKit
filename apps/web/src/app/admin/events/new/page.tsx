import NewEventForm from "@/components/events/admin/NewEventForm";

export default function Page() {
	const defaultDate = new Date();

	return (
		<div className="mx-auto max-w-3xl pt-32">
			<div className="grid grid-cols-2">
				<h1 className="text-3xl font-bold tracking-tight">New Event</h1>
			</div>
			<div className="mt-2 rounded-xl border border-muted p-5">
				<NewEventForm defaultDate={defaultDate} />
			</div>
		</div>
	);
}

export const runtime = "edge";
