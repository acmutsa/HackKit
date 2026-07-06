"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { HackKitActionResult } from "@hackkit/ui";
import { Button } from "@hackkit/ui";
import type { ConfirmDiscordVerificationInput } from "../actions";

type DiscordVerifyFormProps = {
	code: string;
	username: string;
	confirmDiscordVerification: (
		values: ConfirmDiscordVerificationInput,
	) => Promise<HackKitActionResult<unknown>>;
};

export function DiscordVerifyForm({
	code,
	username,
	confirmDiscordVerification,
}: DiscordVerifyFormProps) {
	const router = useRouter();
	const [pending, setPending] = React.useState(false);

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setPending(true);
		const result = await confirmDiscordVerification({ code });
		setPending(false);
		if (!result.ok) {
			toast.error(result.message);
			return;
		}
		toast.success("Discord account linked.");
		router.push("/discord");
		router.refresh();
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="space-y-4 rounded-lg border bg-card p-6 shadow-sm"
		>
			<div className="space-y-2">
				<p className="text-sm font-medium text-primary">Discord verification</p>
				<h1 className="text-2xl font-bold tracking-tight">
					Link @{username}?
				</h1>
				<p className="text-sm text-muted-foreground">
					This links your Discord account to your approved Hacker profile and
					syncs your participant, role, and Group roles.
				</p>
			</div>
			<Button type="submit" disabled={pending}>
				{pending ? "Linking..." : "Link Discord"}
			</Button>
		</form>
	);
}
