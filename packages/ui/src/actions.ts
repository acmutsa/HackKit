import { HackKitError } from "@hackkit/core";

export type HackKitActionResult<T = void> =
	| { ok: true; data: T }
	| { ok: false; message: string };

export function actionSuccess<T = void>(data?: T): HackKitActionResult<T> {
	return { ok: true, data: data as T };
}

export function actionFailure(
	error: unknown,
	fallbackMessage?: string,
): HackKitActionResult<never> {
	return {
		ok: false,
		message:
			error instanceof HackKitError
				? error.message
				: (fallbackMessage ?? "Something went wrong."),
	};
}
