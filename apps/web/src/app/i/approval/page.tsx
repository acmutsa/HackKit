import c from "config";
import Link from "next/link";
import { Button } from "@/components/shadcn/ui/button";

export default function Page() {
	return (
		<main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center">
			<div className="max-w-screen fixed left-1/2 top-[calc(50%+7rem)] h-[40vh] w-[800px] -translate-x-1/2 -translate-y-1/2 scale-150 overflow-x-hidden bg-hackathon opacity-30 blur-[100px] will-change-transform"></div>
			<h1 className="mb-10 text-6xl font-extrabold text-hackathon dark:bg-gradient-to-t dark:from-hackathon/80 dark:to-white dark:bg-clip-text dark:text-transparent md:text-8xl">
				{c.hackathonName}
			</h1>
			<div className="relative flex aspect-video w-full max-w-[500px] flex-col items-center justify-center rounded-xl bg-white p-5 backdrop-blur transition dark:bg-white/[0.08]">
				<h1 className="flex items-center gap-x-2 text-2xl font-bold text-green-500">
					{/* <CheckCircleIcon /> */}
					Thanks for registering!
				</h1>
				<p className="pb-10 pt-5 text-center">
					Your account is awaiting approval.
					<br />
					You will be notified when it is approved!
				</p>
				<Link href={"/"}>
					<Button>Go Home</Button>
				</Link>
			</div>
		</main>
	);
}

export const runtime = "edge";
