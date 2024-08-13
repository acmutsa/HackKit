import { getAllEvents } from "@/lib/queries/events";
import { EventDataTable } from "@/components/events/shared/EventDataTable";
import Day from "@/components/schedule/Day";
import c from "config";
export default async function UserScheduleView() {

  const events = await getAllEvents(true);
  
  // Idea for tomorrow: we use tabs to sort our data by day
  return (
		<main className="mx-auto my-4 flex min-h-[70%] w-full max-w-5xl 2xl:max-w-6xl flex-col items-center">
			<Day events={events} title="Event Schedule" subtitle={c.hackathonName} />
		</main>
    
  );

}