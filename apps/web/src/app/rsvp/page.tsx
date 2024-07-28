import ConfirmDialogue from "@/components/rsvp/ConfirmDialogue";
import c from "config";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "db";
import { eq } from "db/drizzle";
import { users } from "db/schema";
import ClientToast from "@/components/shared/ClientToast";
import { SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { kv } from "@vercel/kv";
import { parseRedisBoolean } from "@/lib/utils/server/redis";
import Link from "next/link";
import { Button } from "@/components/shadcn/ui/button";
import { CheckCircleIcon } from "lucide-react";

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

	const user = await db.query.users.findFirst({
		where: eq(users.clerkID, userId),
	});

	if (!user) {
		return redirect("/register");
	}

	const rsvpEnabled = await kv.get("config:registration:allowRSVPs");

	// TODO: fix type jank here
	if (
		parseRedisBoolean(rsvpEnabled as string | boolean | null | undefined, true) === true ||
		user.rsvp === true
	) {
		return (
			<>
				<ClientToast />
				<main className="max-w-5xl min-h-screen mx-auto w-full flex flex-col items-center justify-center">
					<div className="fixed left-1/2 top-[calc(50%+7rem)] overflow-x-hidden h-[40vh] w-[800px] max-w-screen -translate-x-1/2 -translate-y-1/2 scale-150 bg-hackathon opacity-30 blur-[100px] will-change-transform"></div>
					<h2 className="text-4xl font-extrabold">{c.hackathonName}</h2>
					<h1 className="text-6xl md:text-8xl mb-10 font-extrabold text-hackathon dark:text-transparent dark:bg-gradient-to-t dark:from-hackathon/80 dark:to-white dark:bg-clip-text">
						RSVP
					</h1>
					<ConfirmDialogue hasRsvped={user.rsvp} />
				</main>
			</>
		);
	} else {
		return (
			<main className="max-w-5xl min-h-screen mx-auto w-full flex flex-col items-center justify-center">
				<div className="fixed left-1/2 top-[calc(50%+7rem)] overflow-x-hidden h-[40vh] w-[800px] max-w-screen -translate-x-1/2 -translate-y-1/2 scale-150 bg-hackathon opacity-30 blur-[100px] will-change-transform"></div>
				<h2 className="text-4xl font-extrabold">{c.hackathonName}</h2>
				<h1 className="text-6xl md:text-8xl mb-10 font-extrabold text-hackathon dark:text-transparent dark:bg-gradient-to-t dark:from-hackathon/80 dark:to-white dark:bg-clip-text">
					RSVP
				</h1>
				<div className="w-full max-w-[500px] aspect-video relative dark:bg-white/[0.08] bg-white backdrop-blur transition rounded-xl p-5 flex flex-col items-center justify-center">
					<h1 className="flex items-center gap-x-2 font-bold text-2xl text-red-500 text-center">
						RSVPs Are Currently Closed
					</h1>
					<p className="pt-5 pb-10 text-center">
						We have currently reached capacity for RSVPs. However, we still encourage you to show up
						for walk-ins! If you have any questions or concerns, feel free to ask on{" "}
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
