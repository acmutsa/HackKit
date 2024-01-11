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
import { perms } from "@/hackkit.config";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hook";
import { updateRole } from "@/actions/admin/user-actions";
import { useState } from "react";
import { titleCase } from "title-case";
import { Badge } from "@/components/shadcn/ui/badge";

interface UpdateRoleDialogProps {
	userID: string;
	name: string;
	currPermision: (typeof perms)[number];
	canMakeAdmins: boolean;
}

export default function UpdateRoleDialog({
	userID,
	currPermision,
	canMakeAdmins,
	name,
}: UpdateRoleDialogProps) {
	const [roleToSet, setRoleToSet] = useState(currPermision);
	const [open, setOpen] = useState(false);

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
					<DialogDescription>Update the role of any user on HackKit.</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="flex">
						{/* <Label htmlFor="name" className="text-right">
                        HackerTag
                    </Label>
                    <Input
                        onChange={(e) => setHackerTag(e.target.value)}
                        id="name"
                        placeholder="@HackerTag"
                        className="col-span-3"
                    /> */}
						<Select onValueChange={(v) => setRoleToSet(v as (typeof perms)[number])}>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder={titleCase(currPermision.replace("_", " "))} />
							</SelectTrigger>
							<SelectContent>
								{/* <SelectItem value="light">Light</SelectItem>
								<SelectItem value="dark">Dark</SelectItem>
								<SelectItem value="system">System</SelectItem> */}
								{perms.map((perm) => {
									if (!canMakeAdmins && (perm === "admin" || perm === "super_admin")) return null;
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
						<div className="flex sm:justify-start justify-center items-center gap-x-2 self-end h-full w-full">
							<Badge>{titleCase(currPermision.replace("_", " "))}</Badge>
							<span>&rarr;</span>
							<Badge>{titleCase(roleToSet.replace("_", " "))}</Badge>
						</div>
					) : null}
					<Button
						onClick={() => {
							if (roleToSet === currPermision) {
								return toast.warning("The user already has this role.");
							}
							toast.loading("Updating role...", { duration: 0 });
							execute({
								roleToSet,
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
