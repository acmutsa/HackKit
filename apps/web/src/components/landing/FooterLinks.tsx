"use client";

import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuItem,
	DropdownMenuContent,
} from "../shadcn/ui/dropdown-menu";
import Link from "next/link";

import { Shadows_Into_Light } from "next/font/google";

const shadowsIntoLight = Shadows_Into_Light({
	weight: "400",
	subsets: ["latin"],
});

const resources = [
	{ name: "Register", link: "/auth" },
	{ name: "FAQ", link: "/faq" },
	{ name: "Code of Conduct", link: "https://mlh.io/code-of-conduct" },
	{ name: "Contact Us", link: "/contact" },
	{ name: "ACM-W", link: "https://acmutsa.org/suborg_acmw/" },
	{ name: "ACM UTSA", link: "https://acmutsa.org/" },
] as const;

const links = [
	{ name: "Open Source", link: "https://github.com/acmutsa/rowdyHacksXI" },
] as const;

const hackathons = [
	{ name: "CodeQuantum", link: "https://cqhacks.org/" },
	{ name: "RowdyDatathon", link: "https://rowdydatathon.org/" },
	{ name: "TAMUhack", link: "https://tamuhack.com/" },
	{ name: "WEHack", link: "https://wehackutd.com/" },
	{ name: "HackUTD", link: "https://hackutd.co/" },
	{ name: "HackTX", link: "https://hacktx.com/" },
	{ name: "HackUNT", link: "https://unthackathon.com/#/" },
	{ name: "HackUTA", link: "https://hackuta.org/" },
	{ name: "Hacklahoma", link: "https://hacklahoma.org/" },
] as const;

export default function FooterLinks({
	title,
	data,
}: {
	title: string;
	data: Readonly<{ name: string; link: string }[]>;
}) {
	return (
		<>
			{/* mobile */}
			<div className="col-span-2 flex w-full justify-center lg:col-span-1 lg:hidden">
				<DropdownMenu>
					<DropdownMenuTrigger className="text-4xl font-bold">
						<span
							className={`${shadowsIntoLight.className} text-xl text-black`}
						>
							{title}
						</span>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="bg-white">
						{data.map(({ name, link }, idx) => (
							<DropdownMenuItem key={idx}>
								<Link
									className="block text-sm font-semibold text-black"
									href={link}
								>
									{name}
								</Link>
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* desktop */}
			<div className="hidden w-max flex-col items-center lg:flex">
				<h2
					className={`${shadowsIntoLight.className} mb-2 text-4xl font-bold text-black`}
				>
					{title}
				</h2>
				{data.map(({ link, name }, idx) => (
					<Link
						href={link}
						className="text-2xl text-black hover:underline"
						key={idx}
					>
						<span className={`${shadowsIntoLight.className}`}>
							{name}
						</span>
					</Link>
				))}
			</div>
		</>
	);
}

export const footerSections = [
	{ title: "Resources", data: resources },
	{ title: "Links", data: links },
	{ title: "Other Hackathons", data: hackathons },
] as const;
