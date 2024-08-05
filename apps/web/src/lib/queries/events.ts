import { db } from "db";
import { eventInsertType } from "../types/events";
import { events } from "db/schema";

// Server action should also convert the dates to UTC
export function createEventStatement(event: eventInsertType) {
  return db.insert(events).values({
    ...event
  }).returning({
    eventID:events.id
  });
}