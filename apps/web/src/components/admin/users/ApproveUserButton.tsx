"use client";

import { Button } from "@/components/shadcn/ui/button";
import { useAction } from "next-safe-action/hooks";
import { setUserApproval } from "@/actions/admin/user-actions";
import { toast } from "sonner";

interface ApproveUserButtonProps {
	userIDToUpdate: string;
	currentApproval: boolean;
}

export default function ApproveUserButton({
	userIDToUpdate,
	currentApproval,
}: ApproveUserButtonProps) {
	const { execute, status } = useAction(setUserApproval, {
		onSuccess: () => {
			toast.dismiss();
			console.log("Success");
			toast.success(`User ${currentApproval ? "Un-a" : "A"}pproved!`);
		},
		onError: (e) => {
			toast.dismiss();
			console.log("Error", e);
			toast.error(
				"An error occurred while changing user approval. Please try again.",
			);
		},
	});

	return (
		<Button
			onClick={() => {
				toast.loading("Changing user approval...");
				execute({ userIDToUpdate, approved: !currentApproval });
			}}
			variant={"outline"}
			disabled={status === "executing"}
		>
			{currentApproval ? "Un-a" : "A"}pprove User
		</Button>
	);
}
