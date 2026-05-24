import { type AuthAdapter, type HackKit, type HackKitPlugin, type User } from "@hackkit/core";
import type { EventTypesInput, UserDataOptionsInput } from "@hackkit/core";
import type { HackKitUIActions } from "@hackkit/ui";
import { type PageGuards } from "./page-guards";
export type CreateHackkitRuntimeOptions = {
    database: unknown;
    auth: AuthAdapter;
    plugins?: readonly HackKitPlugin[];
    userDataOptions?: UserDataOptionsInput;
    eventTypes?: EventTypesInput;
    eventPassQrTtlMs: number;
};
export type HackkitRuntime = {
    hackkit: HackKit;
    mutations: HackKitUIActions;
    pageGuards: PageGuards;
    getAuthId: () => Promise<string>;
    getCurrentUser: () => Promise<User>;
    eventPassQrTtlMs: number;
};
export declare function createHackkitRuntime(options: CreateHackkitRuntimeOptions): Promise<HackkitRuntime>;
export declare function setHackkitRuntime(promise: Promise<HackkitRuntime>): void;
export declare function getHackkitRuntime(): Promise<HackkitRuntime>;
//# sourceMappingURL=runtime.d.ts.map