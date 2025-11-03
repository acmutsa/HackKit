"use client";

import { useState } from "react";
import { Button } from "@/components/shadcn/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/shadcn/ui/dialog";
import { useAction } from "next-safe-action/hooks";
import { deleteRole } from "@/actions/admin/role-actions";
import { toast } from "sonner";
import { UserWithRole } from "db/types";
import { InferSelectModel } from "drizzle-orm";
import { roles } from "db/schema";

type Role = InferSelectModel<typeof roles>;

export default function DeleteRoleDialog({
	role,
	class_name,
}: {
	role: Role;
	currentUser: UserWithRole;
	class_name?: string;
}) {
	const [open, setOpen] = useState(false);
	const { execute: doDelete } = useAction(deleteRole, {
		onError: ({ error }) => {
			toast.error(
				"Failed to delete role: " +
					(error.serverError || "Unknown error"),
			);
		},
		onSuccess: () => {
			toast.success("Role deleted successfully");
			setOpen(false);
		},
	});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="destructive" className={class_name}>
					Delete
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete Role</DialogTitle>
				</DialogHeader>
				<p>
					Are you sure you want to delete the role "{role.name}"? This
					action cannot be undone.
				</p>
				<div className="mt-4 flex justify-end gap-2">
					<Button variant="outline" onClick={() => setOpen(false)}>
						Cancel
					</Button>
					<Button
						variant="destructive"
						onClick={() => doDelete({ roleId: role.id })}
					>
						Delete
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
