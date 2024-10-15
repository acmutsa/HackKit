import { Suspense } from "react";
import UserScheduleView from "@/components/schedule/UserScheduleView";
import ScheduleTimeline from "./schedule-timeline";
import Loading from "@/components/shared/Loading";
import { getAllEvents } from "db/functions";
import { headers } from "next/headers";
import { VERCEL_IP_TIMEZONE_HEADER_KEY } from "@/lib/constants";
import { getClientTimeZone } from "@/lib/utils/client/shared";
export default async function Page() {
	const sched = await getAllEvents();
	const userTimeZoneHeaderKey = headers().get(VERCEL_IP_TIMEZONE_HEADER_KEY);
	const userTimeZone = getClientTimeZone(userTimeZoneHeaderKey);
	return (
		<>
			<h1 className="mx-auto mt-5 text-center text-5xl font-black">
				Schedule
			</h1>
			<Suspense fallback={<Loading />}>
				{/* <UserScheduleView /> */}
				<ScheduleTimeline schedule={sched} timezone={userTimeZone} />
			</Suspense>
		</>
	);
}

export const runtime = "edge";
export const revalidate = 60;
