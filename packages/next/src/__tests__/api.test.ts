import { describe, expect, it } from "vitest";
import { createHackkitApi } from "../api";

function createApi(session = true) {
	const seenHeaders: Headers[] = [];
	const api = createHackkitApi({
		hackkit: {
			users: {
				ensureUser: async () => ({ authId: "request-user" }),
			},
			userData: {
				completeUserData: async () => undefined,
			},
		} as never,
		auth: {
			getSession: async () => null,
			toAuthId: (current) => current.user.id,
			getIdentity: () => ({
				email: "user@example.com",
				firstName: "User",
				lastName: "Example",
			}),
		},
		resolveSession: async (headers) => {
			seenHeaders.push(headers);
			return session
				? {
						user: {
							id: headers.get("x-user") ?? "missing",
							email: "user@example.com",
							name: "User Example",
						},
					}
				: null;
		},
		getSettingValue: async () => true,
	});
	return { api, seenHeaders };
}

describe("HackKit Better Call API", () => {
	it("resolves the actor from each direct call's headers", async () => {
		const { api, seenHeaders } = createApi();
		const result = await api.api.completeUserData({
			headers: new Headers({ "x-user": "request-scoped-user" }),
			body: {
				age: 20,
				gender: "x",
				race: "x",
				ethnicity: "x",
				shirtSize: "m",
				dietaryRestrictions: [],
				hasAcceptedMLHCodeOfConduct: true,
				hasSharedDataWithMLH: true,
				isEmailable: true,
			},
		});

		expect(result).toEqual({ ok: true, data: undefined });
		expect(seenHeaders).toHaveLength(1);
		expect(seenHeaders[0].get("x-user")).toBe("request-scoped-user");
	});

	it("returns transport errors for unauthenticated and invalid requests", async () => {
		const unauthenticated = createApi(false).api;
		const denied = await unauthenticated.handler(
			new Request("https://hackkit.test/api/hackkit/complete-user-data", {
				method: "POST",
				headers: {
					origin: "https://hackkit.test",
					"content-type": "application/json",
				},
				body: JSON.stringify({
					age: 20,
					gender: "x",
					race: "x",
					ethnicity: "x",
					shirtSize: "m",
					dietaryRestrictions: [],
					hasAcceptedMLHCodeOfConduct: true,
					hasSharedDataWithMLH: true,
					isEmailable: true,
				}),
			}),
		);
		expect(denied.status).toBe(401);

		const { api } = createApi();
		const invalid = await api.handler(
			new Request("https://hackkit.test/api/hackkit/complete-user-data", {
				method: "POST",
				headers: {
					origin: "https://hackkit.test",
					"content-type": "application/json",
				},
				body: JSON.stringify({ age: "not-a-number" }),
			}),
		);
		expect(invalid.status).toBe(400);
	});

	it("rejects cross-origin cookie mutations", async () => {
		const { api } = createApi();
		const response = await api.handler(
			new Request("https://hackkit.test/api/hackkit/list-settings", {
				method: "POST",
				headers: {
					origin: "https://attacker.test",
					"content-type": "application/json",
				},
				body: "{}",
			}),
		);
		expect(response.status).toBe(403);
	});
});
