"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/shadcn/ui/button";
import {
	AccordionItem,
	AccordionTrigger,
	AccordionContent,
} from "@/components/shadcn/ui/accordion";
import Restricted from "@/components/Restricted";
import { PermissionType } from "@/lib/constants/permission";
import { PermissionMask } from "@/lib/utils/shared/permission";
import { ChevronUp, ChevronDown } from "lucide-react";
import RoleBadge from "@/components/dash/shared/RoleBadge";
import { UserWithRole } from "db/types";
import { InferSelectModel } from "drizzle-orm";
import { roles } from "db/schema";
import {
	compareUserPosition,
	userHasPermission,
} from "@/lib/utils/server/admin";
import DeleteRoleDialog from "@/components/admin/roles/DeleteRoleDialog";

type Role = InferSelectModel<typeof roles>;

export default function RoleCard({
	role,
	currentUser,
	onRoleChange,
	onMove,
	index,
	total,
}: {
	role: Role;
	currentUser: UserWithRole;
	onRoleChange: (r: Role) => void;
	onMove: (roleId: number, dir: "up" | "down") => void;
	index: number;
	total: number;
}) {
	const [permissionsMask, setPermissionsMask] = useState<number>(
		role.permissions ?? 0,
	);
	const [color, setColor] = useState<string | null>(role.color ?? "");

	useEffect(() => {
		setPermissionsMask(role.permissions ?? 0);
		setColor(role.color ?? "");
	}, [role]);

	const hasPermLocal = (perm: PermissionType) => {
		const mask = new PermissionMask(permissionsMask);
		return mask.has(perm);
	};

	// Whether current user may toggle this permission on target role (they must have EDIT_ROLES and higher position)
	const canEditRole = (() => {
		try {
			return (
				userHasPermission(currentUser, PermissionType.EDIT_ROLES) &&
				compareUserPosition(currentUser, role.position)
			);
		} catch (e) {
			return false;
		}
	})();

	// user cannot toggle individual permission bits they don't personally have
	function canTogglePermission(perm: PermissionType) {
		return userHasPermission(currentUser, perm) && canEditRole;
	}

	function togglePerm(perm: PermissionType) {
		if (!canTogglePermission(perm)) return;
		const next = new PermissionMask(role.permissions).toggle(perm);
		setPermissionsMask(next);
		onRoleChange({ ...role, permissions: next, color });
	}

	function onColorChange(v: string) {
		setColor(v);
		onRoleChange({ ...role, permissions: permissionsMask, color: v });
	}

	// Build a list of PermissionType entries
	const permissionEntries = Object.keys(PermissionType)
		.filter((k) => isNaN(Number(k)))
		.map((k) => ({
			name: k.replaceAll("_", " "),
			value: (PermissionType as any)[k] as number,
		}));

	return (
		<AccordionItem
			value={String(role.id)}
			className={`p-4 ${canEditRole ? "" : "opacity-40"}`}
		>
			<AccordionTrigger asChild>
				<div className="flex w-full items-center gap-x-3">
					<div className="flex items-center gap-x-2">
						<div className="flex flex-col">
							<div className="flex items-center gap-x-1">
								<Button
									size="icon"
									variant="ghost"
									onClick={(e) => {
										e.stopPropagation();
										onMove(role.id, "up");
									}}
									disabled={
										index === 0 ||
										!canEditRole ||
										role.position - 1 ==
											currentUser.role?.position
									}
								>
									<ChevronUp />
								</Button>
								<Button
									size="icon"
									variant="ghost"
									onClick={(e) => {
										e.stopPropagation();
										onMove(role.id, "down");
									}}
									disabled={
										index === total - 1 || !canEditRole
									}
								>
									<ChevronDown />
								</Button>
							</div>
						</div>
						<RoleBadge role={role} />
					</div>

					<div className="ml-auto mr-4 flex items-center gap-x-2"></div>
				</div>
			</AccordionTrigger>
			<AccordionContent>
				<div className="grid grid-cols-[1.5fr_0.5fr_0.5fr] gap-12">
					<div>
						<h4 className="font-semibold">Permissions</h4>
						<div className="mt-2 space-y-2">
							{permissionEntries.map((p) => (
								<div
									key={p.name}
									className="flex items-center justify-between"
								>
									<div className="flex items-center gap-x-2">
										<input
											type="checkbox"
											checked={hasPermLocal(p.value)}
											disabled={
												!canTogglePermission(p.value) ||
												!canEditRole
											}
											onChange={() => togglePerm(p.value)}
										/>
										<span>{p.name}</span>
									</div>
									<div className="text-sm text-muted-foreground">
										{hasPermLocal(p.value)
											? "Enabled"
											: "Disabled"}
									</div>
								</div>
							))}
						</div>
					</div>
					<div>
						<h4 className="font-semibold">Appearance</h4>
						<div className="mt-2 flex flex-col gap-y-2">
							<div className="flex items-center gap-x-2">
								<label className="text-sm">Color</label>
								{canEditRole ? (
									<input
										type="color"
										value={color || "#000000"}
										onChange={(e) =>
											onColorChange(e.target.value)
										}
									/>
								) : (
									<span className="text-sm text-muted-foreground">
										{role.color || "—"}
									</span>
								)}
							</div>
						</div>
					</div>
					<div>
						<Restricted
							user={currentUser}
							permissions={PermissionType.DELETE_ROLES}
							targetRolePosition={role.position}
							position="higher"
						>
							<DeleteRoleDialog
								role={role}
								currentUser={currentUser}
								class_name="mt-4"
							/>
						</Restricted>
					</div>
				</div>
			</AccordionContent>
		</AccordionItem>
	);
}
