"use client";

import { Button } from "@/components/shadcn/ui/button";
import { useAction } from "next-safe-action/hook";
import { confirmVerifyDiscord } from "@/actions/discord-verify";
import { redirect, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function DiscordVerifyButton() {
	const searchParams = useSearchParams();
	const { execute: runConfirmVerifyDiscord } = useAction(confirmVerifyDiscord, {
		onSuccess: () => {
			toast.success("Accounts linked!");
			redirect("/discord-verify/success");
		},
	});

	return (
		<>
			<Button
				onClick={() => {
					const search = searchParams.get("code");
					if (search) {
						toast.loading("Linking accounts...", { duration: 0 });
						runConfirmVerifyDiscord({ code: search });
					}
				}}
			>
				Link Accounts
			</Button>
			<Button variant={"destructive"}>Cancel</Button>
		</>
	);
}
