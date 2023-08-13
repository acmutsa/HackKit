import c from "@/hackkit.config";
import NewTeamForm from "@/components/dash/main/team/NewTeam";

export default async function Page() {
	return (
		<main className="max-w-5xl min-h-[70%] mx-auto w-full flex flex-col items-center mt-16">
			<div className="fixed left-1/2 top-[calc(50%+7rem)] overflow-x-hidden h-[40vh] w-[800px] max-w-screen -translate-x-1/2 -translate-y-1/2 scale-150 bg-hackathon opacity-30 blur-[100px] will-change-transform"></div>
			<h2 className="text-4xl font-extrabold">{c.hackathonName}</h2>
			<h1 className="text-6xl md:text-8xl mb-10 font-extrabold text-hackathon dark:text-transparent dark:bg-gradient-to-t dark:from-hackathon/80 dark:to-white dark:bg-clip-text">
				Team
			</h1>
			<div className="min-h-[max(60vh,625px)] w-full max-w-[500px] aspect-video dark:bg-white/[0.08] bg-white backdrop-blur transition rounded-xl p-5 flex flex-col items-center">
				<h1 className="font-bold text-2xl mb-5">New Team</h1>
				<NewTeamForm />
			</div>
		</main>
	);
}
