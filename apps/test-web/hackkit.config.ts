import { defineHackkitConfig } from "@hackkit/cli";
import type { PermissionKey } from "@hackkit/core";
import { syncBetterAuthStorage } from "@hackkit/auth-better-auth";
import { teamsPlugin } from "@hackkit/plugin-teams";

const participantPermissions = [] as PermissionKey[];

export default defineHackkitConfig({
	databaseUrl: process.env.DATABASE_URL ?? "file:.data/test-web.db",
	requireApproval: false,
	defaultCompetitorRoleId: "core.participant",
	seedRoles: [
		{
			id: "core.participant",
			name: "Participant",
			position: 10,
			permissions: participantPermissions,
		},
	],
	blob: {
		adapter: "local",
		baseDir: ".data/uploads",
	},
	logger: {
		level: process.env.NODE_ENV === "production" ? "warn" : "debug",
	},
	plugins: [teamsPlugin()],
	userDataOptions: {
		shirtSize: [
			{ value: "s", label: "Small" },
			{ value: "m", label: "Medium" },
			{ value: "l", label: "Large" },
			{ value: "xl", label: "Extra large" },
		],
		countryOfResidence: [
			{ value: "us", label: "United States" },
			{ value: "ca", label: "Canada" },
			{ value: "other", label: "Other" },
		],
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
