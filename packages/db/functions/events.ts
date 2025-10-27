import { db, asc, desc, eq, getTableColumns, sum } from "..";
import {
	eventEditType,
	eventInsertType,
	GetAllEventsOptions,
} from "../../../apps/web/src/lib/types/events";
import { events, scans } from "../schema";

export async function createNewEvent(event: eventInsertType) {
	return db
		.insert(events)
		.values({
			...event,
		})
		.returning({
			eventID: events.id,
		});
}

export async function getAllEvents(options?: GetAllEventsOptions) {
	const orderByClause = options?.descending
		? [desc(events.startTime)]
		: [asc(events.startTime)];

	return db.query.events.findMany({
		orderBy: orderByClause,
	});
}

export async function getAllEventsWithScans(options?: GetAllEventsOptions) {
	const orderByClause = options?.descending
		? desc(events.startTime)
		: asc(events.startTime);

	return db
		.select({
			...getTableColumns(events),
			totalScans: sum(scans.count),
		})
		.from(events)
		.leftJoin(scans, eq(events.id, scans.eventID))
		.groupBy(events.id, scans.eventID)
		.orderBy(orderByClause);
}

export async function getEventById(eventId: number) {
	return db.query.events.findFirst({ where: eq(events.id, eventId) });
}

export async function editEvent(eventId: number, options: eventEditType) {
	return db.update(events).set(options).where(eq(events.id, eventId));
}
export async function deleteEvent(eventId: number) {
	return db.delete(events).where(eq(events.id, eventId));
}
