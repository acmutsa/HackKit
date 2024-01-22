import c from "config";
import RegisterForm from "@/components/registration/RegisterForm";
import { currentUser } from "@clerk/nextjs";
import { db } from "db";
import { users } from "db/schema";
import { eq } from "db/drizzle";
import { redirect } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import Link from "next/link";

export default async function Page() {
	const user = await currentUser();

	if (!user) return redirect("/sign-in");

	const registration = await db.query.users.findFirst({
		where: eq(users.clerkID, user.id),
	});

	if (registration) {
		return redirect("/dash");
	}

	return (
		<>
			<Navbar />
			<main className="dark:bg-zinc-950">
				<div className="mx-auto min-h-screen max-w-5xl pb-10 pt-[20vh] font-sans dark:text-white px-5">
					<h1 className="md:text-8xl text-6xl font-black">Register</h1>
					<p className="mt-5 font-medium">
						<span className="font-bold">Welcome Hacker!</span> Please fill out the form below to
						complete your registration for {c.hackathonName}.
					</p>
					<p className="pt-5 pb-10 text-xs">
						Psttt... Running into a issue? Please let us know on{" "}
						<Link className="underline" href={c.links.discord}>
							Discord
						</Link>
						!
					</p>
					<RegisterForm defaultEmail={user.emailAddresses[0]?.emailAddress || ""} />
				</div>
			</main>
		</>
	);
}

export const runtime = "edge";
