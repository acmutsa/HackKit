import { describe, expect, it } from "vitest";
import type { HackKitUIActions } from "@hackkit/ui";
import {
	createHackkitApi,
	HACKKIT_UI_ACTION_ENDPOINTS,
} from "../api";
import { createHackKitMutations } from "../mutations";

/**
 * Extending `HackKitUIActions` without registering an API endpoint fails
 * typecheck below and the runtime parity assertion.
 */
const EXPECTED_ACTION_KEYS = [
	"completeUserData",
	"claimHackTag",
	"updateUserProfile",
	"registerHacker",
	"createEvent",
	"updateEvent",
	"deleteEvent",
	"previewEventPassQr",
	"recordEventScan",
	"checkInUser",
	"clearCheckIn",
	"confirmRsvp",
	"cancelRsvp",
	"setRsvpStatus",
	"promoteRsvp",
	"approveUser",
	"banUser",
	"unbanUser",
	"assignRoleToUser",
	"createRole",
	"updateRole",
	"deleteRole",
	"listSettings",
	"setSettings",
	"resetSetting",
] as const satisfies readonly (keyof HackKitUIActions)[];

type MissingFromExpected = Exclude<
	keyof HackKitUIActions,
	(typeof EXPECTED_ACTION_KEYS)[number]
>;
type ExtraInExpected = Exclude<
	(typeof EXPECTED_ACTION_KEYS)[number],
	keyof HackKitUIActions
>;

const _assertNoMissingKeys: MissingFromExpected extends never ? true : never =
	true;
const _assertNoExtraKeys: ExtraInExpected extends never ? true : never = true;

void _assertNoMissingKeys;
void _assertNoExtraKeys;

function sortedKeys(value: object): string[] {
	return Object.keys(value).sort();
}

const expectedSorted = [...EXPECTED_ACTION_KEYS].sort();

describe("Core action bridge", () => {
	it("registers every HackKitUIActions key as a Better Call endpoint", () => {
		expect(sortedKeys(HACKKIT_UI_ACTION_ENDPOINTS)).toEqual(expectedSorted);
	});

	it("exposes every HackKitUIActions key from createHackKitMutations", () => {
		const mutations = createHackKitMutations({
			hackkit: {} as never,
			getAuthId: async () => "auth-id",
			getSettingValue: async () => true,
		});
		expect(sortedKeys(mutations)).toEqual(expectedSorted);
	});

	it("exposes typed direct API methods for every UI action", () => {
		const api = createHackkitApi({
			hackkit: {} as never,
			auth: {
				getSession: async () => null,
				toAuthId: () => "auth-id",
				getIdentity: () => ({
					email: "user@example.com",
					firstName: "User",
					lastName: "Example",
				}),
			},
			resolveSession: async () => null,
			getSettingValue: async () => true,
		});
		for (const key of EXPECTED_ACTION_KEYS) {
			expect(typeof api.api[key], key).toBe("function");
		}
	});
});
