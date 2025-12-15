import Image from "next/image";
import Link from "next/link";
import { Button } from "../shadcn/ui/button";

export default function Hero() {
	return (
		<section className="grid w-full grid-cols-1 overflow-hidden">
			<div className="relative flex min-h-screen w-full flex-col items-center justify-center">
				<div className="relative">
					<div className="z-12 flex items-center gap-3">
						<div className="relative h-40 w-40">
							<Image
								src="/img/logo/cq26.png"
								alt="CodeQuantum Logo"
								fill
								className="object-contain"
							/>
						</div>
						<h1 className="font-racing text-7xl dark:bg-gradient-to-tr dark:from-hackathon/80 dark:to-white dark:bg-clip-text dark:text-transparent md:text-8xl">
							odeQuantum
						</h1>
					</div>
					<h2 className="text-center text-2xl font-bold text-muted-foreground">
						If you ain't first, you're last.
					</h2>
					<div className="mt-6 flex justify-center">
						<Link href="/register">
							<Button className="hover:bg-hackathon-100 bg-hackathon text-white">
								Register Now!
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
