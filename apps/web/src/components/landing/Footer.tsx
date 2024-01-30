"use client";

import { type FunctionComponent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Instagram, Facebook, Twitter, Github } from "lucide-react";

interface Props {
	className?: string;
}

export default function Footer() {
	const [showResources, setShowResources] = useState(false);
	const [showLinks, setShowLinks] = useState(false);
	const [showHackathons, setShowHackathons] = useState(false);

	return (
		<div className="relative z-[100]">
			{/* border-t-gray-500 border-t-[1px] */}
			{/* Proposed simply for keeping with the look of thw website */}
			<div className="bg-amber-950 lg:block hidden">
				<div className="grid grid-cols-5 bg-transparent md:p-10 max-w-[1200px] mx-auto">
					<div className="col-span-2 flex items-center justify-start ">
						{/* <div className="w-full flex items-start flex-col justify-start h-full">
							<div className="flex flex-col items-center">
								<h1 className="font-sans font-black text-xl text-white">
									RowdyHacks <span className="text-[#7D9037]">2023</span>
								</h1>
								<h2 className="font-bebas text-9xl leading-none text-white">heist</h2>
							</div>
						</div> */}
						<div className="flex items-center justify-center h-full">
							<div>
								<Image
									src={"/img/logo/logo.png"}
									height={120}
									width={120}
									alt="RowdyHacks 2024 Logo"
								></Image>
							</div>
							<div className="relative">
								<div className="font-oswald absolute translate-y-[0.10rem] -translate-x-[0.20rem]">
									<h2 className="font-bold m-0 text-md text-[#A88567] pl-1 italic">
										A LAND BEFORE
									</h2>
									<h1 className="font-bold text-5xl m-0 leading-[0.95] select-none text-[#A88567]">
										RowdyHacks
									</h1>
								</div>
								<div className="font-oswald relative">
									<h2 className="font-bold m-0 text-md text-[#FEF2E6] pl-1 opacity-0">
										A LAND BEFORE
									</h2>
									<h1 className="font-bold text-5xl m-0 leading-[0.95] text-[#FEF2E6]">
										RowdyHacks
									</h1>
								</div>
							</div>
						</div>
					</div>
					<div className="flex flex-col font-sans text-gray-400">
						<h2 className="text-white !text-md">Resources</h2>
						<Link href={"/auth"} className="text-sm hover:underline">
							Register
						</Link>
						<Link href={"/faq"} className="text-sm hover:underline">
							FAQ
						</Link>
						<Link href={"https://mlh.io/code-of-conduct"} className="text-sm hover:underline">
							Code of Conduct
						</Link>
						<Link href={"/contact"} className="text-sm hover:underline">
							Contact Us
						</Link>
						<Link href={"https://acmutsa.org/suborg_acmw/"} className="text-sm hover:underline">
							ACM-W
						</Link>
						<Link href={"https://acmutsa.org/"} className="text-sm hover:underline">
							ACM UTSA
						</Link>
					</div>
					<div className="flex flex-col font-sans text-gray-400">
						<h2 className="text-white !text-md">Links</h2>
						<Link
							href={"https://github.com/acmutsa/CodeQuantum2023"}
							className="text-sm hover:underline"
						>
							Open Source
						</Link>
						<Link
							href={"https://github.com/UTSA-ACM/RowdyHacks23/blob/develop/contributions.md"}
							className="text-sm hover:underline text-amber-300"
						>
							Contributions
						</Link>
					</div>
					<div className="flex flex-col font-sans text-gray-400">
						<h2 className="text-white !text-md">Other Hackathons</h2>
						<Link href={"https://cqhacks.org/"} className="text-sm hover:underline">
							CodeQuantum
						</Link>
						<Link href={"https://rowdydatathon.org/"} className="text-sm hover:underline">
							RowdyDatathon
						</Link>
						<Link href={"https://tamuhack.com/"} className="text-sm hover:underline">
							TAMUhack
						</Link>
						<Link href={"https://wehackutd.com/"} className="text-sm hover:underline">
							WEHack
						</Link>
						<Link href={"https://hackutd.co/"} className="text-sm hover:underline">
							HackUTD
						</Link>
						<Link href={"https://hacktx.com/"} className="text-sm hover:underline">
							HackTX
						</Link>
						<Link href={"https://unthackathon.com/#/"} className="text-sm hover:underline">
							HackUNT
						</Link>
						<Link href={"https://hackuta.org/"} className="text-sm hover:underline">
							HackUTA
						</Link>
						<Link href={"https://hacklahoma.org/"} className="text-sm hover:underline">
							Hacklahoma
						</Link>
					</div>
					<div className="col-span-5 h-10"></div>
					<div className="flex col-span-1 justify-center h-[44px] w-[212px]">
						<a href="https://vercel.com/?utm_source=ACM%20UTSA&utm_campaign=oss">
							<img
								className="invert h-[44px] w-[212px]"
								src="https://static.rowdyhacks.org/img/powered-by-vercel.svg"
							/>
						</a>
					</div>
					<div className="col-span-3 text-white text-xs font-sans flex items-center justify-center">
						<p className="text-center">
							Made with &lt;/&gt; & ♥ @ RowdyHacks
							<br />© RowdyHacks & Association of Computing Machinery at UTSA{" "}
							{new Date().getFullYear()}. All Rights Reserved.
						</p>
					</div>
					<div className="flex justify-end items-center h-[44px] max-w-[212px] w-full">
						<div className="flex text-gray-900 bg-white h-[44px] w-[212px] items-center justify-evenly p-[5px] rounded-lg text-xl">
							<a href="https://twitter.com/rowdyhacks/" className="mr-2">
								<Twitter fill="black" strokeWidth={0} />
							</a>
							<a href="https://www.instagram.com/rowdyhacks/" className="mx-2">
								<Instagram />
							</a>
							<a href="https://www.facebook.com/UTSA.ACM" className="mx-2">
								<Facebook fill="black" strokeWidth={0} />
							</a>
							<a href="https://github.com/acmutsa" className="mx-2">
								<Github fill="black" strokeWidth={0} />
							</a>
							<a href="https://go.rowdyhacks.org/discord" className="ml-2">
								<svg
									height={24}
									width={24}
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 640 512"
								>
									<path d="M524.5 69.8a1.5 1.5 0 0 0 -.8-.7A485.1 485.1 0 0 0 404.1 32a1.8 1.8 0 0 0 -1.9 .9 337.5 337.5 0 0 0 -14.9 30.6 447.8 447.8 0 0 0 -134.4 0 309.5 309.5 0 0 0 -15.1-30.6 1.9 1.9 0 0 0 -1.9-.9A483.7 483.7 0 0 0 116.1 69.1a1.7 1.7 0 0 0 -.8 .7C39.1 183.7 18.2 294.7 28.4 404.4a2 2 0 0 0 .8 1.4A487.7 487.7 0 0 0 176 479.9a1.9 1.9 0 0 0 2.1-.7A348.2 348.2 0 0 0 208.1 430.4a1.9 1.9 0 0 0 -1-2.6 321.2 321.2 0 0 1 -45.9-21.9 1.9 1.9 0 0 1 -.2-3.1c3.1-2.3 6.2-4.7 9.1-7.1a1.8 1.8 0 0 1 1.9-.3c96.2 43.9 200.4 43.9 295.5 0a1.8 1.8 0 0 1 1.9 .2c2.9 2.4 6 4.9 9.1 7.2a1.9 1.9 0 0 1 -.2 3.1 301.4 301.4 0 0 1 -45.9 21.8 1.9 1.9 0 0 0 -1 2.6 391.1 391.1 0 0 0 30 48.8 1.9 1.9 0 0 0 2.1 .7A486 486 0 0 0 610.7 405.7a1.9 1.9 0 0 0 .8-1.4C623.7 277.6 590.9 167.5 524.5 69.8zM222.5 337.6c-29 0-52.8-26.6-52.8-59.2S193.1 219.1 222.5 219.1c29.7 0 53.3 26.8 52.8 59.2C275.3 311 251.9 337.6 222.5 337.6zm195.4 0c-29 0-52.8-26.6-52.8-59.2S388.4 219.1 417.9 219.1c29.7 0 53.3 26.8 52.8 59.2C470.7 311 447.5 337.6 417.9 337.6z" />
								</svg>
							</a>
						</div>
					</div>
				</div>
			</div>
			{/* bg-black border-t-gray-500 border-t-[1px] */}
			<div className="lg:hidden grid grid-cols-2 bg-amber-950 min-h-[350px] py-5">
				<div className="col-span-2 md:col-span-1">
					<div className="flex items-center justify-center h-full">
						<div>
							<Image
								src={"/img/logo/logo.png"}
								height={120}
								width={120}
								alt="RowdyHacks 2024 Logo"
							></Image>
						</div>
						<div className="relative">
							<div className="font-oswald absolute translate-y-[0.10rem] -translate-x-[0.20rem]">
								<h2 className="font-bold m-0 text-md text-[#A88567] pl-1 italic">A LAND BEFORE</h2>
								<h1 className="font-bold text-5xl m-0 leading-[0.95] select-none text-[#A88567]">
									RowdyHacks
								</h1>
							</div>
							<div className="font-oswald relative">
								<h2 className="font-bold m-0 text-md text-[#FEF2E6] pl-1 opacity-0">
									A LAND BEFORE
								</h2>
								<h1 className="font-bold text-5xl m-0 leading-[0.95] text-[#FEF2E6]">RowdyHacks</h1>
							</div>
						</div>
					</div>
				</div>
				<div className="px-10 flex flex-col justify-center col-span-2 md:col-span-1 md:py-0 py-10">
					<div className="flex flex-col font-sans text-gray-400 border-gray-600 hover:cursor-pointer border-b-[1px] py-[5px]">
						<h2 onClick={() => setShowResources(!showResources)} className="text-white !text-md">
							Resources
						</h2>
						{showResources ? (
							<div className="flex flex-col">
								<Link href={"/auth"} className="text-sm hover:underline">
									Register
								</Link>
								<Link href={"/faq"} className="text-sm hover:underline">
									FAQ
								</Link>
								<Link href={"https://mlh.io/code-of-conduct"} className="text-sm hover:underline">
									Code of Conduct
								</Link>
								<Link href={"/contact"} className="text-sm hover:underline">
									Contact Us
								</Link>
								<Link href={"https://acmutsa.org/suborg_acmw/"} className="text-sm hover:underline">
									ACM-W
								</Link>
								<Link href={"https://acmutsa.org/"} className="text-sm hover:underline">
									ACM UTSA
								</Link>
							</div>
						) : null}
					</div>
					<div className="flex flex-col font-sans text-gray-400 border-gray-600 hover:cursor-pointer border-b-[1px] py-[5px]">
						<h2 className="text-white !text-md" onClick={() => setShowLinks(!showLinks)}>
							Links
						</h2>
						{showLinks ? (
							<div className="flex flex-col">
								<Link
									href={"https://github.com/acmutsa/CodeQuantum2023"}
									className="text-sm hover:underline"
								>
									Open Source
								</Link>
							</div>
						) : null}
					</div>
					<div className="flex flex-col font-sans text-gray-400 border-gray-600 hover:cursor-pointer py-[5px]">
						<h2 onClick={() => setShowHackathons(!showHackathons)} className="text-white !text-md">
							Other Hackathons
						</h2>
						{showHackathons ? (
							<div className="flex flex-col">
								<Link href={"https://cqhacks.org/"} className="text-sm hover:underline">
									CodeQuantum
								</Link>
								<Link href={"https://rowdydatathon.org/"} className="text-sm hover:underline">
									RowdyDatathon
								</Link>
								<Link href={"https://tamuhack.com/"} className="text-sm hover:underline">
									TAMUhack
								</Link>
								<Link href={"https://wehackutd.com/"} className="text-sm hover:underline">
									WEHack
								</Link>
								<Link href={"https://hackutd.co/"} className="text-sm hover:underline">
									HackUTD
								</Link>
								<Link href={"https://hacktx.com/"} className="text-sm hover:underline">
									HackTX
								</Link>
								<Link href={"https://unthackathon.com/#/"} className="text-sm hover:underline">
									HackUNT
								</Link>
								<Link href={"https://hackuta.org/"} className="text-sm hover:underline">
									HackUTA
								</Link>
								<Link href={"https://hacklahoma.org/"} className="text-sm hover:underline">
									Hacklahoma
								</Link>
							</div>
						) : null}
					</div>
				</div>
				<div className="sm:col-span-1 col-span-2">
					<div className="flex justify-center items-center min-h-[44px] h-full w-full">
						<a href="https://vercel.com/?utm_source=ACM%20UTSA&utm_campaign=oss">
							<img
								className="invert h-[44px] w-[212px]"
								src="https://static.rowdyhacks.org/img/powered-by-vercel.svg"
							/>
						</a>
					</div>
				</div>
				<div className="sm:col-span-1 sm:mt-0 mt-10 col-span-2">
					<div className="flex justify-center items-center min-h-[44px] h-full min-w-[212px] w-full">
						<div className="flex text-gray-900 bg-white h-[44px] w-[212px] items-center justify-evenly p-[5px] rounded-lg text-xl">
							<a href="https://twitter.com/rowdyhacks/" className="mr-2">
								<Twitter fill="black" strokeWidth={0} />
							</a>
							<a href="https://www.instagram.com/rowdyhacks/" className="mx-2">
								<Instagram />
							</a>
							<a href="https://www.facebook.com/UTSA.ACM" className="mx-2">
								<Facebook fill="black" strokeWidth={0} />
							</a>
							<a href="https://github.com/acmutsa" className="mx-2">
								<Github fill="black" strokeWidth={0} />
							</a>
							<a href="https://go.rowdyhacks.org/discord" className="ml-2">
								<svg
									height={24}
									width={24}
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 640 512"
								>
									<path d="M524.5 69.8a1.5 1.5 0 0 0 -.8-.7A485.1 485.1 0 0 0 404.1 32a1.8 1.8 0 0 0 -1.9 .9 337.5 337.5 0 0 0 -14.9 30.6 447.8 447.8 0 0 0 -134.4 0 309.5 309.5 0 0 0 -15.1-30.6 1.9 1.9 0 0 0 -1.9-.9A483.7 483.7 0 0 0 116.1 69.1a1.7 1.7 0 0 0 -.8 .7C39.1 183.7 18.2 294.7 28.4 404.4a2 2 0 0 0 .8 1.4A487.7 487.7 0 0 0 176 479.9a1.9 1.9 0 0 0 2.1-.7A348.2 348.2 0 0 0 208.1 430.4a1.9 1.9 0 0 0 -1-2.6 321.2 321.2 0 0 1 -45.9-21.9 1.9 1.9 0 0 1 -.2-3.1c3.1-2.3 6.2-4.7 9.1-7.1a1.8 1.8 0 0 1 1.9-.3c96.2 43.9 200.4 43.9 295.5 0a1.8 1.8 0 0 1 1.9 .2c2.9 2.4 6 4.9 9.1 7.2a1.9 1.9 0 0 1 -.2 3.1 301.4 301.4 0 0 1 -45.9 21.8 1.9 1.9 0 0 0 -1 2.6 391.1 391.1 0 0 0 30 48.8 1.9 1.9 0 0 0 2.1 .7A486 486 0 0 0 610.7 405.7a1.9 1.9 0 0 0 .8-1.4C623.7 277.6 590.9 167.5 524.5 69.8zM222.5 337.6c-29 0-52.8-26.6-52.8-59.2S193.1 219.1 222.5 219.1c29.7 0 53.3 26.8 52.8 59.2C275.3 311 251.9 337.6 222.5 337.6zm195.4 0c-29 0-52.8-26.6-52.8-59.2S388.4 219.1 417.9 219.1c29.7 0 53.3 26.8 52.8 59.2C470.7 311 447.5 337.6 417.9 337.6z" />
								</svg>
							</a>
						</div>
					</div>
				</div>
				<div className="text-white text-xs font-sans flex items-center justify-center col-span-2">
					<p className="text-center md:py-0 pt-10">
						Made with &lt;/&gt; & ♥ @ RowdyHacks
						<br />© RowdyHacks & Association of Computing Machinery at UTSA{" "}
						{new Date().getFullYear()}. All Rights Reserved.
					</p>
				</div>
			</div>
		</div>
	);
}
