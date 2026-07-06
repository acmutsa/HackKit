import { defineHackkitConfig } from "@hackkit/config";
import { CorePermission, type PermissionKey } from "@hackkit/core";
import { syncBetterAuthStorage } from "@hackkit/auth-better-auth";
import {
	createResendEmailProvider,
	createSmtpEmailProvider,
	emailNotificationsPlugin,
	type EmailProvider,
} from "@hackkit/plugin-notifications-email";
import {
	createDiscordHttpRoleSyncProvider,
	discordPlugin,
} from "@hackkit/plugin-discord";
import { teamsPlugin, TeamsPermission } from "@hackkit/plugin-teams";
import { env } from "./env";

const participantPermissions = [] as PermissionKey[];

const adminPermissions = [
	...Object.values(CorePermission),
	...Object.values(TeamsPermission),
] satisfies PermissionKey[];

const shirtSizeOptions = [
	{ value: "s", label: "Small" },
	{ value: "m", label: "Medium" },
	{ value: "l", label: "Large" },
	{ value: "xl", label: "Extra large" },
	{ value: "2xl", label: "2XL" },
	{ value: "3xl", label: "3XL" },
];

const countryOptions = [
	{ value: "us", label: "United States" },
	{ value: "ca", label: "Canada" },
	{ value: "mx", label: "Mexico" },
	{ value: "gb", label: "United Kingdom" },
	{ value: "other", label: "Other" },
];

const schoolOptions = [
	{
		value: "University of Texas at San Antonio",
		label: "University of Texas at San Antonio",
	},
	{
		value: "University of Texas at Austin",
		label: "University of Texas at Austin",
	},
	{ value: "Texas A&M University", label: "Texas A&M University" },
	{ value: "Rice University", label: "Rice University" },
	{ value: "other", label: "Other" },
];

const majorOptions = [
	{ value: "Computer Science", label: "Computer Science" },
	{ value: "Computer Engineering", label: "Computer Engineering" },
	{ value: "Electrical Engineering", label: "Electrical Engineering" },
	{ value: "Data Science", label: "Data Science" },
	{ value: "Design", label: "Design" },
	{ value: "Business", label: "Business" },
	{ value: "other", label: "Other" },
];

const levelsOfStudy = [
	{ value: "Freshman", label: "Freshman" },
	{ value: "Sophomore", label: "Sophomore" },
	{ value: "Junior", label: "Junior" },
	{ value: "Senior", label: "Senior" },
	{ value: "Graduate", label: "Graduate" },
	{ value: "Recent Grad", label: "Recent Grad" },
	{ value: "Other", label: "Other" },
];

const softwareExperienceOptions = [
	{ value: "Beginner", label: "Beginner" },
	{ value: "Intermediate", label: "Intermediate" },
	{ value: "Advanced", label: "Advanced" },
	{ value: "Expert", label: "Expert" },
];

const heardFromOptions = [
	{ value: "Instagram", label: "Instagram" },
	{ value: "Class Presentation", label: "Class presentation" },
	{ value: "Twitter", label: "Twitter" },
	{ value: "Event Site", label: "Event site" },
	{ value: "Friend", label: "Friend" },
	{ value: "Other", label: "Other" },
];

const groups = [
	{
		id: "guild-a",
		label: "Guild A",
		discordRoleName: "Guild A",
	},
	{
		id: "guild-b",
		label: "Guild B",
		discordRoleName: "Guild B",
	},
	{
		id: "guild-c",
		label: "Guild C",
		discordRoleName: "Guild C",
	},
] as const;

function createEmailProvider(): EmailProvider | undefined {
	if (env.emailProvider === "none") return undefined;
	if (env.emailProvider === "resend") {
		if (!env.resendApiKey) {
			throw new Error(
				"RESEND_API_KEY is required when HACKKIT_EMAIL_PROVIDER=resend.",
			);
		}
		return createResendEmailProvider({ apiKey: env.resendApiKey });
	}
	if (!env.smtpHost) {
		throw new Error(
			"SMTP_HOST is required when HACKKIT_EMAIL_PROVIDER=smtp.",
		);
	}
	return createSmtpEmailProvider({
		host: env.smtpHost,
		port: env.smtpPort,
		secure: env.smtpSecure,
		username: env.smtpUsername,
		password: env.smtpPassword,
	});
}

function createDiscordRoleSyncProvider() {
	if (!env.discordBotApiUrl || !env.discordInternalAuthKey) return undefined;
	return createDiscordHttpRoleSyncProvider({
		baseUrl: env.discordBotApiUrl,
		internalAuthKey: env.discordInternalAuthKey,
	});
}

export default defineHackkitConfig({
	databaseUrl: env.databaseUrl,
	defaultCompetitorRoleId: "core.participant",
	groups,
	seedRoles: [
		{
			id: "core.participant",
			name: "Participant",
			position: 10,
			permissions: participantPermissions,
		},
		{
			id: "core.owner",
			name: "Owner",
			position: 0,
			permissions: adminPermissions,
		},
	],
	blob:
		env.blobAdapter === "s3"
			? {
					adapter: "s3",
					bucket: env.s3Bucket!,
					region: env.s3Region!,
					endpoint: env.s3Endpoint,
					accessKeyId: env.s3AccessKeyId,
					secretAccessKey: env.s3SecretAccessKey,
				}
			: {
					adapter: "local",
					baseDir: env.localBlobBaseDir,
				},
	logger: {
		level: env.nodeEnv === "production" ? "warn" : "debug",
	},
	plugins: [
		teamsPlugin(),
		discordPlugin({
			guildId: env.discordGuildId,
			verificationBaseUrl: env.discordVerificationBaseUrl,
			participantRole: {
				id: env.discordParticipantRoleId,
				name: env.discordParticipantRoleName,
			},
			roleSyncProvider: createDiscordRoleSyncProvider(),
		}),
		emailNotificationsPlugin({
			provider: createEmailProvider(),
			from: env.emailFrom ?? "HackKit <notifications@example.com>",
			replyTo: env.emailReplyTo,
			appName: "HackKit",
			baseUrl: env.appUrl,
		}),
	],
	userDataOptions: {
		shirtSize: shirtSizeOptions,
		countryOfResidence: countryOptions,
	},
	hackerRegistrationOptions: {
		schools: schoolOptions,
		majors: majorOptions,
		levelsOfStudy,
		softwareExperience: softwareExperienceOptions,
		heardFrom: heardFromOptions,
	},
	eventTypes: [
		{ value: "meal", label: "Meal", color: "#FFC107" },
		{ value: "workshop", label: "Workshop", color: "#10b981" },
		{ value: "ceremony", label: "Ceremony", color: "#9C27B0" },
		{ value: "social", label: "Social", color: "#2196F3" },
		{ value: "other", label: "Other", color: "#795548" },
	],
	auth: {
		syncStorage: syncBetterAuthStorage,
	},
});
