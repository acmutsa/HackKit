import { defineModel, field } from "./database";

export const coreModels = {
	user: defineModel("core.user", {
		fields: {
			authId: field.string().primaryKey(),
			email: field.string().unique(),
			firstName: field.string(),
			lastName: field.string(),
			profilePhotoUrl: field.string().optional(),
			hackTag: field.string().optional().unique(),
			roleId: field
				.string()
				.optional()
				.references("core.role", "id", { onDelete: "setNull" }),
			isApproved: field.boolean().default(false),
			checkedInAt: field.date().optional(),
			createdAt: field.date().defaultNow(),
			updatedAt: field.date().defaultNow(),
		},
		indexes: [["email"], ["hackTag"], ["roleId"], ["createdAt"]],
	}),
	userData: defineModel("core.userData", {
		fields: {
			authId: field
				.string()
				.primaryKey()
				.references("core.user", "authId", { onDelete: "cascade" }),
			age: field.integer(),
			gender: field.string(),
			race: field.string(),
			ethnicity: field.string(),
			shirtSize: field.string(),
			dietaryRestrictions: field.json<string[]>().default([]),
			accommodationNote: field.string().optional(),
			phoneNumber: field.string().optional(),
			countryOfResidence: field.string().optional(),
			hasAcceptedMLHCodeOfConduct: field.boolean(),
			hasSharedDataWithMLH: field.boolean(),
			isEmailable: field.boolean(),
			completedAt: field.date().defaultNow(),
			updatedAt: field.date().defaultNow(),
		},
	}),
	hacker: defineModel("core.hacker", {
		fields: {
			authId: field
				.string()
				.primaryKey()
				.references("core.user", "authId", { onDelete: "cascade" }),
			university: field.string(),
			major: field.string(),
			schoolId: field.string().optional(),
			levelOfStudy: field.string(),
			hackathonsAttended: field.integer(),
			softwareExperience: field.string(),
			heardFrom: field.string().optional(),
			githubUrl: field.string().optional(),
			linkedInUrl: field.string().optional(),
			personalWebsiteUrl: field.string().optional(),
			resumeUrl: field.string().optional(),
			group: field.string().optional(),
			registeredAt: field.date().defaultNow(),
			updatedAt: field.date().defaultNow(),
		},
		indexes: [["registeredAt"]],
	}),
	role: defineModel("core.role", {
		fields: {
			id: field.string().primaryKey().defaultId(),
			name: field.string().unique(),
			position: field.integer(),
			permissions: field.json<`${string}.${string}`[]>().default([]),
			color: field.string().optional(),
			createdAt: field.date().defaultNow(),
			updatedAt: field.date().defaultNow(),
		},
		indexes: [["position"]],
	}),
	userBan: defineModel("core.userBan", {
		fields: {
			authId: field
				.string()
				.primaryKey()
				.references("core.user", "authId", { onDelete: "cascade" }),
			reason: field.string().optional(),
			bannedByAuthId: field.string().references("core.user", "authId"),
			createdAt: field.date().defaultNow(),
		},
	}),
	event: defineModel("core.event", {
		fields: {
			id: field.string().primaryKey().defaultId(),
			title: field.string(),
			startTime: field.date(),
			endTime: field.date(),
			location: field.string().default("TBD"),
			description: field.string(),
			type: field.string(),
			host: field.string().optional(),
			hidden: field.boolean().default(false),
			createdAt: field.date().defaultNow(),
			updatedAt: field.date().defaultNow(),
		},
		indexes: [["startTime"], ["type"], ["hidden"]],
	}),
	eventScan: defineModel("core.eventScan", {
		fields: {
			id: field.string().primaryKey().defaultId(),
			eventId: field
				.string()
				.references("core.event", "id", { onDelete: "cascade" }),
			authId: field
				.string()
				.references("core.user", "authId", { onDelete: "cascade" }),
			scannedByAuthId: field.string().references("core.user", "authId"),
			scannedAt: field.date().defaultNow(),
		},
		indexes: [
			["eventId"],
			["authId"],
			["eventId", "authId"],
			["scannedAt"],
		],
	}),
} as const;
