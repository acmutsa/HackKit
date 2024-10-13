import { EventType } from "@/lib/types/events";
import Link from "next/link";
import { Badge } from "../shadcn/ui/badge";
import { formatInTimeZone } from "date-fns-tz";
import c from "config";

export default function EventItem({
	event,
	userTimeZone,
}: {
	event: EventType;
	userTimeZone: string;
}) {
	const startTimeFormatted = formatInTimeZone(
		event.startTime,
		userTimeZone,
		"EEEE, hh:mm a",
		{
			useAdditionalDayOfYearTokens: true,
		},
	);

	const endTimeFormatted = formatInTimeZone(
		event.endTime,
		userTimeZone,
		"h:mm a",
	);

	const href = `/schedule/${event.id}`;

	const eventTypeColor =
		(c.eventTypes as Record<string, string>)[event.type] ||
		c.eventTypes.Other;

	return (
		<Link href={href} className="m-0 w-full p-0">
			<div className="flex h-full w-full cursor-pointer flex-col items-center space-y-6 rounded-xl border-[3px] border-b-[6px] border-muted px-2 py-4 lg:flex-row lg:justify-between lg:space-y-0 lg:border-0 lg:px-4 lg:py-7 lg:hover:bg-white/[0.08]">
				<div className="flex h-full w-full flex-col items-center justify-center space-y-4 lg:w-auto lg:flex-row lg:gap-3 lg:space-y-0">
					<h3 className="text-center text-lg font-bold md:text-2xl">
						{event.title}
					</h3>
					<div>
						<Badge
							variant={"outline"}
							style={{
								borderColor: eventTypeColor,
							}}
						>
							<p className="text-sm">{event.type}</p>
						</Badge>
					</div>
				</div>
				<div className="-pt-6 flex h-full flex-row items-center justify-end p-0">
					<p className="lg:text-2zl md:text-lg">{`${startTimeFormatted} - ${endTimeFormatted}`}</p>
				</div>
			</div>
		</Link>
	);
}
