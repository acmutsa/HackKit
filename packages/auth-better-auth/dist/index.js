import { headers } from "next/headers";
import { account, session, syncBetterAuthStorage, user, verification, } from "./auth-schema";
export function betterAuthAdapter(options) {
    const { auth } = options;
    return {
        async getSession() {
            return auth.api.getSession({
                headers: await headers(),
            });
        },
        toAuthId(session) {
            return session.user.id;
        },
        getIdentity(session) {
            const [firstName = session.user.name, ...lastNameParts] = session.user.name
                .trim()
                .split(/\s+/);
            return {
                email: session.user.email,
                firstName,
                lastName: lastNameParts.join(" ") || "User",
                profilePhotoUrl: session.user.image ?? undefined,
            };
        },
        syncStorage(database) {
            return syncBetterAuthStorage(database);
        },
    };
}
export { account, session, syncBetterAuthStorage, user, verification, };
//# sourceMappingURL=index.js.map