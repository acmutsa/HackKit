import { db, asc, desc } from "..";
import { eventInsertType } from "../../../apps/web/src/lib/types/events";
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

export function getAllEvents(ascending = true) {
	const orderByClause = ascending
		? [asc(events.startTime)]
		: [desc(events.startTime)];
	return db.query.events.findMany({
		orderBy: orderByClause,
	});
}
