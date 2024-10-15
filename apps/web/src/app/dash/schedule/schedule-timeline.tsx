"use client";
import { Badge } from "@/components/shadcn/ui/badge";
import { VERCEL_IP_TIMEZONE_HEADER_KEY } from "@/lib/constants";
import { type EventType as Event } from "@/lib/types/events";
import { cn } from "@/lib/utils/client/cn";
import { getClientTimeZone } from "@/lib/utils/client/shared";
import c from "config";
import { formatInTimeZone } from "date-fns-tz";
import { headers } from "next/headers";
import Link from "next/link";
import { ReactNode } from "react";

type ScheduleTimelineProps = {
	schedule: Event[];
	timezone: string;
};
export default function ScheduleTimeline({
	schedule,
	timezone,
}: ScheduleTimelineProps) {
	return (
		<div className="mx-auto mt-5 w-3/4">
			<table className="p-4">
				{schedule.map((e) => (
					<EventRow key={e.id} event={e} userTimeZone={timezone} />
				))}
			</table>
		</div>
	);
}

type EventRowProps = { event: Event; userTimeZone: string };
export function EventRow({ event, userTimeZone }: EventRowProps) {
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

	const currentTime = new Date();
	const isLive = event.startTime < currentTime && event.endTime > currentTime;

	const href = `/schedule/${event.id}`;
	const color = (c.eventTypes as Record<string, string>)[event.type];
	return (
		<Link href={href} legacyBehavior>
			<tr className="cursor-pointer text-center text-xl text-foreground">
				<td className="pr-16">{`${startTimeFormatted} - ${endTimeFormatted}`}</td>
				<td
					className={"relative h-20 w-1"}
					style={{
						background: `radial-gradient(circle, ${color} 0%, hsl(var(--secondary)) 90%)`,
						// backgroundColor: color,
					}}
				>
					{isLive ? (
						<div
							className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full"
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
					<div className="flex items-center gap-x-4">
						<p className="text-left text-3xl">{event.title}</p>
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
