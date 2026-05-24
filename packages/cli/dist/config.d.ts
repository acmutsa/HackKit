import type { HackKitPlugin } from "@hackkit/core";
import type { EventTypesInput, UserDataOptionsInput } from "@hackkit/core";
import type { AuthAdapter } from "@hackkit/core";
export type HackkitConfig = {
    plugins?: readonly HackKitPlugin[];
    databaseUrl: string;
    userDataOptions?: UserDataOptionsInput;
    eventTypes?: EventTypesInput;
    auth?: Pick<AuthAdapter, "syncStorage">;
};
export declare function defineHackkitConfig<const T extends HackkitConfig>(config: T): T;
//# sourceMappingURL=config.d.ts.map