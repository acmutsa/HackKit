import { HackKitError } from "@hackkit/core";
import type { AuthId } from "@hackkit/core";

export const DEFAULT_EVENT_PASS_QR_TTL_MS = 5 * 60 * 1000;

export type EventPassQrPayload = {
	authId: AuthId;
	qrIssuedAt: number;
};

export function createEventPassQrPayload(
	authId: AuthId,
	issuedAt: Date,
): string {
	const payload: EventPassQrPayload = {
		authId,
		qrIssuedAt: issuedAt.getTime(),
	};
	return JSON.stringify(payload);
}

export function parseEventPassQrPayload(raw: string): {
	authId: AuthId;
	qrIssuedAt: Date;
} {
	let parsed: unknown;
	try {
		parsed = JSON.parse(raw);
	} catch {
		throw new HackKitError("VALIDATION_ERROR", "Invalid Event Pass QR code.");
	}

	if (
		typeof parsed !== "object" ||
		parsed === null ||
		!("authId" in parsed) ||
		!("qrIssuedAt" in parsed) ||
		typeof (parsed as EventPassQrPayload).authId !== "string" ||
		typeof (parsed as EventPassQrPayload).qrIssuedAt !== "number"
	) {
		throw new HackKitError("VALIDATION_ERROR", "Invalid Event Pass QR code.");
	}

	const payload = parsed as EventPassQrPayload;
	return {
		authId: payload.authId,
		qrIssuedAt: new Date(payload.qrIssuedAt),
	};
}

export function validateEventPassQrIssuedAt(
	qrIssuedAt: Date,
	now: Date,
	ttlMs: number,
): void {
	if (Number.isNaN(qrIssuedAt.getTime())) {
		throw new HackKitError("VALIDATION_ERROR", "Invalid Event Pass QR code.");
	}

	if (now.getTime() - qrIssuedAt.getTime() > ttlMs) {
		throw new HackKitError(
			"VALIDATION_ERROR",
			"Event Pass QR code has expired. Ask the participant to refresh it.",
		);
	}

	if (qrIssuedAt.getTime() > now.getTime() + 60_000) {
		throw new HackKitError("VALIDATION_ERROR", "Invalid Event Pass QR code.");
	}
}

export function resolveEventPassTargetAuthId(
	rawQr: string,
	now: Date,
	ttlMs: number,
): AuthId {
	const { authId, qrIssuedAt } = parseEventPassQrPayload(rawQr);
	validateEventPassQrIssuedAt(qrIssuedAt, now, ttlMs);
	return authId;
}
