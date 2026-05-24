import "server-only";
import { headers } from "next/headers";
export async function getAuthSession(auth) {
    return auth.api.getSession({
        headers: await headers(),
    });
}
//# sourceMappingURL=session.js.map