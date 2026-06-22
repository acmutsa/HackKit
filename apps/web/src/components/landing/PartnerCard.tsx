import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Manuale } from "next/font/google";
import Pin from "./Pin";

type Partner = {
	name: string;
	logo: string;
	url: string;
	tier: string;
};

const manuale = Manuale({
	weight: ["300", "400", "500", "600", "700", "800"],
	subsets: ["latin"],
	variable: "--font-manuale",
});

function PartnerCard({
	partner,
	is_title,
	index,
}: {
	partner: Partner;
	is_title: boolean;
	index: number;
}) {
	const padding: string[] = [
		"pl-[15vh] pt-[0vh]  pb-[2vh]                              lg:pt-[0vh]                            xl:pt-[5vh] xl:pb-[0vh]                    2xl:pl-[3vh] 2xl:pt-[7vh] 2xl:pb-[0vh]",
		"pl-[1vh]  pr-[30vw] pt-[0vh] pb-[2vh]                     lg:pt-[0vh] lg:pr-[2vw]                xl:pt-[2vh] xl:pr-[2vw]                   2xl:pl-[0vw] 2xl:pr-[0vw] ",
		"pl-[1vh]  pr-[30vw] pt-[0vh] pb-[0vh]    md:pr-[2vw]      lg:pr-[30vw]                           xl:pr-[40vw] xl:pt-[0vh] xl:pb-[2vh]      2xl:pr-[0vw] 2xl:pb-[7vh]",
		"pl-[1vh]  pt-[5vh]  pb-[0vh]             md:pt-[15vh]     lg:pt-[5vh] lg:pb-[0vh] lg:pb-[4vh]    xl:pr-[3vw] xl:pt-[0vh] xl:pb-[6vh]        2xl:pl-[0vw] 2xl:pr-[0vw]",
		"pl-[1vh]  pt-[0vh]  pb-[6vh]             md:pr-[4vw]      lg:pt-[0vh] lg:pb-[5vh] lg:pr-[4vw]    xl:pr-[4vw] xl:pt-[6vh] xl:pb-[0vh]       2xl:pr-[33vw]",
		"pl-[1vh]  pt-[0vh]  pb-[4vh]                                                                     xl:pt-[5vh]                               2xl:pb-[0vh] 2xl:pt-[7vh]",
		"pl-[1vh]  pb-[2vh]",
	];
	return (
		<Link
			href={partner.url || "#Sponsors"}
			target={partner.url ? "_blank" : undefined}
			className={`duration-350 group h-fit ${padding[index] ?? padding[padding.length - 1]} font-semibold opacity-100 transition ease-in-out hover:scale-105 ${partner.url ? "" : "pointer-events-none"}`}
		>
			<div
				className={`relative flex h-[10vh] w-[38vw] flex-col items-center justify-center bg-contain bg-center bg-no-repeat sm:h-[13vh] md:h-[15vh] md:w-[35vw] lg:h-[20vh] lg:w-[32vw] xl:w-[23vw] 2xl:w-[23vw] ${manuale.className} text-sm font-normal drop-shadow-[4px_6px_3px_rgba(0,0,0,0.45)] md:text-base lg:text-lg`}
				style={{
					backgroundImage: "url('/img/sponsors/empty-paper.svg')",
				}}
			>
				<Pin
					size={12}
					className="absolute left-1/2 top-[5%] z-30 -translate-x-1/2"
				/>
				<div className="relative mt-5 flex h-[60%] w-[70%] shrink-0 items-center justify-center 2xl:w-[55%]">
					{partner.logo ? (
						<Image
							src={`/img/partner-logos/${partner.logo}`}
							alt={`${partner.name} logo`}
							fill
							className="object-contain"
						/>
					) : (
						<span className="font-shadows text-2xl text-black md:text-3xl lg:text-4xl">
							Logo
						</span>
					)}
				</div>

				{partner.logo && (
					<p className="mb-5 flex items-center justify-center text-center">
						{partner.name}
					</p>
				)}
			</div>
		</Link>
	);
}

export default PartnerCard;
