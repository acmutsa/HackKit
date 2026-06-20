"use client";

import Image from "next/image";
import FooterLinks, { footerSections } from "./FooterLinks";

import { Shadows_Into_Light } from "next/font/google";

const shadowsIntoLight = Shadows_Into_Light({
	weight: "400",
	subsets: ["latin"],
});

export default function Footer() {
	return (
		<footer className="relative bottom-0 w-full overflow-hidden bg-transparent px-8 py-8 md:px-10">
			<div className="flex flex-col items-center">
				<div className="mb-8">
					<Image
						className="w-20 sm:w-28"
						src="/img/logo/rh-logo-black.svg"
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

				<p
					className={`${shadowsIntoLight.className} text-s text-center text-black`}
				>
					Made with &lt;/&gt; &amp; ♥ @ RowdyHacks
					<br />© RowdyHacks &amp; Association of Computing Machinery
					at UTSA 2026. All Rights Reserved.
				</p>
			</div>
		</footer>
	);
}
