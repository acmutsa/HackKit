"use server";

import {
	actionFailure,
	actionSuccess,
	type UserDataFormValues,
} from "@hackkit/ui";
import { getCurrentUser, hackkit } from "@/lib/hackkit";

export async function completeUserData(values: UserDataFormValues) {
	try {
		const user = await getCurrentUser();
		await hackkit.userData.completeUserData({
			...values,
			authId: user.authId,
		});
		return actionSuccess();
	} catch (error) {
		return actionFailure(error, "Could not save user data.");
	}
}
