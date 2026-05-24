import type { AuthId } from "@hackkit/core";
export declare const DEFAULT_EVENT_PASS_QR_TTL_MS: number;
export type EventPassQrPayload = {
    authId: AuthId;
    qrIssuedAt: number;
};
export declare function createEventPassQrPayload(authId: AuthId, issuedAt: Date): string;
export declare function parseEventPassQrPayload(raw: string): {
    authId: AuthId;
    qrIssuedAt: Date;
};
export declare function validateEventPassQrIssuedAt(qrIssuedAt: Date, now: Date, ttlMs: number): void;
export declare function resolveEventPassTargetAuthId(rawQr: string, now: Date, ttlMs: number): AuthId;
//# sourceMappingURL=event-pass.d.ts.map