import { events } from "db/schema";
import { InferModel } from "db/drizzle";
import { format, compareAsc } from "date-fns";
import { Badge } from "@/components/shadcn/ui/badge";
import c from "config";
import Link from "next/link";
import { formatInTimeZone } from "date-fns-tz";

interface DayProps {
	title: string;
	subtitle: string;
	events: InferModel<typeof events>[];
}

interface EventItemProps {
	event: InferModel<typeof events>;
}

export default function Day({ title, subtitle, events }: DayProps) {
	let dup = structuredClone(events);
	dup.sort((a, b) => compareAsc(a.startTime, b.startTime));
	return (
		<div className="rounded-xl w-full flex flex-col items-center min-h-[60vh] dark:bg-white/[0.08] bg-white backdrop-blur transition">
			<h1 className="font-extrabold text-4xl mt-5 dark:text-primary text-hackathon">{title}</h1>
			<h2 className="text-muted-foreground text-sm mb-5">{subtitle}</h2>
			<div className="flex flex-col items-center gap-y-2 w-full px-2">
				{dup.map((event) => (
					<EventItem key={event.id} event={event} />
				))}
			</div>
		</div>
	);
}

function EventItem({ event }: EventItemProps) {
	return (
		<Link target="_blank" href={"/schedule/" + event.id} className="m-0 p-0 w-full">
			<div className="grid md:grid-cols-3 grid-cols-5 h-16 w-full hover:bg-white/[0.08] px-2 cursor-pointer rounded-xl">
				<div className="md:col-span-2 col-span-3 flex flex-col h-full justify-center">
					<h3 className="font-bold">{event.title}</h3>
					<div>
						<Badge
							variant={"outline"}
							style={{
								borderColor:
									(c.eventTypes as Record<string, string>)[event.type] || c.eventTypes.Other,
							}}
						>
							{event.type}
						</Badge>
					</div>
				</div>
				<div className="flex items-center justify-end text-sm md:text-md md:col-span-1 col-span-2">
					<p>{`${formatInTimeZone(
						event.startTime,
						c.hackathonTimezone,
						"h:mm a"
					)} - ${formatInTimeZone(event.endTime, c.hackathonTimezone, "h:mm a")}`}</p>
				</div>
			</div>
		</Link>
	);
}
