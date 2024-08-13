import { format, compareAsc } from "date-fns";
import { EventType } from "@/lib/types/events";
import { Badge } from "@/components/shadcn/ui/badge";
import c from "config";
import {headers} from "next/headers";
import { getClientTimeZone } from "@/lib/utils/client/shared";
import EventItem from "./EventItem";
import { VERCEL_IP_TIMEZONE_HEADER_KEY } from "@/lib/constants/shared";
interface DayProps {
	title: string;
	subtitle: string;
	events: EventType[];
}

export default function Day({ title, subtitle, events }: DayProps) {
		const userTimeZoneHeaderKey = headers().get(
			VERCEL_IP_TIMEZONE_HEADER_KEY,
		);

		const userTimeZone = getClientTimeZone(userTimeZoneHeaderKey);

	return (
		<div className="flex min-h-[60vh] w-full flex-col items-center rounded-xl backdrop-blur transition bg-white dark:bg-white/[0.08] pb-4 md:px-2">
			<h1 className="mt-5 text-4xl font-extrabold text-hackathon dark:text-primary">
				{title}
			</h1>
			<h2 className="mb-5 text-sm text-muted-foreground">{subtitle}</h2>
			<div className="flex w-full flex-col items-center gap-y-2 px-2">
				{events.map((event) => (
					<EventItem key={event.id} event={event} userTimeZone={userTimeZone} />
				))}
			</div>
		</div>
	);
}

