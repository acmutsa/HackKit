import type { User } from "@hackkit/core";
export type EventPassProps = {
    user: User;
    qrPayload: string;
    onRefreshQr: () => void;
    className?: string;
};
export declare function EventPass({ user, qrPayload, onRefreshQr, className, }: EventPassProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=event-pass.d.ts.map