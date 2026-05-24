import { createDrizzleDatabaseAdapter, createHackkit, } from "@hackkit/core";
import { redirect } from "next/navigation";
import { createHackKitMutations } from "./mutations.js";
import { createPageGuards } from "./page-guards.js";
export async function createHackkitRuntime(options) {
    const hackkit = createHackkit({
        database: createDrizzleDatabaseAdapter(options.database),
        plugins: options.plugins,
        userDataOptions: options.userDataOptions,
        eventTypes: options.eventTypes,
    });
    async function requireSession() {
        const session = await options.auth.getSession();
        if (!session)
            redirect("/sign-in");
        return session;
    }
    async function getAuthId() {
        return options.auth.toAuthId(await requireSession());
    }
    async function getCurrentUser() {
        const session = await requireSession();
        const identity = options.auth.getIdentity(session);
        return hackkit.users.ensureUser({
            authId: options.auth.toAuthId(session),
            ...identity,
        });
    }
    const mutations = createHackKitMutations({
        hackkit,
        getAuthId,
        eventPassQrTtlMs: options.eventPassQrTtlMs,
    });
    const pageGuards = createPageGuards(hackkit, getAuthId);
    return {
        hackkit,
        mutations,
        pageGuards,
        getAuthId,
        getCurrentUser,
    };
}
let runtimePromise = null;
export function setHackkitRuntime(promise) {
    runtimePromise = promise;
}
export async function getHackkitRuntime() {
    if (!runtimePromise) {
        throw new Error("HackKit runtime is not initialized. Call setHackkitRuntime() from your app runtime module.");
    }
    return runtimePromise;
}
//# sourceMappingURL=runtime.js.map