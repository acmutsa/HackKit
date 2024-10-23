"use client";
import { Badge } from "@/components/shadcn/ui/badge";
import { type EventType as Event } from "@/lib/types/events";
import { cn } from "@/lib/utils/client/cn";
import c from "config";
import { formatInTimeZone } from "date-fns-tz";
import Link from "next/link";
import { ReactNode } from "react";

const daysOfWeek = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

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

type ScheduleTimelineProps = {
	schedule: Event[];
	timezone: string;
};
export default function ScheduleTimeline({
	schedule,
	timezone,
}: ScheduleTimelineProps) {
	return (
		<div className="w-7/8 mx-auto mt-5 sm:w-3/4">
			<table className="p-4">
				<tbody>
					{Array.from(splitByDay(schedule).entries()).map(
						([dayName, arr]): ReactNode => (
							<>
								<tr
									key={dayName + " title"}
									className="py-16 sm:py-8"
								>
									<td></td>
									<td
										className="w-1"
										style={{
											// background: `radial-gradient(circle, hsl(var(--background)) 0%, hsl(var(--secondary)) 90%)`,
											backgroundColor: `hsl(var(--secondary))`,
										}}
									></td>
									<td>
										<h2 className="ml-8 w-full border-b py-4 text-4xl font-black sm:ml-16 sm:text-6xl">
											{dayName}
										</h2>
									</td>
								</tr>
								{arr?.map(
									(event): ReactNode => (
										<EventRow
											event={event}
											userTimeZone={timezone}
										/>
									),
								)}
							</>
						),
					)}
				</tbody>
			</table>
		</div>
	);
}

type EventRowProps = { event: Event; userTimeZone: string };
export function EventRow({ event, userTimeZone }: EventRowProps) {
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

	const currentTime = new Date();
	const isLive = event.startTime < currentTime && event.endTime > currentTime;

	const href = `/schedule/${event.id}`;
	const color = (c.eventTypes as Record<string, string>)[event.type];
	return (
		<Link href={href} legacyBehavior>
			<tr className="cursor-pointer text-center text-xl text-foreground">
				<td className="pr-8 sm:pr-16">{`${startTimeFormatted} - ${endTimeFormatted}`}</td>
				<td
					className={"relative h-20 w-1"}
					style={{
						background: `radial-gradient(circle, ${color} 0%, hsl(var(--secondary)) 99%)`,
						// backgroundColor: color,
					}}
				>
					{isLive ? (
						<div
							className={cn(
								"pulsatingDot absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full",
							)}
							style={{
								backgroundColor: color,
							}}
						/>
					) : (
						<div
							className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full"
							style={{
								backgroundColor: color,
							}}
						>
							<div className="absolute inset-1 h-2 w-2 rounded-full bg-background"></div>
						</div>
					)}
				</td>
				<td className="pl-16">
					<div className="flex flex-wrap items-center justify-start gap-x-2 text-left text-3xl">
						{event.title}{" "}
						<Badge
							variant={"outline"}
							className="h-fit"
							style={{
								borderColor: color,
							}}
						>
							<p className="text-sm">{event.type}</p>
						</Badge>
					</div>
				</td>
			</tr>
		</Link>
	);
}
