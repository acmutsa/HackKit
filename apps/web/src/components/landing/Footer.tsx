import Image from "next/image";
import Link from "next/link";
import { Instagram, Facebook, Twitter, Github } from "lucide-react";
import c from "config";
import { camelCaseToWords } from "@/lib/utils/shared/camelCaseToWords";
import FooterLinks from "./FooterLinks";
import ManagedByHackkit from "./ManagedWithHackkit";

export default function Footer() {
	return (
		<section className="sm:p-8 md:px-10 min-h-[25vh] w-full items-center justify-center border-t-2 border-muted-foreground bg-white p-1 py-8">
			<div className="sm:grid-cols-4 md:justify-items-center lg:grid-cols-5 lg:justify-items-start grid grid-cols-2 gap-y-8">
				<div className="sm:row-span-3 lg:row-span-1 lg:justify-self-start col-span-2 row-span-1 flex items-center justify-self-center font-black">
					<Image
						className="sm:w-28 w-20"
						src="/img/logo/rhbttf.svg"
						alt="RowdyHacks Logo"
						width={100}
						height={50}
					/>
					<h1 className="sm:text-4xl bg-gradient-to-b from-orange-600 via-yellow-300 to-orange-600 bg-clip-text pl-0 pr-2 font-bttf text-3xl text-transparent">
						HACK&lt;
						<br></br>&future&gt;
					</h1>
				</div>
				{Object.entries(c.footerLinkItems).map(([title, data], idx) => (
					<FooterLinks
						title={camelCaseToWords(title)}
						data={data}
						key={idx}
					/>
				))}
				<div className="lg:col-span-1 col-span-2 flex flex-col gap-y-3 justify-self-center">
					<Link href="https://vercel.com">
						<Image
							className="select-none"
							src="/img/powered-by-vercel.svg"
							alt="Powered by Vercel"
							width={200}
							height={10}
						/>
					</Link>
					<Link href="https://github.com/acmutsa/HackKit">
						<ManagedByHackkit />
					</Link>
				</div>
				<div className="lg:col-span-1 lg:col-start-5 col-span-2 flex h-[41px] w-[200px] items-center justify-between gap-2 justify-self-center rounded-lg bg-black px-2">
					<Link href="https://twitter.com/rowdyhacks/">
						<Twitter className="invert dark:invert-0" />
					</Link>
					<Link href="https://www.instagram.com/rowdyhacks/">
						<Instagram className="invert dark:invert-0" />
					</Link>
					<Link href="https://www.facebook.com/UTSA.ACM">
						<Facebook className="invert dark:invert-0" />
					</Link>
					<Link href="https://github.com/acmutsa/RowdyHacksX">
						<Github className="invert dark:invert-0" />
					</Link>
					<Link href="https://go.rowdyhacks.org/discord">
						<Image
							className="select-none"
							src="/img/landing/discord_icon.svg"
							alt="Discord logo"
							width={20}
							height={20}
						/>
					</Link>
				</div>
				<p className="sm:col-start-2 md:py-0 lg:col-span-3 lg:col-start-2 lg:row-start-2 lg:w-11/12 col-span-2 self-center justify-self-center text-center font-mono text-xs text-orange-500">
					Made with &lt;/&gt; &amp; ♥ @ RowdyHacks
					<br />© RowdyHacks &amp; Association of Computing Machinery
					at UTSA 2024. All Rights Reserved.
				</p>
			</div>
		</section>
	);
}
