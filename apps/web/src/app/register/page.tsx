import c from "config";
import RegisterForm from "@/components/registration/RegisterForm";
import { auth, currentUser } from "@clerk/nextjs";
import { db } from "db";
import { users } from "db/schema";
import { eq } from "db/drizzle";
import { redirect } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import Link from "next/link";
import { kv } from "@vercel/kv";
import { parseRedisBoolean } from "@/lib/utils/server/redis";

export default async function Page() {
	const { userId } = auth();

	if (!userId) return redirect("/sign-up");

	const user = await currentUser();

	if (!user) return redirect("/sign-up");

	const registration = await db.query.users.findFirst({
		where: eq(users.clerkID, user.id),
	});

	if (registration) {
		return redirect("/dash");
	}

	const [defaultRegistrationEnabled, defaultSecretRegistrationEnabled]: (string | null)[] =
		await kv.mget(
			"config:registration:registrationEnabled",
			"config:registration:secretRegistrationEnabled"
		);

	if (parseRedisBoolean(defaultRegistrationEnabled, true) === true) {
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
}

export const runtime = "edge";
