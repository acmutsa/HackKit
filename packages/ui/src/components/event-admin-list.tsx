"use client";

import type { Event, EventTypes } from "@hackkit/core";
import { cn } from "../lib/cn";
import { useHackKitNavigation } from "../provider";

export type EventAdminListProps = {
	events: Event[];
	eventTypes: EventTypes;
	className?: string;
};

function getEventTypeLabel(eventTypes: EventTypes, type: string): string {
	return eventTypes.find((option) => option.value === type)?.label ?? type;
}

export function EventAdminList({
	events,
	eventTypes,
	className,
}: EventAdminListProps) {
	const { Link, routes } = useHackKitNavigation();

	if (events.length === 0) {
		return (
			<p className={cn("text-sm text-muted-foreground", className)}>
				No events yet.
			</p>
		);
	}

	return (
		<div className={cn("overflow-x-auto rounded-lg border", className)}>
			<table className="min-w-full text-sm">
				<thead className="bg-muted/50 text-left">
					<tr>
						<th className="px-4 py-3 font-medium">Title</th>
						<th className="px-4 py-3 font-medium">Type</th>
						<th className="px-4 py-3 font-medium">Start</th>
						<th className="px-4 py-3 font-medium">Hidden</th>
						<th className="px-4 py-3 font-medium">Actions</th>
					</tr>
				</thead>
				<tbody>
					{events.map((event) => (
						<tr key={event.id} className="border-t">
							<td className="px-4 py-3">{event.title}</td>
							<td className="px-4 py-3">
								{getEventTypeLabel(eventTypes, event.type)}
							</td>
							<td className="px-4 py-3">
								{event.startTime.toLocaleString()}
							</td>
							<td className="px-4 py-3">
								{event.hidden ? "Yes" : "No"}
							</td>
							<td className="px-4 py-3">
								<div className="flex gap-3">
									<Link
										href={routes.admin.eventEdit(event.id)}
										className="text-primary hover:underline"
									>
										Edit
									</Link>
									<Link
										href={routes.admin.eventScanner(event.id)}
										className="text-primary hover:underline"
									>
										Scanner
									</Link>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
