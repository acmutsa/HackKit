import { db } from "@/db";
import { teams } from "@/db/schema";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";

export default async function Page({ params }: { params: { tag: string } }) {
	if (!params.tag || params.tag.length <= 1) return notFound();

	const team = await db.query.teams.findFirst({
		where: eq(teams.tag, params.tag),
		with: {
			members: {
				with: {
					profileData: true,
				},
			},
		},
	});

	if (!team) return notFound();

	return (
		<>
			<Navbar />
			<div className="fixed left-1/2 top-[calc(50%+7rem)] overflow-x-hidden h-[40vh] w-[800px] max-w-screen -translate-x-1/2 -translate-y-1/2 scale-150 bg-hackathon opacity-30 blur-[100px] will-change-transform"></div>
			<div className="min-h-screen flex items-center justify-center flex-col gap-y-2 relative">
				<div className="w-[200px] mb-5 aspect-square rounded-full overflow-hidden relative">
					<Image
						className="object-cover object-center"
						fill
						src={team.photo}
						alt={`Team Photo for ${team.name}`}
					/>
				</div>
				<h1 className="font-black text-3xl">{team.name}</h1>
				{team.bio && team.bio.length > 0 && <p className="font-bold ">{team.bio}</p>}
				<div className="border-t-primary/[0.09] border-t-2 pt-2 mt-2 w-full max-w-[350px]">
					{team.members.map((member) => (
						<Link href={`/@${member.hackerTag}`}>
							<div className="flex h-[60px] px-2 items-center rounded-xl cursor-pointer hover:dark:bg-white/[0.08] backdrop-blur">
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
					))}
				</div>
			</div>
		</>
	);
}

export const runtime = "edge";
export const revalidate = 30;
