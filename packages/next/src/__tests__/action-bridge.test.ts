import { describe, expect, it } from "vitest";
import type { HackKitUIActions } from "@hackkit/ui";
import { hackKitUIActions } from "../action-map";
import { createHackKitMutations } from "../mutations";
import * as serverActions from "../actions";

/**
 * Canonical key list for HackKit UI actions. Extending `HackKitUIActions`
 * without updating this array fails typecheck below; omitting a bridge
 * export fails the runtime assertions.
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
	it("exposes every HackKitUIActions key on hackKitUIActions", () => {
		expect(sortedKeys(hackKitUIActions)).toEqual(expectedSorted);
	});

	it("exposes every HackKitUIActions key from createHackKitMutations", () => {
		const mutations = createHackKitMutations({
			hackkit: {} as never,
			getAuthId: async () => "auth-id",
			getSettingValue: async () => true,
		});
		expect(sortedKeys(mutations)).toEqual(expectedSorted);
	});

	it("exports a named server action for every HackKitUIActions key", () => {
		const actionExports = Object.fromEntries(
			EXPECTED_ACTION_KEYS.map((key) => {
				const value = (serverActions as Record<string, unknown>)[key];
				return [key, value];
			}),
		);
		for (const key of EXPECTED_ACTION_KEYS) {
			expect(typeof actionExports[key], key).toBe("function");
		}
		expect(sortedKeys(actionExports)).toEqual(expectedSorted);
	});

	it("wires provider map entries to functions", () => {
		for (const key of EXPECTED_ACTION_KEYS) {
			expect(typeof hackKitUIActions[key], key).toBe("function");
		}
	});
});
