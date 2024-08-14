import { getAllEvents } from "@/lib/queries/events";
import Day from "@/components/schedule/Day";
import c from "config";
export default async function UserScheduleView() {
	const events = await getAllEvents(true);

	const { hackathonName, itteration } = c;

	// Idea for tomorrow: we use tabs to sort our data by day
	return (
		<main className="mx-auto my-4 flex min-h-[70%] w-full max-w-5xl flex-col items-center 2xl:max-w-6xl">
			<Day
				events={events}
				title="Event Schedule"
				subtitle={`${hackathonName} ${itteration}`}
			/>
		</main>
	);
}
