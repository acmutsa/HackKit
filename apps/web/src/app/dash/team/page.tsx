import c from "@/hackkit.config";
import { auth } from "@clerk/nextjs";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Button } from "@/components/shadcn/ui/button";
import Link from "next/link";
import { BsFillPlusCircleFill } from "react-icons/bs";

export default async function Page() {
	const { userId } = auth();
	if (!userId) return null;
	const user = await db.query.users.findFirst({
		where: eq(users.clerkID, userId),
		with: {
			invites: true,
		},
	});
	if (!user) return null;

	return (
		<main className="max-w-5xl min-h-[70%] mx-auto w-full flex flex-col items-center mt-16">
			<div className="fixed left-1/2 top-[calc(50%+7rem)] overflow-x-hidden h-[40vh] w-[800px] max-w-screen -translate-x-1/2 -translate-y-1/2 scale-150 bg-hackathon opacity-30 blur-[100px] will-change-transform"></div>
			<h2 className="text-4xl font-extrabold">{c.hackathonName}</h2>
			<h1 className="text-6xl md:text-8xl mb-10 font-extrabold text-hackathon dark:text-transparent dark:bg-gradient-to-t dark:from-hackathon/80 dark:to-white dark:bg-clip-text">
				Team
			</h1>
			<div className="min-h-[60vh] w-full max-w-[500px] aspect-video dark:bg-white/[0.08] bg-white backdrop-blur transition rounded-xl p-5">
				<div className="w-full grid grid-cols-2 border-b-primary/[0.09] border-b pb-2">
					<div className="flex flex-col justify-center text-sm">
						<p>You are not currently in a team.</p>
						<Link className="text-xs text-blue-500 hover:underline" href={"#"}>
							How do Teams work?
						</Link>
					</div>
					<div className="flex items-center justify-end">
						<Link href="/dash/team/new">
							<Button>
								<BsFillPlusCircleFill className="mr-1" />
								New Team
							</Button>
						</Link>
					</div>
				</div>
				<div className="w-full flex flex-col items-center mt-10">
					<h2 className="font-bold font-xl mb-5">Invitations</h2>
					{user.invites.length > 0 ? (
						user.invites.map((invite) => <p>Invite to team {invite.teamID}</p>)
					) : (
						<p>No Pending Invites</p>
					)}
				</div>
			</div>
		</main>
	);
}

export const runtime = "edge";
