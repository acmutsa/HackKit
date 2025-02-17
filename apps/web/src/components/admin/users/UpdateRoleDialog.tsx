"use client";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogClose,
} from "@/components/shadcn/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/shadcn/ui/select";
import { Button } from "@/components/shadcn/ui/button";
import { perms } from "config";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";
import { updateRole } from "@/actions/admin/user-actions";
import React, { useState } from "react";
import { titleCase } from "title-case";
import { Badge } from "@/components/shadcn/ui/badge";

interface UpdateRoleDialogProps {
	userID: string;
	name: string;
	currPermision: (typeof perms)[number];
	canMakeAdmins: boolean;
	asDropDownItem?: boolean;
}

interface UpdateRoleDialogContentProps {
	roleToSet: (typeof perms)[number];
	name: string;
	currPermision: (typeof perms)[number];
	canMakeAdmins: boolean;
	setRoleToSet: React.Dispatch<React.SetStateAction<(typeof perms)[number]>>;
	handleRoleChange(): string | number | undefined;
}

export default function UpdateRoleDialog({
	userID,
	currPermision,
	canMakeAdmins,
	name,
	asDropDownItem,
}: UpdateRoleDialogProps) {
	const [roleToSet, setRoleToSet] = useState(currPermision);

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

	function handleRoleChange() {
		if (roleToSet === currPermision) {
			return toast.warning("The user already has this role.");
		}
		toast.loading("Updating role...", { duration: 0 });
		execute({
			roleToSet,
			userIDToUpdate: userID,
		});
	}

	return (
		<>
			{asDropDownItem ? (
				<>
					<UpdateRoleDialogContent
						currPermision={currPermision}
						canMakeAdmins={canMakeAdmins}
						name={name}
						setRoleToSet={setRoleToSet}
						roleToSet={roleToSet}
						handleRoleChange={handleRoleChange}
					/>
				</>
			) : (
				<Dialog>
					<DialogTrigger asChild>
						<Button variant={"outline"}>Change Role</Button>
					</DialogTrigger>
					<UpdateRoleDialogContent
						currPermision={currPermision}
						canMakeAdmins={canMakeAdmins}
						name={name}
						setRoleToSet={setRoleToSet}
						roleToSet={roleToSet}
						handleRoleChange={handleRoleChange}
					/>
				</Dialog>
			)}
		</>
	);
}

function UpdateRoleDialogContent({
	currPermision,
	canMakeAdmins,
	name,
	setRoleToSet,
	roleToSet,
	handleRoleChange,
}: UpdateRoleDialogContentProps) {
	return (
		<DialogContent className="sm:max-w-[425px]">
			<DialogHeader>
				<DialogTitle>Update {name}'s Role</DialogTitle>
				<DialogDescription>
					Update the role of any user on HackKit.
				</DialogDescription>
			</DialogHeader>
			<div className="grid gap-4 py-4">
				<div className="flex">
					<Select
						onValueChange={(v) =>
							setRoleToSet(v as (typeof perms)[number])
						}
					>
						<SelectTrigger className="w-[180px]">
							<SelectValue
								placeholder={titleCase(
									currPermision.replace("_", " "),
								)}
							/>
						</SelectTrigger>
						<SelectContent>
							{perms.map((perm) => {
								if (
									(!canMakeAdmins &&
										(perm === "admin" ||
											perm === "super_admin")) ||
									perm === "volunteer" ||
									perm === "hacker_volunteer"
								)
									return null;
								return (
									<SelectItem key={perm} value={perm}>
										{titleCase(perm.replace("_", " "))}
									</SelectItem>
								);
							})}
						</SelectContent>
					</Select>
				</div>
			</div>
			<DialogFooter>
				{roleToSet !== currPermision ? (
					<div className="flex h-full w-full items-center justify-center gap-x-2 self-end sm:justify-start">
						<Badge>
							{titleCase(currPermision.replace("_", " "))}
						</Badge>
						<span>&rarr;</span>
						<Badge>{titleCase(roleToSet.replace("_", " "))}</Badge>
					</div>
				) : null}
				<DialogClose asChild>
					<Button onClick={() => handleRoleChange()} type="submit">
						<span className="text-nowrap">Update Role</span>
					</Button>
				</DialogClose>
			</DialogFooter>
		</DialogContent>
	);
}
