import c from "@/hackkit.config";
import { auth } from "@clerk/nextjs";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Button } from "@/components/shadcn/ui/button";
import Link from "next/link";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { ImExit } from "react-icons/im";
import Image from "next/image";
import TeamInvite from "@/components/dash/team/invite";
import { Fragment } from "react";

export default async function Page() {
	const { userId } = auth();
	if (!userId) return null;

	// TODO: make this db query not so bad
	const user = await db.query.users.findFirst({
		where: eq(users.clerkID, userId),
		with: {
			invites: true,
			team: {
				with: {
					members: {
						with: {
							profileData: true,
						},
					},
				},
			},
		},
	});
	if (!user) return null;

	if (!user.teamID) {
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
							user.invites.map((invite) => (
								<p key={invite.teamID}>Invite to team {invite.teamID}</p>
							))
						) : (
							<p>No Pending Invites</p>
						)}
					</div>
				</div>
			</main>
		);
	} else {
		if (!user.team) return null;
		const team = user.team;
		return (
			<main className="max-w-5xl min-h-[70%] mx-auto w-full flex flex-col items-center mt-16">
				<div className="fixed left-1/2 top-[calc(50%+7rem)] overflow-x-hidden h-[40vh] w-[800px] max-w-screen -translate-x-1/2 -translate-y-1/2 scale-150 bg-hackathon opacity-30 blur-[100px] will-change-transform"></div>
				<h2 className="text-4xl font-extrabold">{c.hackathonName}</h2>
				<h1 className="text-6xl md:text-8xl mb-10 font-extrabold text-hackathon dark:text-transparent dark:bg-gradient-to-t dark:from-hackathon/80 dark:to-white dark:bg-clip-text">
					Team
				</h1>
				<div className="min-h-[60vh] w-full max-w-[500px] aspect-video dark:bg-white/[0.08] bg-white backdrop-blur transition rounded-xl p-5">
					<div className="w-full grid grid-cols-3 border-b-primary/[0.09] border-b pb-2">
						<div className="flex flex-col justify-center text-sm">
							<p>You are in a team!</p>
							<Link className="text-xs text-blue-500 hover:underline" href={"#"}>
								How do Teams work?
							</Link>
						</div>
						<div className="flex items-center justify-end col-span-2 gap-x-2">
							<TeamInvite />
							<Button variant={"destructive"}>
								<ImExit className="mr-1" />
								Leave
							</Button>
						</div>
					</div>
					<div className="w-full flex flex-col items-center mt-10">
						<div className="w-[200px] mb-5 aspect-square rounded-full overflow-hidden relative">
							<Image
								className="object-cover object-center"
								fill
								src={team.photo}
								alt={`Team Photo for ${team.name}`}
							/>
						</div>
						<h1 className="font-black text-3xl">{team.name}</h1>
						<div className="border-t-primary/[0.09] border-t-2 pt-2 mt-2 w-full max-w-[350px]">
							{team.members.map((member) => (
								<Fragment key={member.hackerTag}>
									<Link href={`/@${member.hackerTag}`}>
										<div className="flex h-[60px] px-2 items-center rounded-xl cursor-pointer hover:dark:bg-white/[0.08] hover:backdrop-blur">
											<Image
												src={member.profileData.profilePhoto}
												alt={`${member.hackerTag}'s Profile Photo`}
												height={40}
												width={40}
												className="rounded-full"
											/>
											<div className="space-y-1 ml-2">
												<p className="leading-none">
													{member.firstName} {member.lastName}
												</p>
												<p className="text-xs leading-none font-mono text-muted-foreground">
													@{member.hackerTag}
												</p>
											</div>
										</div>
									</Link>
								</Fragment>
							))}
						</div>
					</div>
				</div>
			</main>
		);
	}
}

export const runtime = "edge";
