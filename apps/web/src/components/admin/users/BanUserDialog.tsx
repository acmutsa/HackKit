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
import { Button } from "@/components/shadcn/ui/button";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";
import { banUser } from "@/actions/admin/user-actions";
import { useState } from "react";
import { Textarea } from "@/components/shadcn/ui/textarea";

interface BanUserDialogProps {
	userID: string;
	name: string;
}

export default function BanUserDialog({ userID, name }: BanUserDialogProps) {
	const [reason, setReason] = useState("");
	const [open, setOpen] = useState(false);

	const { execute } = useAction(banUser, {
		async onSuccess() {
			toast.dismiss();
			toast.success("Successfully Banned!");
		},
		async onError(e) {
			toast.dismiss();
			toast.error("An error occurred while banning this user.");
			console.error(e);
		},
	});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant={"destructive"}>Ban</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Ban {name}.</DialogTitle>
					<DialogDescription>
						Ban this user (not permanent action).
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="flex">
						<Textarea
							placeholder="Reason"
							rows={3}
							onChange={(event) => setReason(event.target.value)}
						/>
					</div>
				</div>
				<DialogFooter>
					<Button
						onClick={() => {
							toast.loading("Banning User...", { duration: 0 });
							execute({
								userIDToUpdate: userID,
								reason: reason,
							});
							setOpen(false);
						}}
						type="submit"
						variant={"destructive"}
					>
						<span className="text-nowrap">Ban</span>
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
