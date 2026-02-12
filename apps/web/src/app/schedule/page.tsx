import ScheduleTimeline from "../dash/schedule/schedule-timeline";
import { getAllEvents } from "db/functions";
import { getClientTimeZone } from "@/lib/utils/client/shared";
import c from "config";

export default async function Page() {
	const sched = await getAllEvents();
	const userTimeZone = getClientTimeZone(c.hackathonTimezone);
	return (
		<>
			<h1 className="mx-auto my-8 w-3/4 text-8xl font-black">Schedule</h1>
			<ScheduleTimeline schedule={sched} timezone={userTimeZone} />
		</>
	);
}

export const revalidate = 60;
