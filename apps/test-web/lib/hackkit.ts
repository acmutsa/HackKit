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
