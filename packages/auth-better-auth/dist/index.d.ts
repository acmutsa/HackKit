import type { AuthAdapter, AuthSession } from "@hackkit/core";
import { account, session, syncBetterAuthStorage, user, verification } from "./auth-schema";
type BetterAuthInstance = {
    api: {
        getSession: (input: {
            headers: Headers;
        }) => Promise<AuthSession | null>;
    };
};
export type BetterAuthAdapterOptions = {
    auth: BetterAuthInstance;
};
export declare function betterAuthAdapter(options: BetterAuthAdapterOptions): AuthAdapter;
export { account, session, syncBetterAuthStorage, user, verification, };
//# sourceMappingURL=index.d.ts.map