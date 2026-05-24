import { HackKitError } from "@hackkit/core";
import { notFound, redirect } from "next/navigation";
export function createPageGuards(hackkit, getAuthId, options = {}) {
    const onForbidden = options.onForbidden ?? "notFound";
    const redirectTo = options.redirectTo ?? "/dashboard";
    function handleForbidden(error) {
        if (error instanceof HackKitError && error.code === "FORBIDDEN") {
            if (onForbidden === "notFound")
                notFound();
            if (onForbidden === "redirect")
                redirect(redirectTo);
            if (typeof onForbidden === "function")
                onForbidden(error);
        }
        throw error;
    }
    return {
        async requirePermission(permission) {
            try {
                const authId = await getAuthId();
                return await hackkit.accessControl.requirePermission(authId, permission);
            }
            catch (error) {
                handleForbidden(error);
            }
        },
        async getOptionalPermission(permission) {
            const authId = await getAuthId();
            const allowed = await hackkit.accessControl.hasPermission(authId, permission);
            if (!allowed)
                return null;
            return hackkit.accessControl.getPrincipal(authId);
        },
    };
}
//# sourceMappingURL=page-guards.js.map