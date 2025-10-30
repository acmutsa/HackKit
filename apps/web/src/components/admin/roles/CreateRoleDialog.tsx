"use client";

import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/shadcn/ui/dialog";
import { Button } from "@/components/shadcn/ui/button";
import { Input } from "@/components/shadcn/ui/input";
import { Label } from "@/components/shadcn/ui/label";
import { PermissionType } from "@/lib/constants/permission";
import { PermissionMask } from "@/lib/utils/shared/permission";
import { useAction } from "next-safe-action/hooks";
import { createRole } from "@/actions/admin/role-actions";
import { toast } from "sonner";
import Restricted from "@/components/Restricted";
import { UserWithRole } from "db/types";
import { userHasPermission } from "@/lib/utils/server/admin";

export default function CreateRoleDialog({
	currentUser,
	nextPosition,
}: {
	currentUser: UserWithRole;
	nextPosition: number;
}) {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState("");
	const [permissionsMask, setPermissionsMask] = useState(0);
	const [color, setColor] = useState("#000000");
	const { execute: doCreate } = useAction(createRole, {
		onError: ({ error }) => {
			toast.error(
				"Failed to create role: " +
					(error.serverError || "Unknown error"),
			);
		},
		onSuccess: () => {
			toast.success("Role created");
			setOpen(false);
			setName("");
			setPermissionsMask(0);
			setColor("#000000");
		},
	});

	const permissionEntries = Object.keys(PermissionType)
		.filter((k) => isNaN(Number(k)))
		.map((k) => ({
			name: k.replaceAll("_", " "),
			value: (PermissionType as any)[k] as number,
		}));

	const hasPermLocal = (perm: PermissionType) => {
		const mask = new PermissionMask(permissionsMask);
		return mask.has(perm);
	};

	// Check if user can assign this permission (they must have it themselves)
	const canAssignPermission = (perm: PermissionType) => {
		return userHasPermission(currentUser, perm);
	};

	const togglePerm = (perm: PermissionType) => {
		if (!canAssignPermission(perm)) return;
		setPermissionsMask(new PermissionMask(permissionsMask).toggle(perm));
	};

	const handleCreate = () => {
		if (!name.trim()) {
			toast.error("Role name is required");
			return;
		}
		doCreate({
			name: name.trim(),
			position: nextPosition,
			permissions: permissionsMask,
			color: color || undefined,
		});
	};
	return (
		<Restricted
			user={currentUser}
			permissions={PermissionType.CREATE_ROLES}
		>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button>Create New Role</Button>
				</DialogTrigger>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle>Create New Role</DialogTitle>
					</DialogHeader>
					<div className="grid grid-cols-2 gap-12">
						<div>
							<div className="mb-4">
								<Label htmlFor="name">Role Name</Label>
								<Input
									id="name"
									value={name}
									onChange={(e) => setName(e.target.value)}
									placeholder="Enter role name"
								/>
							</div>
							<h4 className="mb-2 font-semibold">Permissions</h4>
							<div className="space-y-2">
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
													!canAssignPermission(
														p.value,
													)
												}
												onChange={() =>
													togglePerm(p.value)
												}
											/>
											<span
												className={
													!canAssignPermission(
														p.value,
													)
														? "text-muted-foreground"
														: ""
												}
											>
												{p.name}
											</span>
										</div>
										<div className="text-sm text-muted-foreground">
											{hasPermLocal(p.value)
												? "Enabled"
												: "Disabled"}
											{!canAssignPermission(p.value) &&
												" (You can't assign this permission)"}
										</div>
									</div>
								))}
							</div>
						</div>
						<div>
							<h4 className="mb-2 font-semibold">Appearance</h4>
							<div className="flex items-center gap-x-2">
								<Label htmlFor="color">Color</Label>
								<input
									id="color"
									type="color"
									value={color}
									onChange={(e) => setColor(e.target.value)}
								/>
							</div>
						</div>
					</div>
					<div className="mt-4 flex justify-end gap-2">
						<Button
							variant="outline"
							onClick={() => setOpen(false)}
						>
							Cancel
						</Button>
						<Button onClick={handleCreate}>Create Role</Button>
					</div>
				</DialogContent>
			</Dialog>
		</Restricted>
	);
}
