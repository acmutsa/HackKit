import { describe, expect, it, vi } from "vitest";
import { createHackkitUIActionsClient } from "../ui-actions-client";

describe("HackKit API client", () => {
	it("fulfills the UI action contract through JSON POST requests", async () => {
		const fetch = vi.fn<typeof globalThis.fetch>().mockResolvedValue(
			new Response(JSON.stringify({ ok: true, data: undefined }), {
				status: 200,
				headers: { "content-type": "application/json" },
			}),
		);
		const actions = createHackkitUIActionsClient({ fetch });

		await expect(actions.confirmRsvp()).resolves.toEqual({
			ok: true,
			data: undefined,
		});
		expect(fetch).toHaveBeenCalledWith(
			"/api/hackkit/rsvp/confirm",
			expect.objectContaining({
				method: "POST",
				credentials: "same-origin",
			}),
		);
	});

	it("preserves transport error messages as UI failures", async () => {
		const actions = createHackkitUIActionsClient({
			fetch: vi.fn<typeof globalThis.fetch>().mockResolvedValue(
				new Response(JSON.stringify({ message: "Sign in to continue." }), {
					status: 401,
					headers: { "content-type": "application/json" },
				}),
			),
		});

		await expect(actions.confirmRsvp()).resolves.toEqual({
			ok: false,
			message: "Sign in to continue.",
		});
	});
});
