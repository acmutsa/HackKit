import { HackKitError } from "@hackkit/core";
export const DEFAULT_EVENT_PASS_QR_TTL_MS = 5 * 60 * 1000;
export function createEventPassQrPayload(authId, issuedAt) {
    const payload = {
        authId,
        qrIssuedAt: issuedAt.getTime(),
    };
    return JSON.stringify(payload);
}
export function parseEventPassQrPayload(raw) {
    let parsed;
    try {
        parsed = JSON.parse(raw);
    }
    catch {
        throw new HackKitError("VALIDATION_ERROR", "Invalid Event Pass QR code.");
    }
    if (typeof parsed !== "object" ||
        parsed === null ||
        !("authId" in parsed) ||
        !("qrIssuedAt" in parsed) ||
        typeof parsed.authId !== "string" ||
        typeof parsed.qrIssuedAt !== "number") {
        throw new HackKitError("VALIDATION_ERROR", "Invalid Event Pass QR code.");
    }
    const payload = parsed;
    return {
        authId: payload.authId,
        qrIssuedAt: new Date(payload.qrIssuedAt),
    };
}
export function validateEventPassQrIssuedAt(qrIssuedAt, now, ttlMs) {
    if (Number.isNaN(qrIssuedAt.getTime())) {
        throw new HackKitError("VALIDATION_ERROR", "Invalid Event Pass QR code.");
    }
    if (now.getTime() - qrIssuedAt.getTime() > ttlMs) {
        throw new HackKitError("VALIDATION_ERROR", "Event Pass QR code has expired. Ask the participant to refresh it.");
    }
    if (qrIssuedAt.getTime() > now.getTime() + 60_000) {
        throw new HackKitError("VALIDATION_ERROR", "Invalid Event Pass QR code.");
    }
}
export function resolveEventPassTargetAuthId(rawQr, now, ttlMs) {
    const { authId, qrIssuedAt } = parseEventPassQrPayload(rawQr);
    validateEventPassQrIssuedAt(qrIssuedAt, now, ttlMs);
    return authId;
}
//# sourceMappingURL=event-pass.js.map