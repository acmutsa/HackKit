import ConfirmDialogue from "@/components/rsvp/ConfirmDialogue";
import c from "config";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { count, db } from "db";
import { eq } from "db/drizzle";
import { userCommonData } from "db/schema";
import ClientToast from "@/components/shared/ClientToast";
import { SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import {
	parseRedisBoolean,
	parseRedisNumber,
	redisGet,
} from "@/lib/utils/server/redis";
import Link from "next/link";
import { Button } from "@/components/shadcn/ui/button";
import { getUser } from "db/functions";

export default async function RsvpPage({
	searchParams,
}: {
	searchParams?: { [key: string]: string | string[] | undefined };
}) {
	const { userId } = auth();

	if (!userId) {
		console.error("No user id");
		return (
			<SignedOut>
				<RedirectToSignIn afterSignInUrl={"/rsvp"} />
			</SignedOut>
		);
	}

	const user = await getUser(userId);
	if (!user) return redirect("/register");

	if (
		(c.featureFlags.core.requireUsersApproval as boolean) === true &&
		user.isApproved === false &&
		user.role === "hacker"
	) {
		return redirect("/i/approval");
	}

	const rsvpEnabled = parseRedisBoolean(
		(await redisGet("config:registration:allowRSVPs")) as
			| string
			| boolean
			| null
			| undefined,
		true,
	);

	let isRsvpPossible = false;

	if (rsvpEnabled === true) {
		const rsvpLimit = parseRedisNumber(
			await redisGet("config:registration:maxRSVPs"),
			c.rsvpDefaultLimit,
		);

		const rsvpUserCount = await db
			.select({ count: count() })
			.from(userCommonData)
			.where(eq(userCommonData.isRSVPed, true))
			.limit(rsvpLimit)
			.then((result) => result[0].count);

		isRsvpPossible = rsvpUserCount < rsvpLimit;
	}

	if (isRsvpPossible || user.isRSVPed === true) {
		return (
			<>
				<ClientToast />
				<main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center">
					<div className="max-w-screen fixed left-1/2 top-[calc(50%+7rem)] h-[40vh] w-[800px] -translate-x-1/2 -translate-y-1/2 scale-150 overflow-x-hidden bg-hackathon opacity-30 blur-[100px] will-change-transform"></div>
					<h2 className="text-4xl font-extrabold">
						{c.hackathonName}
					</h2>
					<h1 className="mb-10 text-6xl font-extrabold text-hackathon dark:bg-gradient-to-t dark:from-hackathon/80 dark:to-white dark:bg-clip-text dark:text-transparent md:text-8xl">
						RSVP
					</h1>
					<ConfirmDialogue hasRsvped={user.isRSVPed} />
				</main>
			</>
		);
	} else {
		return (
			<main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center">
				<div className="max-w-screen fixed left-1/2 top-[calc(50%+7rem)] h-[40vh] w-[800px] -translate-x-1/2 -translate-y-1/2 scale-150 overflow-x-hidden bg-hackathon opacity-30 blur-[100px] will-change-transform"></div>
				<h2 className="text-4xl font-extrabold">{c.hackathonName}</h2>
				<h1 className="mb-10 text-6xl font-extrabold text-hackathon dark:bg-gradient-to-t dark:from-hackathon/80 dark:to-white dark:bg-clip-text dark:text-transparent md:text-8xl">
					RSVP
				</h1>
				<div className="relative flex aspect-video w-full max-w-[500px] flex-col items-center justify-center rounded-xl bg-white p-5 backdrop-blur transition dark:bg-white/[0.08]">
					<h1 className="flex items-center gap-x-2 text-center text-2xl font-bold text-red-500">
						RSVPs Are Currently Closed
					</h1>
					<p className="pb-10 pt-5 text-center">
						We have currently reached capacity for RSVPs. However,
						we still encourage you to show up for walk-ins! If you
						have any questions or concerns, feel free to ask on{" "}
						<Link href={c.links.discord} className="underline">
							Discord
						</Link>{" "}
						or email us at {c.issueEmail}!
					</p>
					<Link href={"/dash"}>
						<Button>Go To Dashboard</Button>
					</Link>
				</div>
			</main>
		);
	}
}

export const runtime = "edge";
