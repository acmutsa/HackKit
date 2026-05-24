import "server-only";

import { headers } from "next/headers";
import type { AuthSession } from "@hackkit/core";

type BetterAuthInstance = {
	api: {
		getSession: (input: {
			headers: Headers;
		}) => Promise<AuthSession | null>;
	};
};

export async function getAuthSession(auth: BetterAuthInstance) {
	return auth.api.getSession({
		headers: await headers(),
	});
}
