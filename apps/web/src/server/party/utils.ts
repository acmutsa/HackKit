import type * as Party from "partykit/server";

export async function getPartyClerkSession(req: Party.Request) {
	const headers = proxiedRequest.headers;
	const origin = headers.get("origin") ?? "";
	const cookie = headers.get("cookie") ?? "";
}
