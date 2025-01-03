import c from "config";
import RegisterForm from "@/components/registration/RegisterForm";
import { auth, currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import Link from "next/link";
import { redisMGet } from "@/lib/utils/server/redis";
import { parseRedisBoolean } from "@/lib/utils/server/redis";
import { Button } from "@/components/shadcn/ui/button";
import { getUser } from "db/functions";

export default async function Page() {
	const { userId } = auth();
	if (!userId) return redirect("/sign-up");

	const user = await currentUser();
	if (!user) return redirect("/sign-up");

	const registration = await getUser(userId);
	if (registration) return redirect("/dash");

	const [defaultRegistrationEnabled, defaultSecretRegistrationEnabled]: (
		| string
		| null
	)[] = await redisMGet(
		"config:registration:registrationEnabled",
		"config:registration:secretRegistrationEnabled",
	);

	if (parseRedisBoolean(defaultRegistrationEnabled, true) === true) {
		return (
			<>
				<Navbar />
				<main className="dark:bg-zinc-950">
					<div className="mx-auto min-h-screen max-w-5xl px-5 pb-10 pt-[20vh] font-sans dark:text-white">
						<h1 className="text-6xl font-black md:text-8xl">
							Register
						</h1>
						<p className="mt-5 font-medium">
							<span className="font-bold">Welcome Hacker!</span>{" "}
							Please fill out the form below to complete your
							registration for {c.hackathonName}.
						</p>
						<p className="pb-10 pt-5 text-xs">
							Psttt... Running into a issue? Please let us know on{" "}
							<Link className="underline" href={c.links.discord}>
								Discord
							</Link>
							!
						</p>
						<RegisterForm
							defaultEmail={
								user.emailAddresses[0]?.emailAddress || ""
							}
						/>
					</div>
				</main>
			</>
		);
	}

	return (
		<main className="flex min-h-screen flex-col items-center justify-center px-2">
			<div className="max-w-screen fixed left-1/2 top-[calc(50%+7rem)] h-[40vh] w-[800px] -translate-x-1/2 -translate-y-1/2 scale-150 overflow-x-hidden bg-hackathon opacity-30 blur-[100px] will-change-transform" />
			<h2 className="text-4xl font-extrabold">{c.hackathonName}</h2>
			{/* Why is this not a component? This same code is in here and insideo of sign-up */}
			<h1 className="mb-10 pb-5 text-6xl font-extrabold text-hackathon dark:bg-gradient-to-t dark:from-hackathon/80 dark:to-white dark:bg-clip-text dark:text-transparent md:text-8xl">
				Registration
			</h1>
			<div className="relative z-10 flex aspect-video w-full max-w-[500px] flex-col items-center justify-center gap-y-4 rounded-xl bg-white px-5 py-4 backdrop-blur transition dark:bg-white/[0.08]">
				<h2 className="text-center text-2xl font-black">
					Registration Is Currently Closed
				</h2>
				<p className="text-center font-bold">
					If you believe this is a mistake or have any questions, feel
					free to reach out to us at {c.issueEmail}!
				</p>

				<Link href={"/"}>
					<Button>Return Home</Button>
				</Link>
				<p className="text-center text-sm">
					Already registered?
					<Link className="pl-1 underline" href={"/sign-in"}>
						Sign-in.
					</Link>
				</p>
			</div>
		</main>
	);
}

export const runtime = "edge";
