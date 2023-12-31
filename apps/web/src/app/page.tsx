import Image from "next/image";
import c from "@/hackkit.config";
import { Button } from "@/components/shadcn/ui/button";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";

export default function Home() {
	return (
		<>
			<Navbar />
			<main className="grid grid-cols-1 w-full">
				<div className="min-h-screen w-full flex flex-col items-center justify-center relative">
					<div className="absolute top-[-30vh] left-[20%] -translate-x-5 h-[110vh] w-[225px] bg-white blur-3xl opacity-20 -rotate-[50deg]"></div>
					<div className="relative">
						<div className="absolute bg-hackathon blur-3xl opacity-10 w-full h-full rounded-3xl"></div>
						<div className="grid grid-cols-2 h-min z-10">
							<div className="relative">
								<Image
									src="/img/logo/hackkit-md.png"
									alt="HackKit Logo"
									fill
									className="object-contain"
								/>
							</div>
							<div className="flex py-5 z-10">
								<h1 className="font-black text-8xl md:text-8xl text-hackathon dark:text-transparent dark:bg-gradient-to-tl dark:from-hackathon/80 dark:to-white dark:bg-clip-text">
									Hack
									<br />
									Kit
								</h1>
							</div>
						</div>
						<p className="text-md text-center text-muted-foreground font-bold pl-5 pt-10">
							Feature-packed Hackathon managment software <u>that just works</u>.
						</p>
					</div>
				</div>
				<div className="absolute top-[70vh] items-center justify-center flex w-screen gap-2">
					<Link href={"https://github.com/acmutsa/hackkit"}>
						<Button variant={"outline"} size={"lg"}>
							GitHub
						</Button>
					</Link>
					<Link href={"https://github.com/acmutsa/hackkit"}>
						<Button variant={"outline"} size={"lg"}>
							Docs
						</Button>
					</Link>
					<Link href={"https://github.com/acmutsa/hackkit"}>
						<Button variant={"outline"} size={"lg"}>
							Channel Log
						</Button>
					</Link>
				</div>
			</main>
		</>
	);
}
