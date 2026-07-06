"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { AdminUserRecord, PermissionKey, Role } from "@hackkit/core";
import { CorePermission } from "@hackkit/core";
import { toast } from "sonner";
import { useHackKitUI } from "../provider";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

type PendingAction =
	| "approval"
	| "ban"
	| "unban"
	| "assignRole"
	| "rsvpConfirm"
	| "rsvpWaitlist"
	| "rsvpCancel"
	| "rsvpPromote"
	| "createRole"
	| `updateRole:${string}`
	| `deleteRole:${string}`
	| null;

const permissionValues = Object.values(CorePermission);

export function AdminUserActions({
	record,
	roles,
}: {
	record: AdminUserRecord;
	roles: Role[];
}) {
	const router = useRouter();
	const { actions } = useHackKitUI();
	const [pendingAction, setPendingAction] = React.useState<PendingAction>(null);
	const [roleId, setRoleId] = React.useState(record.user.roleId ?? "");
	const [banReason, setBanReason] = React.useState(record.ban?.reason ?? "");

	async function run<T>(
		action: PendingAction,
		task: () => Promise<{ ok: true; data: T } | { ok: false; message: string }>,
		successMessage: string,
	) {
		setPendingAction(action);
		const result = await task();
		setPendingAction(null);
		if (!result.ok) {
			toast.error(result.message);
			return;
		}
		toast.success(successMessage);
		router.refresh();
	}

	return (
		<Card className="h-fit">
			<CardHeader>
				<CardTitle>Admin Actions</CardTitle>
				<CardDescription>Approval, suspension, and role controls.</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="space-y-2">
					<Label>Approval</Label>
					<Button
						type="button"
						variant={record.user.isApproved ? "outline" : "default"}
						disabled={pendingAction === "approval"}
						onClick={() =>
							run(
								"approval",
								() =>
									actions.approveUser({
										targetAuthId: record.user.authId,
										approved: !record.user.isApproved,
									}),
								record.user.isApproved ? "Approval removed." : "User approved.",
							)
						}
					>
						{record.user.isApproved ? "Unapprove User" : "Approve User"}
					</Button>
				</div>

				<div className="space-y-2">
					<Label htmlFor="admin-role">Role</Label>
					<div className="flex gap-2">
						<Select value={roleId} onValueChange={setRoleId}>
							<SelectTrigger id="admin-role">
								<SelectValue placeholder="Select role" />
							</SelectTrigger>
							<SelectContent>
								{roles.map((role) => (
									<SelectItem key={role.id} value={role.id}>
										{role.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Button
							type="button"
							disabled={!roleId || pendingAction === "assignRole"}
							onClick={() =>
								run(
									"assignRole",
									() =>
										actions.assignRoleToUser({
											targetAuthId: record.user.authId,
											roleId,
										}),
									"Role assigned.",
								)
							}
						>
							Assign
						</Button>
					</div>
				</div>

				<div className="space-y-2">
					<Label htmlFor="ban-reason">Suspension</Label>
					{record.ban ? (
						<div className="space-y-3">
							<p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm">
								{record.ban.reason || "This user is suspended."}
							</p>
							<Button
								type="button"
								variant="outline"
								disabled={pendingAction === "unban"}
								onClick={() =>
									run(
										"unban",
										() => actions.unbanUser(record.user.authId),
										"User reinstated.",
									)
								}
							>
								Reinstate User
							</Button>
						</div>
					) : (
						<div className="space-y-3">
							<Textarea
								id="ban-reason"
								value={banReason}
								onChange={(event) => setBanReason(event.currentTarget.value)}
								placeholder="Reason visible to admins"
							/>
							<Button
								type="button"
								variant="outline"
								disabled={pendingAction === "ban"}
								onClick={() =>
									run(
										"ban",
										() =>
											actions.banUser({
												targetAuthId: record.user.authId,
												reason: banReason.trim() || undefined,
											}),
										"User suspended.",
									)
								}
							>
								Suspend User
							</Button>
						</div>
					)}
				</div>

				<div className="space-y-2">
					<Label>RSVP</Label>
					<p className="text-sm text-muted-foreground">
						Current status: {formatRsvpStatus(record.rsvp)}
					</p>
					<div className="flex flex-wrap gap-2">
						<Button
							type="button"
							variant="outline"
							disabled={pendingAction === "rsvpConfirm"}
							onClick={() =>
								run(
									"rsvpConfirm",
									() =>
										actions.setRsvpStatus({
											targetAuthId: record.user.authId,
											status: "confirmed",
										}),
									"RSVP marked confirmed.",
								)
							}
						>
							Confirm
						</Button>
						<Button
							type="button"
							variant="outline"
							disabled={pendingAction === "rsvpWaitlist"}
							onClick={() =>
								run(
									"rsvpWaitlist",
									() =>
										actions.setRsvpStatus({
											targetAuthId: record.user.authId,
											status: "waitlisted",
										}),
									"RSVP moved to waitlist.",
								)
							}
						>
							Waitlist
						</Button>
						<Button
							type="button"
							variant="outline"
							disabled={pendingAction === "rsvpPromote" || record.rsvp?.status !== "waitlisted"}
							onClick={() =>
								run(
									"rsvpPromote",
									() => actions.promoteRsvp(record.user.authId),
									"Waitlisted RSVP promoted.",
								)
							}
						>
							Promote
						</Button>
						<Button
							type="button"
							variant="outline"
							disabled={pendingAction === "rsvpCancel" || !record.rsvp}
							onClick={() =>
								run(
									"rsvpCancel",
									() => actions.cancelRsvp(record.user.authId),
									"RSVP cancelled.",
								)
							}
						>
							Cancel
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

function formatRsvpStatus(record: AdminUserRecord["rsvp"]): string {
	if (!record) return "No RSVP";
	if (record.status === "waitlisted" && record.waitlistPosition) {
		return `Waitlisted #${record.waitlistPosition}`;
	}
	return record.status[0].toUpperCase() + record.status.slice(1);
}

export function AdminRoleManager({
	roles,
	permissions = permissionValues,
}: {
	roles: Role[];
	permissions?: string[];
}) {
	const router = useRouter();
	const { actions } = useHackKitUI();
	const [pendingAction, setPendingAction] = React.useState<PendingAction>(null);
	const [name, setName] = React.useState("");
	const [position, setPosition] = React.useState(roles.length + 1);
	const [color, setColor] = React.useState("");
	const [selectedPermissions, setSelectedPermissions] = React.useState<PermissionKey[]>([]);

	function togglePermission(permission: PermissionKey, checked: boolean) {
		setSelectedPermissions((existing) =>
			checked
				? [...new Set([...existing, permission])]
				: existing.filter((value) => value !== permission),
		);
	}

	async function createRole(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setPendingAction("createRole");
		const result = await actions.createRole({
			name,
			position,
			color: color.trim() || undefined,
			permissions: selectedPermissions,
		});
		setPendingAction(null);
		if (!result.ok) {
			toast.error(result.message);
			return;
		}
		toast.success("Role created.");
		setName("");
		setPosition(roles.length + 2);
		setColor("");
		setSelectedPermissions([]);
		router.refresh();
	}

	async function deleteRole(role: Role) {
		if (!window.confirm(`Delete ${role.name}?`)) return;
		const actionId = `deleteRole:${role.id}` as const;
		setPendingAction(actionId);
		const result = await actions.deleteRole(role.id);
		setPendingAction(null);
		if (!result.ok) {
			toast.error(result.message);
			return;
		}
		toast.success("Role deleted.");
		router.refresh();
	}

	return (
		<div className="grid gap-6 lg:grid-cols-[1fr_24rem]">
			<div className="space-y-4">
				{roles.map((role) => (
					<RoleEditor
						key={role.id}
						role={role}
						permissions={permissions}
						pendingAction={pendingAction}
						setPendingAction={setPendingAction}
						onDelete={deleteRole}
					/>
				))}
			</div>

			<Card className="h-fit">
				<CardHeader>
					<CardTitle>Create Role</CardTitle>
					<CardDescription>Add a role with explicit permissions.</CardDescription>
				</CardHeader>
				<CardContent>
					<form className="space-y-4" onSubmit={createRole}>
						<div className="space-y-2">
							<Label htmlFor="role-name">Name</Label>
							<Input
								id="role-name"
								value={name}
								onChange={(event) => setName(event.currentTarget.value)}
								required
							/>
						</div>
						<div className="grid gap-4 sm:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="role-position">Position</Label>
								<Input
									id="role-position"
									type="number"
									min={0}
									value={position}
									onChange={(event) =>
										setPosition(event.currentTarget.valueAsNumber)
									}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="role-color">Color</Label>
								<Input
									id="role-color"
									value={color}
									onChange={(event) => setColor(event.currentTarget.value)}
									placeholder="#2563eb"
								/>
							</div>
						</div>
						<div className="space-y-3">
							<Label>Permissions</Label>
							<div className="max-h-80 space-y-2 overflow-auto rounded-md border p-3">
								{permissions.map((permission) => (
									<label
										key={permission}
										className="flex items-center gap-2 text-sm"
									>
										<Checkbox
											checked={selectedPermissions.includes(
												permission as PermissionKey,
											)}
											onCheckedChange={(checked) =>
												togglePermission(
													permission as PermissionKey,
													checked === true,
												)
											}
										/>
										<span className="font-mono">{permission}</span>
									</label>
								))}
							</div>
						</div>
						<Button
							type="submit"
							disabled={!name.trim() || pendingAction === "createRole"}
						>
							Create Role
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}

function RoleEditor({
	role,
	permissions,
	pendingAction,
	setPendingAction,
	onDelete,
}: {
	role: Role;
	permissions: string[];
	pendingAction: PendingAction;
	setPendingAction: (action: PendingAction) => void;
	onDelete: (role: Role) => Promise<void>;
}) {
	const router = useRouter();
	const { actions } = useHackKitUI();
	const [name, setName] = React.useState(role.name);
	const [position, setPosition] = React.useState(role.position);
	const [color, setColor] = React.useState(role.color ?? "");
	const [selectedPermissions, setSelectedPermissions] = React.useState<PermissionKey[]>(
		role.permissions,
	);
	const actionId = `updateRole:${role.id}` as const;

	function togglePermission(permission: PermissionKey, checked: boolean) {
		setSelectedPermissions((existing) =>
			checked
				? [...new Set([...existing, permission])]
				: existing.filter((value) => value !== permission),
		);
	}

	async function updateRole(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setPendingAction(actionId);
		const result = await actions.updateRole({
			roleId: role.id,
			name,
			position,
			color: color.trim() || undefined,
			permissions: selectedPermissions,
		});
		setPendingAction(null);
		if (!result.ok) {
			toast.error(result.message);
			return;
		}
		toast.success("Role updated.");
		router.refresh();
	}

	return (
		<Card>
			<CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
				<div>
					<CardTitle>{role.name}</CardTitle>
					<CardDescription>
						Position {role.position} · {role.permissions.length} permissions
					</CardDescription>
				</div>
				<Button
					type="button"
					variant="outline"
					disabled={pendingAction === `deleteRole:${role.id}`}
					onClick={() => onDelete(role)}
				>
					Delete
				</Button>
			</CardHeader>
			<CardContent>
				<form className="space-y-4" onSubmit={updateRole}>
					<div className="grid gap-4 md:grid-cols-[1fr_8rem_10rem]">
						<div className="space-y-2">
							<Label htmlFor={`role-name-${role.id}`}>Name</Label>
							<Input
								id={`role-name-${role.id}`}
								value={name}
								onChange={(event) => setName(event.currentTarget.value)}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor={`role-position-${role.id}`}>Position</Label>
							<Input
								id={`role-position-${role.id}`}
								type="number"
								min={0}
								value={position}
								onChange={(event) => setPosition(event.currentTarget.valueAsNumber)}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor={`role-color-${role.id}`}>Color</Label>
							<Input
								id={`role-color-${role.id}`}
								value={color}
								onChange={(event) => setColor(event.currentTarget.value)}
							/>
						</div>
					</div>
					<div className="space-y-2">
						<Label>Permissions</Label>
						<div className="grid gap-2 rounded-md border p-3 sm:grid-cols-2">
							{permissions.map((permission) => (
								<label key={permission} className="flex items-center gap-2 text-sm">
									<Checkbox
										checked={selectedPermissions.includes(permission as PermissionKey)}
										onCheckedChange={(checked) =>
											togglePermission(permission as PermissionKey, checked === true)
										}
									/>
									<span className="font-mono">{permission}</span>
								</label>
							))}
						</div>
					</div>
					<Button type="submit" disabled={pendingAction === actionId}>
						Update Role
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
