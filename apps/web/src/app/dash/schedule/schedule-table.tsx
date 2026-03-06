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
function eventDateString(arr: Event[], timezone: string) {
	const date = formatInTimeZone(arr[0].startTime, timezone, "PPPP");
	const retString = date.substring(0, date.length - 6);
	return retString;
}

export default function ScheduleTable({
	schedule,
	timezone,
}: ScheduleTableProps) {
	return (
		<div className="mx-auto mt-5 w-[99vw] lg:w-3/4">
			<Table className="grid gap-6">
				{Array.from(splitByDay(schedule).entries()).map(
					([dateID, arr]): ReactNode => (
						<>
							<TableBody key={dateID} className="border">
								<TableHeader className="flex justify-start">
									<span className="m-1 p-4 text-center text-xl font-bold lg:text-4xl">
										<p>{`${eventDateString(arr, timezone)}`}</p>
									</span>
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
	const href = "/schedule/" + event.id;
	return (
		<TableRow
			key={event.id}
			className="flex flex-col justify-around bg-transparent px-4 pb-1 odd:bg-white/5"
		>
			<TableCell className="flex place-items-center">
				<div className="w-1/3">
					<Link href={href}>
						<span className="flex font-semibold">
							<p>{`${startTimeFormatted}`}</p>
							<p className="hidden sm:contents">
								{`- ${endTimeFormatted}`}
							</p>
						</span>
					</Link>
				</div>
				<div className="flex w-2/3 place-items-center justify-end gap-2">
					<Badge
						variant={"outline"}
						className="flex justify-center text-center lg:w-[5rem]"
						style={{
							borderColor: color,
						}}
					>
						<p className="text-[0.5rem] lg:text-xs">{event.type}</p>
					</Badge>

					<Link href={href}>
						<p className="p-1 text-right font-semibold lg:text-xl">
							{`${event.title}`}
						</p>
					</Link>
				</div>
			</TableCell>
			<TableCell>
				<div className="w-full truncate text-ellipsis text-right">
					<p className="hidden lg:contents">{`${event.description}`}</p>
				</div>
			</TableCell>
		</TableRow>
	);
}
