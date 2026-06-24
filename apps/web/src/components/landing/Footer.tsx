"use client";

import Image from "next/image";
import FooterLinks, { footerSections } from "./FooterLinks";

import { Shadows_Into_Light } from "next/font/google";
import Link from "next/link";
import { Facebook, Github, Instagram, Twitter } from "lucide-react";
import CreatedWithHackkit from "./CreatedWithHackkit";

const shadowsIntoLight = Shadows_Into_Light({
	weight: "400",
	subsets: ["latin"],
});

export default function Footer() {
	return (
		<footer className="relative bottom-0 w-full overflow-hidden bg-transparent">
			<div className="flex flex-col items-center gap-y-8 py-8">
				<div className="mb-8">
					<Image
						className="w-20 sm:w-28"
						src="/img/assets/footer/rh-city-logo-black.svg"
						alt="RowdyHacks Logo"
						width={100}
						height={50}
					/>
				</div>

				{/* links, resources, other hackatons */}
				<div className="grid grid-cols-1 justify-items-center gap-4 lg:grid-cols-3 lg:gap-8">
					{footerSections.map((section) => (
						<FooterLinks
							key={section.title}
							title={section.title}
							data={section.data}
						/>
					))}
				</div>

				{/* icons */}

				<div className="flex h-[50px] w-[200px] items-center justify-between gap-4">
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
							className="select-none invert"
							src="/img/assets/footer/discord_icon.svg"
							alt="Discord logo"
							width={20}
							height={20}
						/>
					</Link>
				</div>

				<CreatedWithHackkit />

				<p
					className={`${shadowsIntoLight.className} text-center text-xl text-black hover:underline md:text-2xl md:font-semibold md:text-black`}
				>
					Made with &lt;/&gt; &amp; ♥ @ RowdyHacks
					<br />© RowdyHacks &amp; Association of Computing Machinery
					at UTSA 2026. All Rights Reserved.
				</p>
			</div>
		</footer>
	);
}
