import "server-only";

import { HackKitError, type HackKit, type User } from "@hackkit/core";
import { env } from "../env";

function isOwnerAllowlisted(user: User): boolean {
	return (
		env.ownerAuthIdAllowlist.includes(user.authId) ||
		env.ownerEmailAllowlist.includes(user.email.toLowerCase())
	);
}

export async function provisionOwnerFromAllowlist(
	hackkit: HackKit,
	user: User,
): Promise<void> {
	if (!isOwnerAllowlisted(user)) return;

	try {
		await hackkit.roles.bootstrapOwner({ authId: user.authId });
	} catch (error) {
		if (
			error instanceof HackKitError &&
			error.code === "INVALID_OPERATION"
		) {
			return;
		}
		throw error;
	}
}
