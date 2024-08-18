import { db, asc, desc } from "..";
import { eventInsertType } from "../../../apps/web/src/lib/types/events";
import { events } from "../schema";

// Server action should also convert the dates to UTC
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
// Throw in some options for this later on
export function getAllEvents(descending = false) {
	const orderByClause = descending
		? [desc(events.startTime)]
		: [asc(events.startTime)];
	return db.query.events.findMany({
		orderBy: orderByClause,
	});
}
