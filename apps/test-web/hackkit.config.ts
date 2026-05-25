import { defineHackkitConfig } from "@hackkit/cli";
import { syncBetterAuthStorage } from "@hackkit/auth-better-auth";
import { teamsPlugin } from "@hackkit/plugin-teams";

export default defineHackkitConfig({
	databaseUrl: process.env.DATABASE_URL ?? "file:.data/test-web.db",
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
