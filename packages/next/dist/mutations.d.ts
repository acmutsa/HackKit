import { type HackKit } from "@hackkit/core";
import { type HackKitUIActions } from "@hackkit/ui";
export type CreateHackKitMutationsOptions = {
    hackkit: HackKit;
    getAuthId: () => Promise<string>;
    eventPassQrTtlMs: number;
};
export declare function createHackKitMutations(options: CreateHackKitMutationsOptions): HackKitUIActions;
//# sourceMappingURL=mutations.d.ts.map