import type { InferInsert, InferSelect } from "./database";
import type { coreModels } from "./models";

export type AuthId = string;
export type UserId = AuthId;
export type RoleId = string;
export type PermissionKey = `${string}.${string}`;

export type User = InferSelect<typeof coreModels.user>;
export type NewUser = InferInsert<typeof coreModels.user>;
export type UserData = InferSelect<typeof coreModels.userData>;
export type NewUserData = InferInsert<typeof coreModels.userData>;
export type Hacker = InferSelect<typeof coreModels.hacker>;
export type NewHacker = InferInsert<typeof coreModels.hacker>;
export type Rsvp = InferSelect<typeof coreModels.rsvp>;
export type NewRsvp = InferInsert<typeof coreModels.rsvp>;
export type Role = InferSelect<typeof coreModels.role>;
export type NewRole = InferInsert<typeof coreModels.role>;
export type UserBan = InferSelect<typeof coreModels.userBan>;
export type NewUserBan = InferInsert<typeof coreModels.userBan>;
export type Event = InferSelect<typeof coreModels.event>;
export type NewEvent = InferInsert<typeof coreModels.event>;
export type EventScan = InferSelect<typeof coreModels.eventScan>;
export type NewEventScan = InferInsert<typeof coreModels.eventScan>;
export type HackathonSetting = InferSelect<typeof coreModels.setting>;
export type NewHackathonSetting = InferInsert<typeof coreModels.setting>;
export type NotificationIntent = InferSelect<
	typeof coreModels.notificationIntent
>;
export type NewNotificationIntent = InferInsert<
	typeof coreModels.notificationIntent
>;
export type NotificationDeliveryAttempt = InferSelect<
	typeof coreModels.notificationDeliveryAttempt
>;
export type NewNotificationDeliveryAttempt = InferInsert<
	typeof coreModels.notificationDeliveryAttempt
>;

export type AdminUserRecord = {
	user: User;
	userData: UserData | null;
	hacker: Hacker | null;
	rsvp: Rsvp | null;
	role: Role | null;
	ban: UserBan | null;
};

export type PublicUserProfile = {
	user: Pick<
		User,
		| "authId"
		| "firstName"
		| "lastName"
		| "profilePhotoUrl"
		| "hackTag"
		| "bio"
		| "pronouns"
		| "skills"
		| "discordDisplayHandle"
	>;
	hacker: Pick<
		Hacker,
		| "university"
		| "major"
		| "levelOfStudy"
		| "githubUrl"
		| "linkedInUrl"
		| "personalWebsiteUrl"
	> | null;
	role: Role | null;
};

export type AdminOverview = {
	totalUsers: number;
	totalHackers: number;
	approvedUsers: number;
	pendingApprovalUsers: number;
	bannedUsers: number;
	checkedInUsers: number;
	confirmedRsvps: number;
	waitlistedRsvps: number;
	recentSignups: { date: string; count: number }[];
	recentUsers: AdminUserRecord[];
};

export type AdminUserExportRow = {
	authId: string;
	email: string;
	firstName: string;
	lastName: string;
	hackTag: string;
	role: string;
	isApproved: boolean;
	isBanned: boolean;
	rsvpStatus: string;
	rsvpWaitlistPosition: number | "";
	banReason: string;
	checkedInAt: string;
	createdAt: string;
	age: number | "";
	gender: string;
	race: string;
	ethnicity: string;
	shirtSize: string;
	dietaryRestrictions: string;
	accommodationNote: string;
	phoneNumber: string;
	countryOfResidence: string;
	hasAcceptedMLHCodeOfConduct: boolean | "";
	hasSharedDataWithMLH: boolean | "";
	isEmailable: boolean | "";
	university: string;
	major: string;
	schoolId: string;
	levelOfStudy: string;
	hackathonsAttended: number | "";
	softwareExperience: string;
	heardFrom: string;
	githubUrl: string;
	linkedInUrl: string;
	personalWebsiteUrl: string;
	resumeUrl: string;
	group: string;
	registeredAt: string;
};
