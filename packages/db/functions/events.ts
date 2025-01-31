import { db, asc, desc, eq } from "..";
import {
	eventEditType,
	eventInsertType,
	getAllEventsOptions,
} from "../../../apps/web/src/lib/types/events";
import { events } from "../schema";

export function createNewEvent(event: eventInsertType) {
	return db
		.insert(events)
		.values({
			...event,
		})
		.returning({
			eventID: events.id,
		});
}

export function getAllEvents(options?: getAllEventsOptions) {
	const orderByClause = options?.descending
		? [desc(events.startTime)]
		: [asc(events.startTime)];

	return db.query.events.findMany({
		orderBy: orderByClause,
	});
}

export function getEventById(eventId: number) {
	return db.query.events.findFirst({ where: eq(events.id, eventId) });
}

export function editEvent(eventId: number, options: eventEditType) {
	return db.update(events).set(options).where(eq(events.id, eventId));
}
