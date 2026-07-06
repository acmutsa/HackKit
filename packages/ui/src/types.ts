import type {
	Event,
	EventScan,
	EventTypes,
	PermissionKey,
	ResolvedHackathonSetting,
	Role,
	RoleId,
	Rsvp,
	RsvpSummary,
	SettingKey,
	User,
} from "@hackkit/core";
import type { HackKitActionResult } from "./actions";

export type {
	EventTypeOption,
	EventTypes,
	ResolvedHackathonSetting,
	Rsvp,
	RsvpSummary,
	SettingKey,
	UserDataOptions,
} from "@hackkit/core";

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

export type HackTagFormValues = {
	hackTag: string;
};

export type UserProfileFormValues = {
	firstName: string;
	lastName: string;
	hackTag: string;
	bio?: string;
	pronouns?: string;
	skills: string[];
	isProfileSearchable: boolean;
	discordDisplayHandle?: string;
	profilePhotoUrl?: string;
};

export type HackerRegistrationFormValues = {
	university: string;
	major: string;
	schoolId?: string;
	levelOfStudy: string;
	hackathonsAttended: number;
	softwareExperience: string;
	heardFrom?: string;
	githubUrl?: string;
	linkedInUrl?: string;
	personalWebsiteUrl?: string;
	resumeUrl?: string;
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

export type PreviewEventPassQrInput = {
	rawQr: string;
	eventId?: string;
};

export type PreviewEventPassQrResult = {
	user: User;
	priorScans: EventScan[];
};

export type RecordEventScanInput = {
	eventId: string;
	rawQr: string;
};

export type CheckInUserInput = {
	rawQr: string;
};

export type SetSettingsInput = readonly { key: SettingKey; value: boolean | number }[];

export type ApproveUserInput = {
	targetAuthId: string;
	approved: boolean;
};

export type BanUserInput = {
	targetAuthId: string;
	reason?: string;
};

export type AssignRoleInput = {
	targetAuthId: string;
	roleId: RoleId;
};

export type SetRsvpStatusInput = {
	targetAuthId: string;
	status: Rsvp["status"];
};

export type CreateRoleInput = {
	id?: RoleId;
	name: string;
	position: number;
	permissions: PermissionKey[];
	color?: string;
};

export type UpdateRoleInput = {
	roleId: RoleId;
	name?: string;
	position?: number;
	permissions?: PermissionKey[];
	color?: string;
};

export type HackKitUIActions = {
	completeUserData: (
		values: UserDataFormValues,
	) => Promise<HackKitActionResult>;
	claimHackTag: (
		values: HackTagFormValues,
	) => Promise<HackKitActionResult>;
	updateUserProfile: (
		values: UserProfileFormValues,
	) => Promise<HackKitActionResult<User>>;
	registerHacker: (
		values: HackerRegistrationFormValues,
	) => Promise<HackKitActionResult>;
	createEvent: (
		values: EventFormValues,
	) => Promise<HackKitActionResult<Event>>;
	updateEvent: (
		eventId: string,
		values: EventFormValues,
	) => Promise<HackKitActionResult<Event>>;
	deleteEvent: (eventId: string) => Promise<HackKitActionResult>;
	previewEventPassQr: (
		input: PreviewEventPassQrInput,
	) => Promise<HackKitActionResult<PreviewEventPassQrResult>>;
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
	confirmRsvp: () => Promise<HackKitActionResult<Rsvp>>;
	cancelRsvp: (targetAuthId: string) => Promise<HackKitActionResult<Rsvp>>;
	setRsvpStatus: (
		input: SetRsvpStatusInput,
	) => Promise<HackKitActionResult<Rsvp>>;
	promoteRsvp: (targetAuthId?: string) => Promise<HackKitActionResult<Rsvp>>;
	approveUser: (input: ApproveUserInput) => Promise<HackKitActionResult<User>>;
	banUser: (input: BanUserInput) => Promise<HackKitActionResult>;
	unbanUser: (targetAuthId: string) => Promise<HackKitActionResult>;
	assignRoleToUser: (
		input: AssignRoleInput,
	) => Promise<HackKitActionResult<User>>;
	createRole: (input: CreateRoleInput) => Promise<HackKitActionResult<Role>>;
	updateRole: (input: UpdateRoleInput) => Promise<HackKitActionResult<Role>>;
	deleteRole: (roleId: RoleId) => Promise<HackKitActionResult>;
	listSettings: () => Promise<HackKitActionResult<ResolvedHackathonSetting[]>>;
	setSettings: (
		values: SetSettingsInput,
	) => Promise<HackKitActionResult<ResolvedHackathonSetting[]>>;
	resetSetting: (
		key: SettingKey,
	) => Promise<HackKitActionResult<ResolvedHackathonSetting>>;
};

export type ScheduleListProps = {
	events: Event[];
	eventTypes: EventTypes;
	getEventHref?: (event: Event) => string;
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
	className?: string;
	onDone?: () => void;
};

export type CheckInScannerProps = {
	className?: string;
	onDone?: () => void;
};

export type HackathonSettingsFormProps = {
	settings: ResolvedHackathonSetting[];
	className?: string;
};

export type RsvpConfirmationProps = {
	rsvp: Rsvp | null;
	summary: RsvpSummary;
	className?: string;
};
