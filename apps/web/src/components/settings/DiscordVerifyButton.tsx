"use client";

import { Button } from "@/components/shadcn/ui/button";
import { useAction } from "next-safe-action/hooks";
import { confirmVerifyDiscord } from "@/actions/discord-verify";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function DiscordVerifyButton() {
	const searchParams = useSearchParams();
	const { push } = useRouter();
	const { execute: runConfirmVerifyDiscord } = useAction(
		confirmVerifyDiscord,
		{
			onSuccess: () => {
				toast.success("Accounts linked!");
				push("/discord-verify/linked");
			},
		},
	);

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
