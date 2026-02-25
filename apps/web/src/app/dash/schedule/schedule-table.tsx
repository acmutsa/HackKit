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
	const days: Map<number, Event[]> = new Map<number, Event[]>();
	// Return an asorted array
	schedule.forEach((event) => {
		//const day = daysOfWeek[event.startTime.getDay()];
		// Create unique index for dates
		const date = (event.startTime.getDate() + event.startTime.getDay() + event.startTime.getFullYear());

		if (days.get(date)) {
			days.get(date)?.push(event);
		} else {
			days.set(date, [event]);
		}

	});
	return days;
}


function dateString(arr: Event, timezone: string){
	return formatInTimeZone(arr.startTime, timezone,"M/d");
};

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
		<div className="mx-auto mt-5 md:w-3/4">
			<Table>
				{Array.from(splitByDay(schedule).entries()).map(
					([dateID, arr]): ReactNode => (
						<>
							<h2
								key={dateID}									
								className="my-4 text-4xl font-bold"
							>{`${dateString(arr[0], timezone)}`}</h2>
							<TableBody key={arr[0].id} className="my-4 border">
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
			<TableRow className="flex w-full items-center justify-between p-4 h-44">
				<TableCell className="w-52">
					{isLive ? (
						<p className="outline-offset-4 outline-1 outline outline-blue-500 p-2 sm:text-xs md:text-2xl rounded-xl text-center font-oswald">{`${startTimeFormatted} - ${endTimeFormatted}`}</p>
					) : (
						<p className="font-oswald">{`${startTimeFormatted} - ${endTimeFormatted}`}</p>
					)}
				</TableCell>
				<TableCell className="w-60 flex-col">
					<div className="flex flex-col items-center">
						<Badge
							variant={"outline"}
							className="h-fit"
							style={{
								borderColor: color,
							}}
						>
							<p className="p-1 text-center text-sm">{event.type}</p>
						</Badge>
						<p className="mt-2 text-center font-black sm:text-xs md:text-xl">{`${event.title}`}</p>
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
				<TableCell className="w-52">
					<p className="sm:text-xs md:text-base text-center font-thin">{`${event.description}`}</p>
				</TableCell>
			</TableRow>
		</Link>
	);
}
