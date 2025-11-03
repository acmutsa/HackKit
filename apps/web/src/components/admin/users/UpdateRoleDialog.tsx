"use client";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/shadcn/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/shadcn/ui/select";
import { Button } from "@/components/shadcn/ui/button";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";
import { updateRole } from "@/actions/admin/user-actions";
import { useState } from "react";
import { Badge } from "@/components/shadcn/ui/badge";
import { db } from "db";
import { titleCase } from "@/lib/utils/shared/string";

interface UpdateRoleDialogProps {
	userID: string;
	name: string;
	currentRoleId: number;
}

export default async function UpdateRoleDialog({
	userID,
	currentRoleId,
	name,
}: UpdateRoleDialogProps) {
	const [roleToSet, setRoleToSet] = useState(currentRoleId);
	const [open, setOpen] = useState(false);

	const roles = await db.query.roles.findMany();

	const currentRoleName = titleCase(
		roles.find((r) => r.id === currentRoleId)?.name.replace("_", " ") || "",
	);

	const { execute } = useAction(updateRole, {
		async onSuccess() {
			toast.dismiss();
			toast.success("Role updated successfully!");
		},
		async onError(e) {
			toast.dismiss();
			toast.error("An error occurred while updating the role.");
			console.error(e);
		},
	});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant={"outline"}>Change Role</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Update {name}'s Role</DialogTitle>
					<DialogDescription>
						Update the role of any user on HackKit.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="flex">
						<Select onValueChange={(v) => setRoleToSet(Number(v))}>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder={currentRoleName} />
							</SelectTrigger>
							<SelectContent>
								{roles.map(({ id, name }) => {
									return (
										<SelectItem key={id} value={String(id)}>
											{titleCase(name.replace("_", " "))}
										</SelectItem>
									);
								})}
							</SelectContent>
						</Select>
					</div>
				</div>
				<DialogFooter>
					{roleToSet !== currentRoleId ? (
						<div className="flex h-full w-full items-center justify-center gap-x-2 self-end sm:justify-start">
							<Badge>{currentRoleName}</Badge>
							<span>&rarr;</span>
							<Badge>{currentRoleName}</Badge>
						</div>
					) : null}
					<Button
						onClick={() => {
							if (roleToSet === currentRoleId) {
								return toast.warning(
									"The user already has this role.",
								);
							}
							toast.loading("Updating role...", { duration: 0 });
							execute({
								roleIdToSet: roleToSet,
								userIDToUpdate: userID,
							});
							setOpen(false);
						}}
						type="submit"
					>
						<span className="text-nowrap">Update Role</span>
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
