import "server-only";

import {
	createDrizzleDatabaseAdapter,
	createHackkit,
	createPluginRegistry,
	syncDrizzleStorage,
} from "@hackkit/core";
import { redirect } from "next/navigation";
import { getAuthSession } from "./auth";
import { db } from "./db";

const registry = createPluginRegistry();

await syncDrizzleStorage(db as any, registry.storage);

export const hackkit = createHackkit({
	database: createDrizzleDatabaseAdapter(db as any),
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
});

export async function getCurrentUser() {
	const session = await getAuthSession();
	if (!session) redirect("/sign-in");

	const [firstName = session.user.name, ...lastNameParts] = session.user.name
		.trim()
		.split(/\s+/);

	return hackkit.users.ensureUser({
		authId: session.user.id,
		email: session.user.email,
		firstName,
		lastName: lastNameParts.join(" ") || "User",
		profilePhotoUrl: session.user.image ?? undefined,
	});
}
