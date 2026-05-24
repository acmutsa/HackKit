import "server-only";
import type { AuthSession } from "@hackkit/core";
type BetterAuthInstance = {
    api: {
        getSession: (input: {
            headers: Headers;
        }) => Promise<AuthSession | null>;
    };
};
export declare function getAuthSession(auth: BetterAuthInstance): Promise<AuthSession | null>;
export {};
//# sourceMappingURL=session.d.ts.map