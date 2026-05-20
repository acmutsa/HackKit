import type { CompleteUserDataInput, UserDataOptions } from "@hackkit/core";
import type { HackKitActionResult } from "./actions";

export type UserDataFormValues = Omit<CompleteUserDataInput, "authId">;

export type HackKitUIActions = {
	completeUserData: (
		values: UserDataFormValues,
	) => Promise<HackKitActionResult>;
};

export type { UserDataOptions };
