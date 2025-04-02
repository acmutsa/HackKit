import c from "config";
import { auth } from "@clerk/nextjs/server";
import { db } from "db";
import { userCommonData } from "db/schema";
import { eq } from "db/drizzle";
import { Button } from "@/components/shadcn/ui/button";
import Link from "next/link";
import { Plus, User } from "lucide-react";
import Image from "next/image";
import TeamInvite from "@/components/dash/team/invite";
import { Fragment } from "react";
import { Badge } from "@/components/shadcn/ui/badge";
import LeaveTeamButton from "@/components/dash/team/LeaveTeamButton";

export default async function Page() {
	const { userId } = await auth();
	if (!userId) return null;

	// TODO: make this db query not so bad
	const user = await db.query.userCommonData.findFirst({
		where: eq(userCommonData.clerkID, userId),
		with: {
			hackerData: {
				with: {
					team: {
						with: {
							members: {
								with: {
									commonData: true,
								},
							},
						},
					},
					invites: {
						with: {
							team: true,
						},
					},
				},
			},
		},
	});
	if (!user) return null;

	if (!user.hackerData.teamID) {
		return (
			<main className="mx-auto mt-16 flex min-h-[70%] w-full max-w-5xl flex-col items-center">
				<div className="max-w-screen fixed left-1/2 top-[calc(50%+7rem)] h-[40vh] w-[800px] -translate-x-1/2 -translate-y-1/2 scale-150 overflow-x-hidden bg-hackathon opacity-30 blur-[100px] will-change-transform"></div>
				<h2 className="text-4xl font-extrabold">{c.hackathonName}</h2>
				<h1 className="mb-10 text-6xl font-extrabold text-hackathon dark:bg-gradient-to-t dark:from-hackathon/80 dark:to-white dark:bg-clip-text dark:text-transparent md:text-8xl">
					Team
				</h1>
				<div className="aspect-video min-h-[60vh] w-full max-w-[500px] rounded-xl bg-white p-5 backdrop-blur transition dark:bg-white/[0.08]">
					<div className="grid w-full grid-cols-2 border-b border-b-primary/[0.09] pb-2">
						<div className="flex flex-col justify-center text-sm">
							<p>You are not currently in a team.</p>
							<Link
								className="text-xs text-blue-500 hover:underline"
								href={"#"}
							>
								How do Teams work?
							</Link>
						</div>
						<div className="flex items-center justify-end">
							<Link href="/dash/team/new">
								<Button>
									<Plus className="mr-1" />
									New Team
								</Button>
							</Link>
						</div>
					</div>
					<div className="mt-10 flex w-full flex-col items-center">
						<h2 className="font-xl mb-5 text-2xl font-bold">
							Invitations
						</h2>
						{user.hackerData.invites.length > 0 ? (
							user.hackerData.invites.map((invite) => (
								<div
									className="grid h-16 w-full grid-cols-3 rounded-xl px-2"
									key={invite.teamID}
								>
									<div className="flex h-full w-full flex-col justify-center">
										<h1 className="font-bold">
											{invite.team.name}
										</h1>
										<h2 className="font-mono text-xs leading-none">
											~{invite.team.tag}
										</h2>
									</div>
									<div className="col-span-2 flex h-full items-center justify-end gap-x-2">
										<Link href={`/~${invite.team.tag}`}>
											<Button>View Team</Button>
										</Link>
										<Button>Accept</Button>
									</div>
								</div>
							))
						) : (
							<p>No Pending Invites</p>
						)}
					</div>
				</div>
			</main>
		);
	} else {
		if (!user.hackerData.team) return null;
		const team = user.hackerData.team;
		return (
			<main className="mx-auto mt-16 flex min-h-[70%] w-full max-w-5xl flex-col items-center font-sans">
				<div className="mb-5 grid w-full grid-cols-2">
					<div className="flex items-center">
						<div>
							<h2 className="flex items-center gap-x-1 text-3xl font-bold tracking-tight">
								<User />
								Team
							</h2>
							{/* <p className="text-sm text-muted-foreground">{users.length} Total Users</p> */}
						</div>
					</div>
					<div className="flex items-center justify-end gap-2">
						<TeamInvite />
						<LeaveTeamButton issueEmail={c.issueEmail} />
					</div>
				</div>
				<div className="mt-20 grid min-h-[500px] w-full grid-cols-3">
					<div className="flex h-full w-full max-w-[250px] flex-col items-center">
						<div className="relative aspect-square h-min w-full overflow-hidden rounded-full">
							<Image
								className="object-cover object-center"
								fill
								src={team.photo}
								alt={`Team Photo for ${team.name}`}
							/>
						</div>
						<h1 className="mt-4 text-center text-3xl font-semibold">
							{team.name}
						</h1>
						<h2 className="font-mono text-muted-foreground">
							~{team.tag}
						</h2>
						<p className="mt-5 text-sm">{team.bio}</p>
						<div className="mt-5 flex gap-x-2">
							<Badge className="no-select">
								Est.{" "}
								{team.createdAt
									.toDateString()
									.split(" ")
									.slice(1)
									.join(" ")}
							</Badge>
						</div>
					</div>
					<div
						className="col-span-2 grid aspect-video w-full grid-cols-2 rounded-2xl border-2 border-muted bg-[radial-gradient(#27272a,_1px,_transparent_0)]"
						style={{
							backgroundSize: "30px 30px",
						}}
					>
						{team.members.map((member) => (
							<Fragment key={member.commonData.hackerTag}>
								<Link href={`/@${member.commonData.hackerTag}`}>
									<div className="flex h-full w-full items-center justify-center">
										<div className="flex h-[75px] w-[200px] items-center justify-center gap-x-2 rounded border-2 border-muted bg-zinc-900 p-2 transition-colors duration-150 hover:border-muted-foreground hover:bg-muted">
											<Image
												src={
													member.commonData
														.profilePhoto
												}
												alt={`${member.commonData.hackerTag}'s Profile Photo`}
												height={40}
												width={40}
												className="!aspect-square rounded-full"
											/>
											<div>
												<h3>
													{
														member.commonData
															.firstName
													}{" "}
													{member.commonData.lastName}
												</h3>
												<h4 className="max-w-[16ch] overflow-hidden text-ellipsis whitespace-nowrap font-mono text-xs">
													@
													{
														member.commonData
															.hackerTag
													}
												</h4>
											</div>
										</div>
									</div>
								</Link>
							</Fragment>
						))}
					</div>
				</div>
			</main>
		);
	}
}

export const runtime = "edge";
