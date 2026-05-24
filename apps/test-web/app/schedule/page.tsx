import { ScheduleList } from "@hackkit/ui";
import { getHackkit } from "@/lib/runtime";

export const dynamic = "force-dynamic";

export default async function SchedulePage() {
	const hackkit = await getHackkit();
	const events = await hackkit.events.listEvents();

	return (
		<main className="min-h-screen px-6 py-10">
			<div className="mx-auto max-w-3xl space-y-6">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
					<p className="text-muted-foreground">
						Public agenda for the hackathon.
					</p>
				</div>
				<ScheduleList events={events} eventTypes={hackkit.events.options} />
			</div>
		</main>
	);
}
