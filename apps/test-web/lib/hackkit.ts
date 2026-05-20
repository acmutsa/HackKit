import "server-only";

import { createHackkit } from "@hackkit/core";
import { createMemoryDatabaseAdapter } from "./memory-database";

export const testAuthId = "test-user";

export const hackkit = createHackkit({
	database: createMemoryDatabaseAdapter(),
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
	return hackkit.users.ensureUser({
		authId: testAuthId,
		email: "demo@hackkit.dev",
		firstName: "Demo",
		lastName: "User",
		profilePhotoUrl: undefined,
	});
}
