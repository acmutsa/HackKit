import type { Event, EventScan, EventTypes, User } from "@hackkit/core";
import type { HackKitActionResult } from "./actions";

export type { EventTypeOption, EventTypes, UserDataOptions } from "@hackkit/core";

export type UserDataFormValues = {
	age: number;
	gender: string;
	race: string;
	ethnicity: string;
	shirtSize: string;
	dietaryRestrictions: string[];
	accommodationNote?: string;
	phoneNumber?: string;
	countryOfResidence?: string;
	hasAcceptedMLHCodeOfConduct: boolean;
	hasSharedDataWithMLH: boolean;
	isEmailable: boolean;
};

export type EventFormValues = {
	title: string;
	description: string;
	startTime: string;
	endTime: string;
	location: string;
	type: string;
	host: string;
	hidden: boolean;
};

export type RecordEventScanInput = {
	eventId: string;
	targetAuthId: string;
	qrIssuedAt: Date;
};

export type CheckInUserInput = {
	targetAuthId: string;
	qrIssuedAt: Date;
};

export type HackKitUIActions = {
	completeUserData: (
		values: UserDataFormValues,
	) => Promise<HackKitActionResult>;
	createEvent: (
		values: EventFormValues,
	) => Promise<HackKitActionResult<Event>>;
	updateEvent: (
		eventId: string,
		values: EventFormValues,
	) => Promise<HackKitActionResult<Event>>;
	deleteEvent: (eventId: string) => Promise<HackKitActionResult>;
	recordEventScan: (
		input: RecordEventScanInput,
	) => Promise<
		HackKitActionResult<{
			scan: EventScan;
			priorScans: EventScan[];
			hadPriorScans: boolean;
		}>
	>;
	checkInUser: (
		input: CheckInUserInput,
	) => Promise<HackKitActionResult<User>>;
	clearCheckIn: (targetAuthId: string) => Promise<HackKitActionResult<User>>;
};

export type ScheduleListProps = {
	events: Event[];
	eventTypes: EventTypes;
	className?: string;
};

export type EventPassProps = {
	user: User;
	qrPayload: string;
	onRefreshQr: () => void;
	className?: string;
};

export type EventAdminFormProps = {
	eventTypes: EventTypes;
	defaultValues?: Partial<EventFormValues>;
	eventId?: string;
	submitLabel?: string;
	successRedirectTo?: string;
	className?: string;
};

export type EventScannerProps = {
	event: Event;
	targetUser: User | null;
	priorScans: EventScan[];
	qrIssuedAt: Date | null;
	className?: string;
	onDone?: () => void;
};

export type CheckInScannerProps = {
	targetUser: User | null;
	qrIssuedAt: Date | null;
	className?: string;
	onDone?: () => void;
};
