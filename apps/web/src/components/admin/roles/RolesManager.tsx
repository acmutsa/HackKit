"use client";

import { useState, useEffect } from "react";
import RoleCard from "@/components/admin/roles/RoleCard";
import { Accordion } from "@/components/shadcn/ui/accordion";
import { Button } from "@/components/shadcn/ui/button";
import { useAction } from "next-safe-action/hooks";
import { editRole } from "@/actions/admin/role-actions";
import { toast } from "sonner";
import CreateRoleDialog from "@/components/admin/roles/CreateRoleDialog";
import Restricted from "@/components/Restricted";
import { PermissionType } from "@/lib/constants/permission";

export default function RolesManager({
	roles: initialRoles,
	currentUser,
}: {
	roles: any[];
	currentUser: any;
}) {
	const [roles, setRoles] = useState(() =>
		[...initialRoles].sort((a, b) => a.position - b.position),
	);
	const [dirty, setDirty] = useState(false);
	const { execute: doEdit } = useAction(editRole, {
		onError: ({ error }) => {
			toast.error(
				"Failed to save role: " +
					(error.serverError || "Unknown error"),
			);
		},
		onSuccess: () => {
			// Individual success not needed since we save all at once
		},
	});

	useEffect(() => {
		setRoles([...initialRoles].sort((a, b) => a.position - b.position));
	}, [initialRoles]);

	const nextPosition =
		roles.length > 0 ? Math.max(...roles.map((r) => r.position)) + 1 : 1;

	function onRoleChange(updated: any) {
		setRoles((prev) => {
			const next = prev.map((r) =>
				r.id === updated.id ? { ...r, ...updated } : r,
			);
			setDirty(true);
			return next;
		});
	}

	function onMove(roleId: number, dir: "up" | "down") {
		setRoles((prev) => {
			const idx = prev.findIndex((r) => r.id === roleId);
			if (idx === -1) return prev;
			const next = [...prev];
			const swapIdx = dir === "up" ? idx - 1 : idx + 1;
			if (swapIdx < 0 || swapIdx >= next.length) return prev;
			// swap positions
			const a = next[idx];
			const b = next[swapIdx];
			const aPos = a.position;
			next[idx] = { ...a, position: b.position };
			next[swapIdx] = { ...b, position: aPos };
			setDirty(true);
			// resort after swap
			return next.sort((a, b) => a.position - b.position);
		});
	}

	const total = roles.length;

	async function saveAll() {
		// Compute which roles actually changed compared to the original `initialRoles`
		const changedRoles = roles.filter((r) => {
			const orig = initialRoles.find((o: any) => o.id === r.id);
			if (!orig) return true;
			const origPerm = orig.permissions ?? 0;
			const rPerm = r.permissions ?? 0;
			const origColor = orig.color ?? null;
			const rColor = r.color ?? null;
			return (
				orig.name !== r.name ||
				orig.position !== r.position ||
				origPerm !== rPerm ||
				origColor !== rColor
			);
		});

		if (changedRoles.length === 0) {
			toast.success("No changes to save");
			setDirty(false);
			return;
		}

		const promises = changedRoles.map((r) =>
			doEdit({
				roleId: r.id,
				name: r.name,
				position: r.position,
				permissions: r.permissions,
				color: r.color ?? null,
			}),
		);

		try {
			await Promise.all(promises);
			toast.success("All changes saved successfully");
			setDirty(false);
		} catch (e: any) {
			// Errors are handled by onError callback
			console.error(e);
		}
	}

	return (
		<div>
			<div className="mb-4 flex justify-end">
				<Restricted
					user={currentUser}
					permissions={PermissionType.CREATE_ROLES}
				>
					<CreateRoleDialog
						currentUser={currentUser}
						nextPosition={nextPosition}
					/>
				</Restricted>
			</div>
			<Accordion type="multiple" className="w-full">
				{roles.map((r, i) => (
					<RoleCard
						key={r.id}
						role={r}
						currentUser={currentUser}
						onRoleChange={onRoleChange}
						onMove={onMove}
						index={i}
						total={total}
					/>
				))}
			</Accordion>

			<div className="fixed bottom-0 right-0 m-8">
				{dirty ? <Button onClick={saveAll}>Save Changes</Button> : null}
			</div>
		</div>
	);
}
