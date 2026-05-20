import { HackKitError } from "@hackkit/core";
export function actionSuccess(data) {
	return { ok: true, data: data };
}
export function actionFailure(error, message) {
	return {
		ok: false,
		message:
			message ??
			(error instanceof HackKitError
				? error.message
				: "Something went wrong."),
	};
}
//# sourceMappingURL=actions.js.map
