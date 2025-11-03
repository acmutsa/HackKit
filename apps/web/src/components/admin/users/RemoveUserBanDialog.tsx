"use client";
import {
	Dialog,
	DialogContent,
	DialogTrigger,
} from "@/components/shadcn/ui/dialog";
import { Button } from "@/components/shadcn/ui/button";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";
import { removeUserBan } from "@/actions/admin/user-actions";
import { useState } from "react";

interface BanUserDialogProps {
	userID: string;
	name: string;
	reason: string;
}

export default function RemoveUserBanDialog({
	userID,
	reason,
	name,
}: BanUserDialogProps) {
	const [open, setOpen] = useState(false);

	const { execute } = useAction(removeUserBan, {
		async onSuccess() {
			toast.dismiss();
			toast.success("Suspension successfully removed!");
		},
		async onError(e) {
			toast.dismiss();
			toast.error("An error occurred while removing suspension.");
			console.error(e);
		},
	});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant={"destructive"}>Unban</Button>
			</DialogTrigger>
			<DialogContent>
				<div className="font-bold">
					Are you sure you want to unban {name}?
				</div>
				<div className="pt-2">
					<strong className="font-medium">Reason for ban:</strong>{" "}
					{reason}
				</div>
				<Button
					onClick={() => {
						toast.loading("Unbanning User...", { duration: 0 });
						execute({
							userIDToUpdate: userID,
						});
						setOpen(false);
					}}
					type="submit"
					variant={"destructive"}
				>
					<span className="text-nowrap">Unban</span>
				</Button>
			</DialogContent>
		</Dialog>
	);
}
