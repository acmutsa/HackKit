import Image from "next/image";
import Link from "next/link";
import { Button } from "../shadcn/ui/button";

export default function Hero() {
	return (
		<section className="grid w-full grid-cols-1 overflow-hidden">
			<div className="relative flex min-h-screen w-full flex-col items-center justify-center">
				<div className="absolute left-[20%] top-[-30vh] h-[110vh] w-[225px] -translate-x-5 -rotate-[50deg] bg-white opacity-20 blur-3xl"></div>
				<div className="relative">
					<div className="absolute h-full w-full rounded-3xl bg-hackathon opacity-10 blur-3xl"></div>
					<div className="z-10 grid h-min grid-cols-2">
						<div className="relative">
							<Image
								src="/img/logo/hackkit-md.png"
								alt="HackKit Logo"
								fill
								className="object-contain"
							/>
						</div>
						<div className="z-10 flex py-5">
							<h1 className="text-7xl font-black text-hackathon dark:bg-gradient-to-tl dark:from-hackathon/80 dark:to-white dark:bg-clip-text dark:text-transparent md:text-8xl">
								Hack
								<br />
								Kit
							</h1>
						</div>
					</div>
					<p className="text-md pl-5 pt-10 text-center font-bold text-muted-foreground">
						Feature-packed Hackathon managment software{" "}
						<u>that just works</u>.
					</p>
				</div>
			</div>
			<div className="absolute top-[80vh] flex w-full flex-wrap items-center justify-center gap-x-2 gap-y-4">
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
				<div className="h-0 basis-full" />
				<div className="max-h-[50px] overflow-hidden"></div>
			</div>
		</section>
	);
}
