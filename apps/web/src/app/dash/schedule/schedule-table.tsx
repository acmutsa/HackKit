import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
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
		const date =
			event.startTime.getDate() +
			event.startTime.getDay() +
			event.startTime.getFullYear();

		if (days.get(date)) {
			days.get(date)?.push(event);
		} else {
			days.set(date, [event]);
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
function singleEvent(arr : Event[]) {
	return arr[0].startTime;
}

export default function ScheduleTable({
	schedule,
	timezone,
}: ScheduleTableProps) {
	return (
		<div className="mx-auto mt-5 md:w-3/4">
			<Table className="grid w-full gap-12">
				{Array.from(splitByDay(schedule).entries()).map(
					([dateID, arr]): ReactNode => (
						<>
							<TableBody
								key={dateID}
								className="border sm:w-fit md:w-full"
							>
								<TableHeader className="flex w-full justify-center gap-4 p-4">
									<p className="m-1 content-end text-4xl font-bold md:text-7xl">
										{`${formatInTimeZone(singleEvent(arr), timezone, "EEEE")}`}
									</p>
									<div className="m-1 flex gap-1 border-transparent border-l-white md:flex-col md:border">
										<span className="text-3xl md:text-5xl">
											<p>{`${formatInTimeZone(singleEvent(arr), timezone, "dd")}`}</p>
											<p>{`${formatInTimeZone(singleEvent(arr), timezone, "MMM").toUpperCase()}`}</p>
										</span>
									</div>
								</TableHeader>

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
			<TableRow className="flex h-44 items-center justify-around p-4">
				<TableCell className="flex w-1/3 justify-center">
					<p className="p-1 font-bold sm:text-lg md:text-3xl">
						{`${startTimeFormatted} - ${endTimeFormatted}`}
					</p>
				</TableCell>
				<TableCell className="w-1/3 content-center">
					<div className="flex flex-col place-content-center">
						<p className="p-1 text-center font-black sm:text-xs md:text-xl">
							{`${event.title}`}
						</p>
						<div className="flex-col p-1 text-center">
							<p>{`At: ${event?.location}`}</p>
						</div>
					</div>
				</TableCell>

				<TableCell className="flex h-full w-1/3 flex-col content-center items-center justify-center">
					<Badge
						variant={"outline"}
						className="mb-2 h-fit"
						style={{
							borderColor: color,
						}}
					>
						<p className="p-1 text-xs md:text-base">{event.type}</p>
					</Badge>

					<div className="mb-2 hidden overflow-auto md:contents">
						<p className="text-center font-thin sm:text-xs md:text-base">{`${event.description}`}</p>
					</div>
				</TableCell>
			</TableRow>
		</Link>
	);
}
