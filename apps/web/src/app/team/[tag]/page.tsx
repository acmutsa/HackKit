import { db } from "db";
import { teams } from "db/schema";
import { notFound } from "next/navigation";
import { eq } from "db/drizzle";
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
					commonData: true,
				},
			},
		},
	});

	if (!team) return notFound();

	return (
		<>
			<Navbar />
			<div className="max-w-screen fixed left-1/2 top-[calc(50%+7rem)] h-[40vh] w-[800px] -translate-x-1/2 -translate-y-1/2 scale-150 overflow-x-hidden bg-hackathon opacity-30 blur-[100px] will-change-transform"></div>
			<div className="relative flex min-h-screen flex-col items-center justify-center gap-y-2">
				<div className="relative mb-5 aspect-square w-[200px] overflow-hidden rounded-full">
					<Image
						className="object-cover object-center"
						fill
						src={team.photo}
						alt={`Team Photo for ${team.name}`}
					/>
				</div>
				<h1 className="text-3xl font-black">{team.name}</h1>
				{team.bio && team.bio.length > 0 && (
					<p className="font-bold">{team.bio}</p>
				)}
				<div className="mt-2 w-full max-w-[350px] border-t-2 border-t-primary/[0.09] pt-2">
					{team.members.map((member) => (
						<Link href={`/@${member.commonData.hackerTag}`}>
							<div className="flex h-[60px] cursor-pointer items-center rounded-xl px-2 backdrop-blur hover:dark:bg-white/[0.08]">
								<Image
									src={member.commonData.profilePhoto}
									alt={`${member.commonData.hackerTag}'s Profile Photo`}
									height={40}
									width={40}
									className="rounded-full"
								/>
								<div className="ml-2 space-y-1">
									<p className="leading-none">
										{member.commonData.firstName}{" "}
										{member.commonData.lastName}
									</p>
									<p className="font-mono text-xs leading-none text-muted-foreground">
										@{member.commonData.hackerTag}
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
