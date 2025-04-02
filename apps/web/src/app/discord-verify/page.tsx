import { db } from "db";
import { discordVerification, userCommonData } from "db/schema";
import { eq, and, or } from "db/drizzle";
import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import c from "config";
import Balancer from "react-wrap-balancer";
import { MoveRight } from "lucide-react";
import Image from "next/image";
import ClientToast from "@/components/shared/ClientToast";
import DiscordVerifyButton from "@/components/settings/DiscordVerifyButton";

export default async function Page({
	params,
	searchParams,
}: {
	params: { slug: string };
	searchParams?: { [key: string]: string | string[] | undefined };
}) {
	const passedCode = searchParams?.code;

	if (!passedCode || typeof passedCode !== "string") {
		console.log("no code");
		console.log(passedCode);
		return notFound();
	}

	const { userId } = await auth();

	if (!userId) {
		return redirect("/sign-in");
	}

	const user = await db.query.userCommonData.findFirst({
		where: eq(userCommonData.clerkID, userId),
		with: {
			discordVerification: true,
		},
	});

	if (!user) {
		return redirect("/register");
	}

	if (
		(c.featureFlags.core.requireUsersApproval as boolean) === true &&
		user.isApproved === false &&
		user.role === "hacker"
	) {
		return redirect("/i/approval");
	}

	if (user.discordVerification) {
		await db
			.update(discordVerification)
			.set({ status: "rejected" })
			.where(eq(discordVerification.code, passedCode));
		return redirect("/discord-verify/linked");
	}

	const verification = await db.query.discordVerification.findFirst({
		where: and(
			eq(discordVerification.code, passedCode),
			or(
				eq(discordVerification.status, "pending"),
				eq(discordVerification.status, "expired"),
			),
		),
	});

	if (!verification) {
		return notFound();
	}

	const expiresAt = new Date();
	expiresAt.setTime(verification.createdAt.getTime() + 5 * 60 * 1000);

	if (verification && new Date() > expiresAt) {
		await db
			.update(discordVerification)
			.set({ status: "expired" })
			.where(eq(discordVerification.code, passedCode));
		return (
			<main className="flex min-h-screen items-center justify-center">
				<p className="text-center">
					This verification link has expired. Please click the verify
					button in discord again to generate a new one.
				</p>
			</main>
		);
	}

	if (!verification) {
		return notFound();
	}

	return (
		<>
			<ClientToast />
			<main className="flex min-h-screen w-screen items-center justify-center">
				<div className="flex aspect-square w-full max-w-[500px] flex-col items-center justify-center rounded-xl border border-muted">
					<div className="flex items-center gap-x-5 pb-10">
						<Image
							height={100}
							width={100}
							alt="Discord Profile Photo"
							className="aspect-square max-w-[75px] rounded-full"
							src={`https://cdn.discordapp.com/avatars/${verification.discordUserID}/${verification.discordProfilePhoto}.png`}
						/>
						<MoveRight />
						<Image
							height={100}
							width={100}
							alt="Discord Profile Photo"
							className="aspect-square max-w-[75px] rounded-full"
							src={c.icon.md}
						/>
					</div>
					<h1 className="pb-16 text-center text-2xl font-bold">
						<Balancer>
							Link @{verification.discordName} to your
							<br />
							{c.hackathonName} account?
						</Balancer>
					</h1>
					<div className="flex flex-col gap-5">
						<DiscordVerifyButton />
					</div>
				</div>
			</main>
		</>
	);
}

export const runtime = "edge";
