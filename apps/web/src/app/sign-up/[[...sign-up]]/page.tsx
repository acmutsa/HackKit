import { SignUp } from "@clerk/nextjs";
import { redisMGet } from "@/lib/utils/server/redis";
import { parseRedisBoolean } from "@/lib/utils/server/redis";
import c from "config";
import { Button } from "@/components/shadcn/ui/button";
import Link from "next/link";

export default async function Page() {
	const [defaultRegistrationEnabled]: (string | null)[] = await redisMGet(
		"config:registration:registrationEnabled",
	);

	if (parseRedisBoolean(defaultRegistrationEnabled, true) === true) {
		return (
			<main className="flex min-h-screen items-center justify-center">
				<SignUp fallbackRedirectUrl={"/register"} />
			</main>
		);
	}

	return (
		<main className="flex min-h-screen flex-col items-center justify-center px-2">
			<div className="max-w-screen fixed left-1/2 top-[calc(50%+7rem)] h-[40vh] w-[800px] -translate-x-1/2 -translate-y-1/2 scale-150 overflow-x-hidden bg-hackathon opacity-30 blur-[100px] will-change-transform" />
			<h2 className="text-4xl font-extrabold">{c.hackathonName}</h2>
			<h1 className="mb-10 pb-5 text-6xl font-extrabold text-hackathon dark:bg-gradient-to-t dark:from-hackathon/80 dark:to-white dark:bg-clip-text dark:text-transparent md:text-8xl">
				Registration
			</h1>
			<div className="relative z-10 flex aspect-video w-full max-w-[500px] flex-col items-center justify-center gap-y-4 rounded-xl bg-white px-5 backdrop-blur transition dark:bg-white/[0.08]">
				<h2 className="w-full text-center text-2xl font-black">
					Registration Is Currently Closed
				</h2>
				<p className="text-center font-bold">
					If you believe this is a mistake or have any questions, feel
					free to reach out to us at {c.issueEmail}!
				</p>

				<Link href={"/"}>
					<Button>Return Home</Button>
				</Link>
				<p className="absolute bottom-0 pb-2 text-center text-sm">
					Already registered?{" "}
					<Link className="pl-2 underline" href={"/sign-in"}>
						Sign-in.
					</Link>
				</p>
			</div>
		</main>
	);
}

export const runtime = "edge";
