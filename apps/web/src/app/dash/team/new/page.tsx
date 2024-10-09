import c from "config";
import NewTeamForm from "@/components/dash/main/team/NewTeam";

export default async function Page() {
	return (
		<main className="mx-auto mt-16 flex min-h-[70%] w-full max-w-5xl flex-col items-center">
			<div className="max-w-screen fixed left-1/2 top-[calc(50%+7rem)] h-[40vh] w-[800px] -translate-x-1/2 -translate-y-1/2 scale-150 overflow-x-hidden bg-hackathon opacity-30 blur-[100px] will-change-transform"></div>
			<h2 className="text-4xl font-extrabold">{c.hackathonName}</h2>
			<h1 className="md:text-8xl mb-10 text-6xl font-extrabold text-hackathon dark:bg-gradient-to-t dark:from-hackathon/80 dark:to-white dark:bg-clip-text dark:text-transparent">
				Team
			</h1>
			<div className="flex aspect-video min-h-[max(60vh,625px)] w-full max-w-[500px] flex-col items-center rounded-xl bg-white p-5 backdrop-blur transition dark:bg-white/[0.08]">
				<h1 className="mb-5 text-2xl font-bold">New Team</h1>
				<NewTeamForm />
			</div>
		</main>
	);
}
