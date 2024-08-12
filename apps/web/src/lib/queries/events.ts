import { db,asc,desc } from "db";
import { eventInsertType } from "../types/events";
import { events } from "db/schema";

// Server action should also convert the dates to UTC
export function createNewEvent(event: eventInsertType) {
  return db.insert(events).values({
    ...event
  }).returning({
    eventID:events.id
  });
}

export function getAllEvents(descending = false){

  const orderByClause = descending ? [desc(events.startTime)] : [asc(events.startTime)]
  return db.query.events.findMany({
    orderBy:orderByClause,
  });
}