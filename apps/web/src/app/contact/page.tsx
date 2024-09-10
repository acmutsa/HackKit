import Navbar from "@/components/shared/Navbar";
import { Oswald } from "next/font/google";
import c from "config";
import { Instagram, Facebook, Twitter, Github } from "lucide-react";
import Link from "next/link";

const oswald = Oswald({
	variable: "--font-oswald",
	subsets: ["latin"],
});

export default function Page() {
	return (
		<>
			<Navbar className="border-b-0 bg-[#818F44]" />
			<main
				className={`bg-[#818F44] ${oswald.variable} flex min-h-screen items-center justify-center pt-16`}
			>
				<div className="mx-auto grid w-full max-w-6xl grid-cols-6 gap-4">
					<div className="col-span-4 flex flex-col items-center justify-center gap-y-4">
						<h1 className="font-oswald text-8xl font-black text-[#3E5A31]">
							Contact Us
						</h1>
						<p className="max-w-[500px] text-center font-mono">
							Have a question and want to reach out? Feel free to
							use one of the contact methods listed here!
						</p>
					</div>
					<Link
						href={c.links.discord}
						className="col-span-2 flex aspect-square h-full items-center justify-center rounded-xl bg-[#3E5A31]"
					>
						<span className="text-9xl">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 640 512"
							>
								<path d="M524.5 69.8a1.5 1.5 0 0 0 -.8-.7A485.1 485.1 0 0 0 404.1 32a1.8 1.8 0 0 0 -1.9 .9 337.5 337.5 0 0 0 -14.9 30.6 447.8 447.8 0 0 0 -134.4 0 309.5 309.5 0 0 0 -15.1-30.6 1.9 1.9 0 0 0 -1.9-.9A483.7 483.7 0 0 0 116.1 69.1a1.7 1.7 0 0 0 -.8 .7C39.1 183.7 18.2 294.7 28.4 404.4a2 2 0 0 0 .8 1.4A487.7 487.7 0 0 0 176 479.9a1.9 1.9 0 0 0 2.1-.7A348.2 348.2 0 0 0 208.1 430.4a1.9 1.9 0 0 0 -1-2.6 321.2 321.2 0 0 1 -45.9-21.9 1.9 1.9 0 0 1 -.2-3.1c3.1-2.3 6.2-4.7 9.1-7.1a1.8 1.8 0 0 1 1.9-.3c96.2 43.9 200.4 43.9 295.5 0a1.8 1.8 0 0 1 1.9 .2c2.9 2.4 6 4.9 9.1 7.2a1.9 1.9 0 0 1 -.2 3.1 301.4 301.4 0 0 1 -45.9 21.8 1.9 1.9 0 0 0 -1 2.6 391.1 391.1 0 0 0 30 48.8 1.9 1.9 0 0 0 2.1 .7A486 486 0 0 0 610.7 405.7a1.9 1.9 0 0 0 .8-1.4C623.7 277.6 590.9 167.5 524.5 69.8zM222.5 337.6c-29 0-52.8-26.6-52.8-59.2S193.1 219.1 222.5 219.1c29.7 0 53.3 26.8 52.8 59.2C275.3 311 251.9 337.6 222.5 337.6zm195.4 0c-29 0-52.8-26.6-52.8-59.2S388.4 219.1 417.9 219.1c29.7 0 53.3 26.8 52.8 59.2C470.7 311 447.5 337.6 417.9 337.6z" />
							</svg>
						</span>
					</Link>

					<div className="col-span-2 grid aspect-square h-full grid-cols-2 grid-rows-2 gap-4 rounded-xl bg-transparent">
						<Link
							href={c.links.instagram}
							className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-[#3E5A31] text-[#3E5A31] transition-all duration-150 hover:border-solid"
						>
							<Instagram className="text-6xl" />
						</Link>
						<Link
							href={c.links.twitter}
							className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-[#3E5A31] text-[#3E5A31] transition-all duration-150 hover:border-solid"
						>
							<Twitter className="text-6xl" />
						</Link>
						<Link
							href={c.links.github}
							className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-[#3E5A31] text-[#3E5A31] transition-all duration-150 hover:border-solid"
						>
							<Github className="text-6xl" />
						</Link>
						<Link
							href={c.links.facebook}
							className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-[#3E5A31] text-[#3E5A31] transition-all duration-150 hover:border-solid"
						>
							<Facebook className="text-6xl" />
						</Link>
					</div>
					<div className="col-span-4 h-full w-full rounded-xl bg-[#3E5A31]"></div>
				</div>
			</main>
		</>
	);
}
