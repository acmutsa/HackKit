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
		<div className="flex min-h-[60vh] w-full flex-col items-center rounded-xl bg-white backdrop-blur transition dark:bg-white/[0.08]">
			<h1 className="mt-5 text-4xl font-extrabold text-hackathon dark:text-primary">
				{title}
			</h1>
			<h2 className="mb-5 text-sm text-muted-foreground">{subtitle}</h2>
			<div className="flex w-full flex-col items-center gap-y-2 px-2">
				{dup.map((event) => (
					<EventItem key={event.id} event={event} />
				))}
			</div>
		</div>
	);
}

function EventItem({ event }: EventItemProps) {
	return (
		<Link
			target="_blank"
			href={"/schedule/" + event.id}
			className="m-0 w-full p-0"
		>
			<div className="grid h-16 w-full cursor-pointer grid-cols-5 rounded-xl px-2 hover:bg-white/[0.08] md:grid-cols-3">
				<div className="col-span-3 flex h-full flex-col justify-center md:col-span-2">
					<h3 className="font-bold">{event.title}</h3>
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
					<p>{`${formatInTimeZone(
						event.startTime,
						c.hackathonTimezone,
						"h:mm a",
					)} - ${formatInTimeZone(event.endTime, c.hackathonTimezone, "h:mm a")}`}</p>
				</div>
			</div>
		</Link>
	);
}
