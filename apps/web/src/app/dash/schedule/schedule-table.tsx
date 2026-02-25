import {
	Table,
	TableBody,
	TableCell,
	TableRow,
} from "@/components/shadcn/ui/table";

import { type EventType as Event } from "@/lib/types/events";
import { ReactNode } from "react";
import { formatInTimeZone } from "date-fns-tz";
import c from "config";
import { Badge } from "@/components/shadcn/ui/badge";
import Link from "next/link";

function splitByDay(schedule: Event[]) {
	const days: Map<string, Event[]> = new Map<string, Event[]>();
	schedule.forEach((event) => {
		const day = daysOfWeek[event.startTime.getDay()];
		if (days.get(day)) {
			days.get(day)?.push(event);
		} else {
			days.set(day, [event]);
		}
	});
	return days;
}

type ScheduleTableProps = {
	schedule: Event[];
	timezone: string;
};

const daysOfWeek = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

export default function ScheduleTable({
	schedule,
	timezone,
}: ScheduleTableProps) {
	return (
		<div className="mx-auto mt-5 w-3/4">
			<Table>
				{Array.from(splitByDay(schedule).entries()).map(
					([dayName, arr]): ReactNode => (
						<>
							<h2
								key={dayName}
								className="my-4 text-4xl font-bold"
							>{`${dayName}`}</h2>
							<TableBody key={dayName} className="my-4 border">
								{arr.map(
									(event): ReactNode => (
										<EventRow
											key={event.id}
											event={event}
											userTimeZone={timezone}
										/>
									),
								)}
							</TableBody>
						</>
					),
				)}
			</Table>
		</div>
	);
}

// Needs timezone prop
type eventRowProps = {
	event: Event;
	userTimeZone: string;
};

export function EventRow({ event, userTimeZone }: eventRowProps) {
	// Test Variable
	const isLive = true;
	//const isLive = event.startTime < currentTime && event.endTime > currentTime;
	const startTimeFormatted = formatInTimeZone(
		event.startTime,
		userTimeZone,
		"hh:mm a",
		{
			useAdditionalDayOfYearTokens: true,
		},
	);

	const endTimeFormatted = formatInTimeZone(
		event.endTime,
		userTimeZone,
		"h:mm a",
	);

	const color = (c.eventTypes as Record<string, string>)[event.type];
	const href = `/schedule/${event.id}`;
	return (
		<Link href={href}>
			<TableRow className="flex w-full items-center justify-between p-1 min-h-40 max-h-52">
				<TableCell>
					{isLive ? (
						<p className="outline-offset-4 outline-1 outline outline-blue-500 rounded-xl text-center font-oswald">{`${startTimeFormatted} - ${endTimeFormatted}`}</p>
					) : (
						<p className="font-oswald">{`${startTimeFormatted} - ${endTimeFormatted}`}</p>
					)}
				</TableCell>
				<TableCell className="min-w-52 flex-col">
					<div className="flex flex-col items-center">
						<Badge
							variant={"outline"}
							className="h-fit"
							style={{
								borderColor: color,
							}}
						>
							<p className="text-center text-sm">{event.type}</p>
						</Badge>
						<p className="text-center font-black sm:text-sm md:text-2xl">{`${event.title}`}</p>
					</div>
					<div className="flex-col text-center">
						{event.host != "" ? (
							<p>{`Hosted by: ${event?.host}`}</p>
						) : (
							<></>
						)}
						<p>{`At: ${event?.location}`}</p>
					</div>
				</TableCell>
				<TableCell className="max-w-52">
					<p className="text-right font-thin">{`${event.description}`}</p>
				</TableCell>
			</TableRow>
		</Link>
	);
}
