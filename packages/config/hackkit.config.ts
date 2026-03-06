import {
	schoolOptions,
	majorOptions,
	levelsOfStudy,
	dietaryRestrictionOptions,
	countries,
	raceOptions,
	genderOptions,
	ethnicityOptions,
	heardFromOptions,
	shirtSizeOptions,
	softwareExperienceOptions,
} from "./constants";

const defaultTheme = "dark";

const c = {
	hackathonName: "HackKit",
	itteration: "I",
	siteUrl: "https://rowdyhacks.org", // Do not have a trailing slash
	defaultMetaDataDescription: "Your Metadata Description Here",
	rsvpDefaultLimit: 500,
	botName: "HackKit",
	botParticipantRole: "Participant",
	hackathonTimezone: "America/Chicago",
	localUniversityName: schoolOptions[0],
	localUniversitySchoolIDName: "UTSA id (abc123)",
	localUniversityShortIDMaxLength: 6,
	registration: {
		schools: schoolOptions,
		majors: majorOptions,
		levelsOfStudy,
		dietaryRestrictionOptions,
		countries,
		raceOptions,
		genderOptions,
		ethnicityOptions,
		heardFromOptions,
		shirtSizeOptions,
		softwareExperienceOptions,
		minRequiredAge: 18,
		hackerTagRegex: /^[a-zA-Z0-9]+$/,
		universityShortIDRegex: new RegExp("\\b[a-zA-Z]{3}\\d{3}\\b"),
		maxNumberOfSkills: 20,
		maxBioSize: 500,
		maxaccommodationNoteSize: 1500,
	},
	zod: {
		defaultSelectPrettyError: {
			errorMap: () => ({ message: "Please select a value" }),
		},
		defaultInputPrettyError: {
			message: "Please enter a value",
		},
	},
	db: {
		uniqueKeyMapper: {
			user_common_data_hacker_tag_unique:
				"The Hacker Tag you selected is taken. Please use another one.",
			user_common_data_email_unique: "Email is already in use",
			users_clerk_id_unique:
				"You have already registered. Please login to your account",
		},
	},
	groups: {
		"Guild A | Group A": {
			discordRole: "Guild A Role",
		},
		"Guild A | Group B": {
			discordRole: "Guild A Role",
		},
		"Guild B | Group A": {
			discordRole: "Guild B Role",
		},
		"Guild B | Group B": {
			discordRole: "Guild B Role",
		},
		"Guild C | Group A": {
			discordRole: "Guild C Role",
		},
		"Guild C | Group B": {
			discordRole: "Guild C Role",
		},
		"Guild D | Group A": {
			discordRole: "Guild D Role",
		},
		"Guild D | Group B": {
			discordRole: "Guild D Role",
		},
		"Guild E | Group A": {
			discordRole: "Guild E Role",
		},
		"Guild E | Group B": {
			discordRole: "Guild E Role",
		},
	},
	issueEmail: "team@rowdyhacks.org",
	links: {
		discord: "https://go.rowdyhacks.org/discord",
		instagram: "https://instagram.com/rowdyhacks",
		facebook: "https://facebook.com/rowdyhacks",
		twitter: "https://twitter.com/rowdyhacks",
		github: "https://github.com/acmutsa",
		guide: "https://go.rowdyhacks.org/discord",
	},
	icon: {
		sm: "/img/logo/hackkit.svg",
		md: "/img/logo/hackkit-md.png",
		lg: "/img/logo/hackkit-lg.png",
		svg: "/img/logo/hackkit.svg",
	},
	dashPaths: {
		dash: {
			Overview: "/dash",
			Schedule: "/dash/schedule",
			"Event Pass": "/dash/pass",
		},
		admin: {
			Overview: "/admin",
			Users: "/admin/users",
			Events: "/admin/events",
			Roles: "/admin/roles",
			Toggles: "/admin/toggles",
			"Hackathon Check-in": "/admin/check-in",
		},
	},
	eventTypes: {
		Meal: "#FFC107",
		Workshop: "#10b981",
		Ceremony: "#9C27B0",
		Social: "#2196F3",
		Other: "#795548",
	},
	days: {
		Saturday: new Date(2023, 6, 15),
	},
	Sunday: new Date(2023, 6, 16),
	maxResumeSizeInBytes: 4194304,
	maxProfilePhotoSizeInBytes: 3145728,
	maxFileSizeInBytes: 4194304,
	eventPassBgImage: "/img/dash/pass/bg.webp",
	noResumeProvidedURL:
		"https://static.acmutsa.org/No%20Resume%20Provided.pdf",
	// Come in and change this date to whenever the hackathon starts
	startDate: new Date(new Date(2024, 1, 24).setHours(9)),
	prettyLocation: "Location of Hackathon",
	featureFlags: {
		core: {
			requireUsersApproval: false,
		},
	},
} as const;

const staticUploads = {
	bucketHost: "/api/upload/resume/view",
	bucketResumeBaseUploadUrl: `${c.hackathonName}/${c.itteration}/resumes`,
} as const;

const discordInviteStatus = ["pending", "accepted", "declined"] as const;
const discordVerificationStatus = [
	"pending",
	"expired",
	"accepted",
	"rejected",
] as const;

// These are routes (pages) which do not require a account / authentication. They are used in the authMiddleware in middleware.ts. Be careful which routes you add here!

const publicRoutes = [
	"/",
	/^\/schedule(\/.*)?$/,
	/^\/@/,
	/^\/user\//,
	"/404",
	"/bugreport",
	/^\/sign-in(\/.*)?$/,
	/^\/sign-up(\/.*)?$/,
];

const defaultRoleId = 2;

export default c;
export {
	defaultTheme,
	discordInviteStatus,
	discordVerificationStatus,
	publicRoutes,
	staticUploads,
	defaultRoleId,
};
