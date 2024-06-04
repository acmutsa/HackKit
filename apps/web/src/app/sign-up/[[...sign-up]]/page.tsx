import { SignUp } from "@clerk/nextjs";
import { kv } from "@vercel/kv";
import { parseRedisBoolean } from "@/lib/utils/server/redis";
import c from "config";
import { Button } from "@/components/shadcn/ui/button";
import Link from "next/link";

export default async function Page() {
	const [defaultRegistrationEnabled, defaultSecretRegistrationEnabled]: (string | null)[] =
		await kv.mget(
			"config:registration:registrationEnabled",
			"config:registration:secretRegistrationEnabled"
		);

	if (parseRedisBoolean(defaultRegistrationEnabled, true) === true) {
		return (
			<main className="flex min-h-screen items-center justify-center">
				<SignUp afterSignUpUrl={"/register"} afterSignInUrl={"/dash/"} />
			</main>
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
					Already registered?{" "}
					<Link className="underline pl-2" href={"/sign-in"}>
						Sign-in.
					</Link>
				</p>
			</div>
		</main>
	);
}

export const runtime = "edge";
