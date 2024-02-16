import c from "config";

export default function RsvpPage() {
	return (
		<main className="max-w-5xl min-h-screen mx-auto w-full flex flex-col items-center justify-center">
			<div className="fixed left-1/2 top-[calc(50%+7rem)] overflow-x-hidden h-[40vh] w-[800px] max-w-screen -translate-x-1/2 -translate-y-1/2 scale-150 bg-hackathon opacity-30 blur-[100px] will-change-transform"></div>
			<h2 className="text-4xl font-extrabold">{c.hackathonName}</h2>
			<h1 className="text-6xl md:text-8xl mb-10 font-extrabold text-hackathon dark:text-transparent dark:bg-gradient-to-t dark:from-hackathon/80 dark:to-white dark:bg-clip-text">
				RSVP
			</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 w-full p-2 gap-y-2">hello</div>
		</main>
	);
}
