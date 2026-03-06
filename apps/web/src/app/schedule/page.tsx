import ScheduleTimeline from "../dash/schedule/schedule-timeline";
import { getAllEvents } from "db/functions";
import { getClientTimeZone } from "@/lib/utils/client/shared";
import { getRequestContext } from "@cloudflare/next-on-pages";

import ScheduleTable from "../dash/schedule/schedule-table";

export default async function Page() {
	const sched = await getAllEvents();
	const { cf } = getRequestContext();
	const userTimeZoneHeaderKey = cf.timezone;
	const userTimeZone = getClientTimeZone(userTimeZoneHeaderKey);
	return (
		<>
			<h1 className="mx-auto my-8 w-11/12 lg:w-3/4 text-5xl font-black">Schedule</h1>
			<ScheduleTable schedule={sched} timezone={userTimeZone}></ScheduleTable>
		</>
	);
}

export const runtime = "edge";
export const revalidate = 60;
