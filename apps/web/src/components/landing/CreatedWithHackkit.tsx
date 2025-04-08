import Image from "next/image";
import Link from "next/link";
export default function CreatedWithHackkit() {
	return (
		<section className="flex min-h-[25vh] w-full items-center justify-center border-t-2 border-muted-foreground p-8">
			<div className="flex transform flex-col justify-center gap-y-6 rounded-[45px] border-4 border-black bg-[#222222] p-8">
				<div className="z-10 flex">
					<div className="relative w-32">
						<Image
							src="/img/logo/hackkit.svg"
							alt="HackKit Logo"
							fill
							className="w-full"
						/>
					</div>
					<div className="z-10 py-5">
						<h1 className="text-5xl font-black text-hackathon dark:bg-gradient-to-tl dark:from-hackathon/80 dark:to-white dark:bg-clip-text dark:text-transparent md:text-6xl">
							HackKit
						</h1>
						<Link
							href="https://github.com/acmutsa/HackKit"
							className="mr-0 text-right underline"
						>
							Learn More
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
