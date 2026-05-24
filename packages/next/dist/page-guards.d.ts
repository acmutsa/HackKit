import type { HackKit, PermissionKey } from "@hackkit/core";
import { HackKitError } from "@hackkit/core";
import type { AccessPrincipal } from "@hackkit/core";
export type PageGuardOptions = {
    onForbidden?: "notFound" | "redirect" | ((error: HackKitError) => never);
    redirectTo?: string;
};
export declare function createPageGuards(hackkit: HackKit, getAuthId: () => Promise<string>, options?: PageGuardOptions): {
    requirePermission(permission: PermissionKey): Promise<AccessPrincipal>;
    getOptionalPermission(permission: PermissionKey): Promise<AccessPrincipal | null>;
};
export type PageGuards = ReturnType<typeof createPageGuards>;
//# sourceMappingURL=page-guards.d.ts.map