import type { HackkitRuntimeContext } from "../hackkit-context";
import { eventTypeValueSchema } from "../event-types";
import { HackKitError, parseInput } from "../errors";
import { withDomainLog } from "../domain-log";
import { coreModels } from "../models";
import { CorePermission, hasPermission } from "../permissions";
import {
	createEventSchemaFactory,
	deleteEventSchema,
	getEventSchema,
	listEventScansSchema,
	recordEventScanSchema,
	updateEventSchemaFactory,
} from "../schemas";
import type { AuthId, Event, EventScan } from "../types";

export type EventsApiContext = Pick<
	HackkitRuntimeContext,
	| "db"
	| "now"
	| "id"
	| "logger"
	| "eventTypes"
	| "getUserOrThrow"
	| "getRoleOrThrow"
	| "requirePermission"
>;

async function canViewHiddenEvents(
	context: EventsApiContext,
	actorAuthId?: AuthId,
): Promise<boolean> {
	if (!actorAuthId) return false;

	const user = await context.getUserOrThrow(actorAuthId);
	if (!user.roleId) return false;

	const role = await context.getRoleOrThrow(user.roleId);
	return hasPermission(role.permissions, CorePermission.EventsView);
}

function filterVisibleEvents(events: Event[], includeHidden: boolean): Event[] {
	if (includeHidden) return events;
	return events.filter((event) => !event.hidden);
}

export function createEventsApi(context: EventsApiContext) {
	const createEventSchema = createEventSchemaFactory(
		eventTypeValueSchema(context.eventTypes),
	);
	const updateEventSchema = updateEventSchemaFactory(
		eventTypeValueSchema(context.eventTypes),
	);

	const { db, now, id, logger, getUserOrThrow, requirePermission } = context;

	async function getEventOrThrow(eventId: string): Promise<Event> {
		const event = await db.findOne(coreModels.event, { id: eventId });
		if (!event) throw new HackKitError("NOT_FOUND", "Event not found.");
		return event;
	}

	return {
		options: context.eventTypes,

		async listEvents(input?: {
			actorAuthId?: AuthId;
		}): Promise<Event[]> {
			const events = await db.findMany(coreModels.event, {
				orderBy: { field: "startTime", direction: "asc" },
			});
			const includeHidden = await canViewHiddenEvents(
				context,
				input?.actorAuthId,
			);
			return filterVisibleEvents(events, includeHidden);
		},

		async getEvent(input: unknown): Promise<Event | null> {
			const parsed = parseInput(getEventSchema, input);
			const event = await getEventOrThrow(parsed.eventId);
			const includeHidden = await canViewHiddenEvents(
				context,
				parsed.actorAuthId,
			);
			if (event.hidden && !includeHidden) return null;
			return event;
		},

		async createEvent(input: unknown): Promise<Event> {
			const parsed = parseInput(createEventSchema, input);
			return withDomainLog(
				logger,
				"events.create",
				{ actorAuthId: parsed.actorAuthId },
				async () => {
					await requirePermission(
						parsed.actorAuthId,
						CorePermission.EventsCreate,
					);
					const timestamp = now();
					return db.insert(coreModels.event, {
						id: id(),
						title: parsed.title,
						description: parsed.description,
						startTime: parsed.startTime,
						endTime: parsed.endTime,
						location: parsed.location,
						type: parsed.type,
						host: parsed.host,
						hidden: parsed.hidden,
						createdAt: timestamp,
						updatedAt: timestamp,
					});
				},
			);
		},

		async updateEvent(input: unknown): Promise<Event> {
			const parsed = parseInput(updateEventSchema, input);
			return withDomainLog(
				logger,
				"events.update",
				{
					actorAuthId: parsed.actorAuthId,
					eventId: parsed.eventId,
				},
				async () => {
					await requirePermission(
						parsed.actorAuthId,
						CorePermission.EventsUpdate,
					);
					await getEventOrThrow(parsed.eventId);
					const [updated] = await db.update(
						coreModels.event,
						{ id: parsed.eventId },
						{
							title: parsed.title,
							description: parsed.description,
							startTime: parsed.startTime,
							endTime: parsed.endTime,
							location: parsed.location,
							type: parsed.type,
							host: parsed.host ?? undefined,
							hidden: parsed.hidden,
							updatedAt: now(),
						},
					);
					if (!updated)
						throw new HackKitError("NOT_FOUND", "Event not found.");
					return updated;
				},
			);
		},

		async deleteEvent(input: unknown): Promise<void> {
			const parsed = parseInput(deleteEventSchema, input);
			return withDomainLog(
				logger,
				"events.delete",
				{
					actorAuthId: parsed.actorAuthId,
					eventId: parsed.eventId,
				},
				async () => {
					await requirePermission(
						parsed.actorAuthId,
						CorePermission.EventsDelete,
					);
					const deleted = await db.delete(coreModels.event, {
						id: parsed.eventId,
					});
					if (deleted === 0)
						throw new HackKitError("NOT_FOUND", "Event not found.");
				},
			);
		},

		async listEventScans(input: unknown): Promise<EventScan[]> {
			const parsed = parseInput(listEventScansSchema, input);
			await requirePermission(
				parsed.actorAuthId,
				CorePermission.EventsScan,
			);
			await getEventOrThrow(parsed.eventId);
			return db.findMany(coreModels.eventScan, {
				where: {
					eventId: parsed.eventId,
					...(parsed.targetAuthId
						? { authId: parsed.targetAuthId }
						: {}),
				},
				orderBy: { field: "scannedAt", direction: "desc" },
			});
		},

		async recordEventScan(input: unknown): Promise<{
			scan: EventScan;
			priorScans: EventScan[];
			hadPriorScans: boolean;
		}> {
			const parsed = parseInput(recordEventScanSchema, input);
			return withDomainLog(
				logger,
				"events.recordScan",
				{
					actorAuthId: parsed.actorAuthId,
					targetAuthId: parsed.targetAuthId,
					eventId: parsed.eventId,
				},
				async () => {
					await requirePermission(
						parsed.actorAuthId,
						CorePermission.EventsScan,
					);
					await getUserOrThrow(parsed.targetAuthId);
					await getEventOrThrow(parsed.eventId);

					const priorScans = await db.findMany(coreModels.eventScan, {
						where: {
							eventId: parsed.eventId,
							authId: parsed.targetAuthId,
						},
						orderBy: { field: "scannedAt", direction: "desc" },
					});

					const scan = await db.insert(coreModels.eventScan, {
						id: id(),
						eventId: parsed.eventId,
						authId: parsed.targetAuthId,
						scannedByAuthId: parsed.actorAuthId,
						scannedAt: now(),
					});

					return {
						scan,
						priorScans,
						hadPriorScans: priorScans.length > 0,
					};
				},
			);
		},
	};
}
