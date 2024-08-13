import { EventType } from "@/lib/types/events";
import Link from "next/link";
import { Badge } from "../shadcn/ui/badge";
import { formatInTimeZone } from "date-fns-tz";
import c from "config";

export default function EventItem({ event,userTimeZone }: {event:EventType,userTimeZone:string}) {
  const startTimeFormatted = formatInTimeZone(
    event.startTime,
    userTimeZone,
    "EEEE, hh:mm a",
    {
      useAdditionalDayOfYearTokens: true,
    }
  );

  const endTimeFormatted = formatInTimeZone(
		event.endTime,
		userTimeZone,
		"h:mm a",
  );
  const href=`/schedule/${event.id}`
	return (
		<Link
			target="_blank"
			href={href}
			className="m-0 w-full p-0"
		>
			<div className="grid h-24 md:h-16 w-full cursor-pointer grid-cols-5 rounded-xl px-2 hover:bg-white/[0.08] md:grid-cols-3">
				<div className="col-span-3 flex h-full flex-col justify-center md:col-span-2">
					<p className="text-sm md:text-2xl md:font-bold">{event.title}</p>
					<div>
						<Badge
							variant={"outline"}
							style={{
								borderColor:
									(c.eventTypes as Record<string, string>)[
										event.type
									] || c.eventTypes.Other,
							}}
						>
							{event.type}
						</Badge>
					</div>
				</div>
				<div className="md:text-md col-span-2 flex items-center justify-end text-sm md:col-span-1">
					<p>{`${startTimeFormatted} - ${endTimeFormatted}`}</p>
				</div>
			</div>
		</Link>
	);
}
