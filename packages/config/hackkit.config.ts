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
	siteUrl: "http://localhost:3000", // Do not have a trailing slash
	defaultMetaDataDescription: "Your Metadata Description Here",
	rsvpDefaultLimit: 500,
	botName: "HackKit",
	botParticipantRole: "Participant",
	hackathonTimezone: "America/Chicago",
	localUniversityName: schoolOptions[0],
	localUniversitySchoolIDName: "UTSA id (abc123)",
	localUniversityShortIDMaxLength: 6,
	registrationAvailable: false,
	rsvpAvailable: false,
	rsvpLimit: 500,
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
			discordRole: "Group A",
		},
		"Guild A | Group B": {
			discordRole: "Group A",
		},
		"Guild B | Group A": {
			discordRole: "Group B",
		},
		"Guild B | Group B": {
			discordRole: "Group B",
		},
		"Guild C | Group A": {
			discordRole: "Group C",
		},
		"Guild C | Group B": {
			discordRole: "Group C",
		},
		"Guild D | Group A": {
			discordRole: "Group D",
		},
		"Guild D | Group B": {
			discordRole: "Group D",
		},
		"Guild E | Group A": {
			discordRole: "Group E",
		},
		"Guild E | Group B": {
			discordRole: "Group E",
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
		sm: "/img/logo/rh-logo-black.svg",
		md: "/img/logo/rh-logo-black.png",
		lg: "/img/logo/rh-logo-black.png",
		svg: "/img/logo/rh-logo-black.svg",
	},
	dashPaths: {
		dash: {
			Overview: "/dash",
			Schedule: "/dash/schedule",
			"Event Pass": "/dash/pass",
		},
	},
	eventTypes: {
		Meal: "#EBC75F",
		Workshop: "#AC1903",
		Ceremony: "#006b29",
		Social: "#db6e00",
		Other: "#2F291F",
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
	startDate: new Date(new Date(2026, 9, 3).setHours(14, 0, 0, 0)), // October 3, 2026 at 9:00 AM CDT
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
	"/register",
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
