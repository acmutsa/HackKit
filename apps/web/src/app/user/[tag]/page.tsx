import { db } from "db";
import { users } from "db/schema";
import { eq } from "db/drizzle";
import { notFound } from "next/navigation";
import Image from "next/image";
import RoleBadge from "@/components/dash/shared/RoleBadge";
import { Balancer } from "react-wrap-balancer";
import Link from "next/link";
import { Github, Linkedin, Globe } from "lucide-react";
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
			<div className="max-w-screen relative flex min-h-screen items-center justify-center bg-nav">
				<div className="absolute top-0 h-[50vh] w-[60vw] -translate-y-[22vh] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[color-mix(in_hsl_longer_hue,hsl(var(--hackathon-primary))_80%,#fff)] via-hackathon to-transparent opacity-50 blur-[100px] will-change-transform" />
				<div className="grid min-h-[45vh] w-full max-w-5xl grid-cols-5 gap-x-2">
					<div className="flex flex-col justify-center">
						<div className="relative aspect-square w-full overflow-hidden rounded-full">
							<Image
								fill
								src={user.profileData.profilePhoto}
								alt={`@${user.hackerTag}'s Profile Photo`}
								className="object-cover"
							/>
						</div>
						<h1 className="mt-2 text-2xl font-bold">
							{user.firstName} {user.lastName}
						</h1>
						<div className="mt-1 flex items-center gap-x-2">
							<h2 className="font-mono text-lg text-muted-foreground">
								@{user.hackerTag}
							</h2>
							<RoleBadge role={user.role} />
						</div>
						{user.registrationData.GitHub &&
							user.registrationData.GitHub.length > 0 && (
								<Link
									href={
										"https://github.com/" +
										user.registrationData.GitHub
									}
									className="mt-10 flex items-center gap-x-2 leading-none hover:underline"
								>
									<Github className="text-xl" />
									{user.registrationData.GitHub}
								</Link>
							)}
						{user.registrationData.LinkedIn &&
							user.registrationData.LinkedIn.length > 0 && (
								<Link
									href={
										"https://linkedin.com/in/" +
										user.registrationData.LinkedIn
									}
									className="mt-3 flex items-center gap-x-2 leading-none hover:underline"
								>
									<Linkedin className="text-xl" />
									{user.registrationData.LinkedIn}
								</Link>
							)}
						{user.registrationData.PersonalWebsite &&
							user.registrationData.PersonalWebsite.length >
								0 && (
								<Link
									href={
										user.registrationData.PersonalWebsite.startsWith(
											"http",
										) ||
										user.registrationData.PersonalWebsite.startsWith(
											"https",
										)
											? user.registrationData
													.PersonalWebsite
											: "https://" +
												user.registrationData
													.PersonalWebsite
									}
									className="mt-3 flex items-center gap-x-2 leading-none hover:underline"
								>
									<Globe className="text-xl" />
									{user.registrationData.PersonalWebsite.replace(
										"https://",
										"",
									).replace("http://", "")}
								</Link>
							)}
					</div>
					<div className="col-span-4 flex flex-col justify-center pl-5">
						<h3 className="font-bold">About</h3>
						<p>
							<Balancer>{user.profileData.bio}</Balancer>
						</p>
						{user.profileData.skills &&
						(user.profileData.skills as string[]).length > 0 ? (
							<>
								<h3 className="mt-4 font-bold">Skills</h3>
								<p>
									{(user.profileData.skills as string[]).join(
										", ",
									)}
								</p>
							</>
						) : null}
					</div>
				</div>
			</div>
		</>
	);
}

export const runtime = "edge";
