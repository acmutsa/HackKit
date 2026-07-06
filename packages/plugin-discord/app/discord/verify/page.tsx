import { notFound, redirect } from "next/navigation";
import { getHackkitRuntime } from "@hackkit/next";
import type { DiscordApi } from "../../../src/api";
import { confirmDiscordVerification } from "@/app/hackkit-plugin-actions";
import { DiscordVerifyForm } from "../../../src/components/discord-verify-form";

export const dynamic = "force-dynamic";

export default async function DiscordVerifyPage({
	searchParams,
}: {
	searchParams?: { code?: string | string[] };
}) {
	const code = searchParams?.code;
	if (!code || Array.isArray(code)) notFound();

	const runtime = await getHackkitRuntime();
	const currentUser = await runtime.getCurrentUser();
	const [hacker, discord] = await Promise.all([
		runtime.hackkit.hackers.getHacker(currentUser.authId),
		Promise.resolve(runtime.hackkit.plugins.discord as DiscordApi),
	]);
	if (!currentUser.isApproved || !hacker) redirect("/i/approval");

	const existingMember = await discord.getMember(currentUser.authId);
	if (existingMember) redirect("/discord");

	const verification = await discord.getVerification(code);
	if (!verification || verification.status !== "pending") notFound();
	if (verification.expiresAt.getTime() <= Date.now()) {
		return (
			<main className="flex min-h-screen items-center justify-center px-6">
				<div className="max-w-md rounded-lg border bg-card p-6 text-center shadow-sm">
					<h1 className="text-xl font-semibold">Verification expired</h1>
					<p className="mt-2 text-sm text-muted-foreground">
						Use the Discord verification button again to generate a new link.
					</p>
				</div>
			</main>
		);
	}

	return (
		<main className="flex min-h-screen items-center justify-center bg-muted/30 px-6 py-10">
			<div className="w-full max-w-md">
				<DiscordVerifyForm
					code={code}
					username={verification.username}
					confirmDiscordVerification={confirmDiscordVerification}
				/>
			</div>
		</main>
	);
}
