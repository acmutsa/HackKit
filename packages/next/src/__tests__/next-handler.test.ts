import { describe, expect, it } from "vitest";
import { toNextJsHandler } from "../next-handler";

describe("toNextJsHandler", () => {
	it("forwards the original Request to every route method", async () => {
		const route = toNextJsHandler(async (request) =>
			Response.json({ pathname: new URL(request.url).pathname }),
		);
		const request = new Request("https://hackkit.test/api/hackkit/rsvp/confirm");

		expect(await (await route.POST(request)).json()).toEqual({
			pathname: "/api/hackkit/rsvp/confirm",
		});
		expect(route.POST).toBe(route.PATCH);
	});
});
