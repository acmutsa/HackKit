import { db } from "db";
import { discordVerification, users } from "db/schema";
import { eq, and, or } from "db/drizzle";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs";
import c from "config";
import Balancer from "react-wrap-balancer";
import { MoveRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/shadcn/ui/button";

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

	const { userId } = auth();

	if (!userId) {
		return notFound();
	}

	const verification = await db.query.discordVerification.findFirst({
		where: and(
			eq(discordVerification.code, passedCode),
			or(eq(discordVerification.status, "pending"), eq(discordVerification.status, "expired"))
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
			<main className="min-h-screen flex items-center justify-center">
				<p className="text-center">
					This verification link has expired. Please click the verify button in discord again to
					generate a new one.
				</p>
			</main>
		);
	}

	const user = await db.query.users.findFirst({
		where: eq(users.clerkID, userId),
	});

	if (!verification) {
		return notFound();
	}

	return (
		<main className="min-h-screen w-screen flex items-center justify-center">
			<div className="aspect-square border border-muted w-full max-w-[500px] rounded-xl flex flex-col items-center justify-center">
				<div className="flex items-center gap-x-5 pb-10">
					<Image
						height={100}
						width={100}
						alt="Discord Profile Photo"
						className="rounded-full aspect-square max-w-[75px]"
						src={`https://cdn.discordapp.com/avatars/${verification.discordUserID}/${verification.discordProfilePhoto}.png`}
					/>
					<MoveRight />
					<Image
						height={100}
						width={100}
						alt="Discord Profile Photo"
						className="rounded-full aspect-square max-w-[75px]"
						src={c.icon.md}
					/>
				</div>
				<h1 className="text-2xl font-bold text-center pb-16">
					<Balancer>
						Link @{verification.discordName} to your
						<br />
						{c.hackathonName} account?
					</Balancer>
				</h1>
				<div className="flex flex-col gap-5">
					<Button>Link Accounts</Button>
					<Button variant={"destructive"}>Cancel</Button>
				</div>
			</div>
		</main>
	);
}

export const runtime = "edge";
