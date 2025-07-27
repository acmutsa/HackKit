import ScheduleTimeline from "./schedule-timeline";
import { getAllEvents } from "db/functions";
import { getClientTimeZone } from "@/lib/utils/client/shared";
import { getRequestContext } from "@cloudflare/next-on-pages";
export default async function Page() {
	const sched = await getAllEvents();
	const { cf } = getRequestContext();
	const userTimeZoneHeaderKey = cf.timezone;
	const userTimeZone = getClientTimeZone(userTimeZoneHeaderKey);
	return (
		<>
			<h1 className="mx-auto my-8 w-3/4 text-8xl font-black">Schedule</h1>
			<ScheduleTimeline schedule={sched} timezone={userTimeZone} />
		</>
	);
}

export const runtime = "edge";
export const revalidate = 60;
