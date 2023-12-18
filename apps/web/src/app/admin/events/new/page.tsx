import NewEventForm from "@/components/dash/admin/events/NewEventForm";

export default function Page() {
	const defaultDate = new Date();

	return (
		<div className="mx-auto max-w-3xl">
			<div className="grid grid-cols-2">
				<h1 className="text-3xl font-bold tracking-tight">New Event</h1>
			</div>
			<div className="rounded-xl border border-muted mt-2 p-5">
				<NewEventForm defaultDate={defaultDate} />
			</div>
		</div>
	);
}

export const runtime = "edge";
