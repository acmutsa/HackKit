import type { EventTypes } from "@hackkit/core";
import { cn } from "../lib/cn";
import type { ScheduleListProps } from "../types";

function getEventTypeColor(eventTypes: EventTypes, type: string): string {
	return eventTypes.find((option) => option.value === type)?.color ?? "#795548";
}

function getEventTypeLabel(eventTypes: EventTypes, type: string): string {
	return eventTypes.find((option) => option.value === type)?.label ?? type;
}

function formatDateTime(value: Date): string {
	return new Intl.DateTimeFormat(undefined, {
		weekday: "short",
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
	}).format(value);
}

export function ScheduleList({
	events,
	eventTypes,
	className,
}: ScheduleListProps) {
	if (events.length === 0) {
		return (
			<p className={cn("text-sm text-muted-foreground", className)}>
				No events scheduled yet.
			</p>
		);
	}

	return (
		<ul className={cn("space-y-4", className)}>
			{events.map((event) => (
				<li
					key={event.id}
					className="rounded-lg border bg-card p-4 shadow-sm"
				>
					<div className="flex flex-wrap items-start justify-between gap-3">
						<div className="space-y-1">
							<h2 className="text-lg font-semibold">{event.title}</h2>
							<p className="text-sm text-muted-foreground">
								{formatDateTime(event.startTime)} –{" "}
								{formatDateTime(event.endTime)}
							</p>
							<p className="text-sm">{event.location}</p>
						</div>
						<span
							className="rounded-full px-3 py-1 text-xs font-medium text-white"
							style={{
								backgroundColor: getEventTypeColor(
									eventTypes,
									event.type,
								),
							}}
						>
							{getEventTypeLabel(eventTypes, event.type)}
						</span>
					</div>
					{event.host ? (
						<p className="mt-2 text-sm text-muted-foreground">
							Host: {event.host}
						</p>
					) : null}
					<p className="mt-3 text-sm">{event.description}</p>
				</li>
			))}
		</ul>
	);
}
