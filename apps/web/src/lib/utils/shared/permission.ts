import { PermissionType } from "@/lib/constants/permission";

class PermissionMask {
	mask: number;

	constructor(mask: number) {
		this.mask = mask;
	}

	has(perm: PermissionType): boolean {
		return (this.mask & perm) !== 0;
	}

	add(perm: PermissionType): number {
		return this.mask | perm;
	}

	remove(perm: PermissionType): number {
		return this.mask & ~perm;
	}

	toggle(perm: PermissionType): number {
		return this.mask ^ perm;
	}

	hasAny(perms: PermissionType[]): boolean {
		return perms.some((p) => (this.mask & p) !== 0);
	}

	hasAll(perms: PermissionType[]): boolean {
		return perms.every((p) => (this.mask & p) !== 0);
	}
}

export { PermissionMask };
