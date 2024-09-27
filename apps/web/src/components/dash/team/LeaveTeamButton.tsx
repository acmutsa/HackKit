"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/shadcn/ui/button";
import { leaveTeam } from "@/actions/teams";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

interface LeaveTeamButtonProps {
	issueEmail: string;
}

export default function LeaveTeamButton({ issueEmail }: LeaveTeamButtonProps) {
	const { execute: runLeaveTeam, status } = useAction(leaveTeam, {
		onSuccess: ({ success, message }) => {
			toast.dismiss();
			if (success) {
				toast.success(message);
			} else {
				toast.error(message);
			}
		},
		onError: (error) => {
			toast.dismiss();
			toast.error(
				`An unknown error occured. If this persists, please email ${issueEmail}.`,
			);
			console.error("Fetch Error: ", error.fetchError);
			console.error("Server Error: ", error.serverError);
			console.error("Validation Error: ", error.validationError);
		},
	});

	function leave() {
		toast.loading("Leaving team...", {
			duration: 0,
		});
		runLeaveTeam(null);
	}

	return (
		<Button onClick={() => leave()} variant={"destructive"}>
			<LogOut className="mr-1" />
			Leave
		</Button>
	);
}
