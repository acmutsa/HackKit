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
import { Button } from "@/components/shadcn/ui/button";

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

	return (
		<main className="flex flex-col min-h-screen items-center justify-center px-2">
			<div className="fixed left-1/2 top-[calc(50%+7rem)] overflow-x-hidden h-[40vh] w-[800px] max-w-screen -translate-x-1/2 -translate-y-1/2 scale-150 bg-hackathon opacity-30 blur-[100px] will-change-transform" />
			<h2 className="text-4xl font-extrabold">{c.hackathonName}</h2>
			<h1 className="text-6xl md:text-8xl pb-5 mb-10 font-extrabold text-hackathon dark:text-transparent dark:bg-gradient-to-t dark:from-hackathon/80 dark:to-white dark:bg-clip-text">
				Registration
			</h1>
			<div className="w-full max-w-[500px] flex gap-y-4 flex-col justify-center items-center px-5 dark:bg-white/[0.08] bg-white backdrop-blur transition rounded-xl aspect-video relative z-10 ">
				<h2 className="font-black text-2xl">Registration Is Currently Closed</h2>
				<p className="text-center font-bold">
					If you believe this is a mistake or have any questions, feel free to reach out to us at{" "}
					{c.issueEmail}!
				</p>

				<Link href={"/"}>
					<Button>Return Home</Button>
				</Link>
				<p className="text-sm absolute bottom-0 text-center pb-2">
					Already registered?
					<Link className="underline" href={"/sign-in"}>
						Sign-in.
					</Link>
				</p>
			</div>
		</main>
	);
}

export const runtime = "edge";
