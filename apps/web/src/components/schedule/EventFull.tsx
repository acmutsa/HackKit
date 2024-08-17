import c from "config";
import { Badge } from "@/components/shadcn/ui/badge";
import Balancer from "react-wrap-balancer";
import { formatInTimeZone } from "date-fns-tz";
import { Event } from "db/types";

export default function EventFull({
	event,
}: {
	event: Event;
}) {
	return (
		<div className="relative w-screen">
			<div
				className="absolute top-0 h-[45vh] max-h-[400px] w-screen opacity-10 dark:opacity-50"
				style={{
					backgroundImage: `linear-gradient(180deg, ${
						(c.eventTypes as Record<string, string>)[event.type] ||
						c.eventTypes.Other
					}, transparent)`,
				}}
			/>
			<div className="relative z-10 mx-auto min-h-[calc(100vh-7rem)] w-full max-w-3xl p-2 pt-[15vh]">
				<div className="mb-2 flex items-center gap-x-2">
					<Badge
						className="text-md"
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
					<p className="text-xs font-bold md:text-sm">{`${formatInTimeZone(
						event.startTime,
						c.hackathonTimezone,
						"EEEE MMMM do",
					)}, ${formatInTimeZone(
						event.startTime,
						c.hackathonTimezone,
						"h:mm a",
					)} - ${formatInTimeZone(event.endTime, c.hackathonTimezone, "h:mm a")}`}</p>
				</div>

				<h1 className="mb-2 text-7xl font-black">
					<Balancer>{event.title}</Balancer>
				</h1>
				<h2 className="mb-20 text-lg font-bold">
					Hosted by {event.host}
				</h2>
				<h3 className="mb-2 font-bold">Description:</h3>
				<p>
					<Balancer>{event.description}</Balancer>
				</p>
			</div>
		</div>
	);
}
