//import ScheduleTimeline from "../dash/schedule/schedule-timeline";
import ScheduleTable from "@/components/schedule/ScheduleTable";
import { getAllEvents } from "db/functions";

export default async function Page() {
	const sched = await getAllEvents();
	return (
		<>
		<h1 className="mx-auto my-8 w-11/12 lg:w-3/4 text-5xl font-black">Schedule</h1>
			<ScheduleTable schedule={sched}/>
		</>
	);
}

export const revalidate = 60;
