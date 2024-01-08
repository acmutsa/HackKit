import { db } from "db";
import { users } from "db/schema";
import { eq } from "db/drizzle";
import { notFound } from "next/navigation";
import Image from "next/image";
import RoleBadge from "@/components/dash/shared/RoleBadge";
import { Balancer } from "react-wrap-balancer";
import Link from "next/link";
import { CgWebsite } from "react-icons/cg";
import { BsGithub, BsLinkedin, BsGlobe } from "react-icons/bs";
import Navbar from "@/components/shared/Navbar";

export default async function ({ params }: { params: { tag: string } }) {
	if (!params.tag || params.tag.length <= 1) return notFound();

	const user = await db.query.users.findFirst({
		where: eq(users.hackerTag, params.tag),
		with: { profileData: true, registrationData: true },
	});

	if (!user) return notFound();

	return (
		<>
			<Navbar />
			<div className="max-w-screen min-h-screen flex items-center justify-center relative bg-nav">
				<div className="absolute bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] blur-[100px] -translate-y-[22vh] from-[color-mix(in_hsl_longer_hue,hsl(var(--hackathon-primary))_80%,#fff)] via-hackathon to-transparent w-[60vw] h-[50vh] top-0 will-change-transform opacity-50" />
				<div className="max-w-5xl grid grid-cols-5 gap-x-2 min-h-[45vh] w-full ">
					<div className="flex flex-col justify-center">
						<div className="w-full aspect-square rounded-full overflow-hidden relative">
							<Image
								fill
								src={user.profileData.profilePhoto}
								alt={`@${user.hackerTag}'s Profile Photo`}
								className="object-cover"
							/>
						</div>
						<h1 className="font-bold text-2xl mt-2">
							{user.firstName} {user.lastName}
						</h1>
						<div className="flex gap-x-2 items-center mt-1">
							<h2 className="text-muted-foreground text-lg font-mono">@{user.hackerTag}</h2>
							<RoleBadge role={user.role} />
						</div>
						{user.registrationData.GitHub && user.registrationData.GitHub.length > 0 && (
							<Link
								href={"https://github.com/" + user.registrationData.GitHub}
								className="flex items-center gap-x-2 leading-none mt-10 hover:underline"
							>
								<BsGithub className="text-xl" />
								{user.registrationData.GitHub}
							</Link>
						)}
						{user.registrationData.LinkedIn && user.registrationData.LinkedIn.length > 0 && (
							<Link
								href={"https://linkedin.com/in/" + user.registrationData.LinkedIn}
								className="flex items-center gap-x-2 leading-none mt-3 hover:underline"
							>
								<BsLinkedin className="text-xl" />
								{user.registrationData.LinkedIn}
							</Link>
						)}
						{user.registrationData.PersonalWebsite &&
							user.registrationData.PersonalWebsite.length > 0 && (
								<Link
									href={
										user.registrationData.PersonalWebsite.startsWith("http") ||
										user.registrationData.PersonalWebsite.startsWith("https")
											? user.registrationData.PersonalWebsite
											: "https://" + user.registrationData.PersonalWebsite
									}
									className="flex items-center gap-x-2 leading-none mt-3 hover:underline"
								>
									<BsGlobe className="text-xl" />
									{user.registrationData.PersonalWebsite.replace("https://", "").replace(
										"http://",
										""
									)}
								</Link>
							)}
					</div>
					<div className="col-span-4 pl-5 flex flex-col justify-center">
						<h3 className="font-bold">About</h3>
						<p>
							<Balancer>{user.profileData.bio}</Balancer>
						</p>
						{user.profileData.skills && (user.profileData.skills as string[]).length > 0 ? (
							<>
								<h3 className="font-bold mt-4">Skills</h3>
								<p>{(user.profileData.skills as string[]).join(", ")}</p>
							</>
						) : null}
					</div>
				</div>
			</div>
		</>
	);
}

export const runtime = "edge";
