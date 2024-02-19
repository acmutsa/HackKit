import ConfirmDialogue from "@/components/rsvp/ConfirmDialogue";
import c from "config";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "db";
import { eq } from "db/drizzle";
import { users } from "db/schema";
import ClientToast from "@/components/shared/ClientToast";

export default async function RsvpPage({
	searchParams,
}: {
	searchParams?: { [key: string]: string | string[] | undefined };
}) {
	const { userId } = auth();

	if (!userId) {
		return redirect("/");
	}

	const user = await db.query.users.findFirst({
		where: eq(users.clerkID, userId),
	});

	if (!user) {
		return <div>loading...</div>;
	}

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
}

export const runtime = "edge";
