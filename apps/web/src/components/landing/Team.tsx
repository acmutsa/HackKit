"use client";
import React from "react";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "../shadcn/ui/carousel";
import { Person } from "./Person";
import TeamMember from "./TeamMember";
import { Oswald } from "next/font/google";
import { useState, useEffect } from "react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight } from "lucide-react";
import c from "config";

const oswald = Oswald({
	variable: "--font-oswald",
	subsets: ["latin"],
});

/**
 * Creates our person and makes it seamless
 * @param fname First Name
 * @param lname Last Name
 * @param role Role
 * @param linkedin LinkedIn
 * @param website Website
 * @param github Github
 * @returns Person
 *  */
function createPerson(
	fname: string,
	lname: string,
	role: string,
	linkedin: string,
	website: string,
	github: string,
): Person {
	return {
		fname: fname,
		lname: lname,
		imgLink: CreateImgLink(fname, lname),
		role: role,
		linkedin: linkedin,
		website: website,
		github: github,
	};
}
/**
 * Helper function to find each team member's image in the public img landing folder
 * @param firstname
 * @param lastname
 * @returns Image Link
 *
 */
function CreateImgLink(firstname: string, lastname: string): string {
	return `/img/landing/team/${firstname}_${lastname}.jpg`;
}

// Insert whatever roles that you want here and add them to the roles object
const roles = {
	director: "Director",
	media: "Media/Design",
	experience: "Experience",
	logistics: "Logistics",
	tech: "Tech",
	pr: "PR",
};

let team: Array<Person> = [
	// add each person here. if no website, leave empty string
	createPerson(
		"First Name",
		"Last Name",
		"Position of Person",
		"https://www.linkedin.com/",
		"https://www.google.com/",
		"https://www.github.com/",
	),
	createPerson(
		"First Name",
		"Last Name",
		roles.director,
		"https://www.linkedin.com/",
		"https://www.google.com/",
		"https://www.github.com/",
	),
	createPerson(
		"First Name",
		"Last Name",
		roles.media,
		"https://www.linkedin.com/",
		"https://www.google.com/",
		"https://www.github.com/",
	),
	createPerson(
		"First Name",
		"Last Name",
		roles.experience,
		"https://www.linkedin.com/",
		"https://www.google.com/",
		"https://www.github.com/",
	),
	createPerson(
		"First Name",
		"Last Name",
		roles.logistics,
		"https://www.linkedin.com/",
		"https://www.google.com/",
		"https://www.github.com/",
	),
	createPerson(
		"First Name",
		"Last Name",
		roles.tech,
		"https://www.linkedin.com/",
		"https://www.google.com/",
		"https://www.github.com/",
	),
	createPerson(
		"First Name",
		"Last Name",
		roles.pr,
		"https://www.linkedin.com/",
		"https://www.google.com/",
		"https://www.github.com/",
	),
];

function CarouselDefault() {
	const [data_rendered, setData_rendered] = useState(false);
	const plugin = React.useRef(
		Autoplay({ delay: 2500, stopOnInteraction: true }),
	);
	useEffect(() => {
		// Basic use effect hook to check if the page has rendered
		setData_rendered(true);
	}, []);

	return (
		<>
			{data_rendered ? (
				<Carousel
					opts={{ align: "end", loop: true }}
					// Typescript was complaining here so I suppressed. This use of the carousel is correct according to the docs
					// See docs for example code: https://ui.shadcn.com/docs/components/carousel#plugins
					// @ts-ignore
					plugins={[plugin.current]}
					onMouseEnter={plugin.current.stop}
					onMouseLeave={plugin.current.reset}
					className="hidden max-w-7xl items-center justify-center md:flex md:w-[75%] xl:w-[85%] 2xl:w-full 2xl:max-w-[92rem]"
				>
					<CarouselContent>
						{team.map((p: Person, index: React.Key) => (
							<CarouselItem
								key={index}
								className="pl-1 md:basis-1/3 lg:basis-1/4 2xl:basis-1/5"
							>
								<TeamMember person={p} />
							</CarouselItem>
						))}
					</CarouselContent>
					{/* NOTE: Source image of carousel previous and next are modified with color prop  */}
					<CarouselPrevious className="border-none bg-transparent hover:cursor-pointer" />
					<CarouselNext className="border-none bg-transparent hover:cursor-pointer" />
				</Carousel>
			) : (
				<div className="hidden md:flex md:justify-center">
					<h1 className="text-3xl text-[#FEF2E6]">Loading...</h1>
				</div>
			)}
		</>
	);
}

function MobileTeam() {
	const [data_rendered, setData_rendered] = useState(false);

	useEffect(() => {
		// Basic use effect hook to check if the page has rendered
		setData_rendered(true);
	}, []);

	return (
		<>
			{data_rendered ? (
				<div className="flex w-full flex-col items-center justify-center md:hidden">
					<div className="no-scrollbar grid w-[85%] grid-flow-col grid-rows-2 overflow-x-auto overflow-y-hidden">
						{team.map((p: Person, index: React.Key) => (
							<TeamMember person={p} key={index} />
						))}
					</div>
					{/* Change directiom */}
					<div className="flex w-full items-center justify-center">
						<h1 className="[@media (min-width)] pr-3 text-xl text-[#FEF2E6] sm:pr-5 sm:text-2xl">
							More Organizers
						</h1>
						<ArrowRight
							className="arrow_animate h-8 w-8 self-center pt-1 sm:h-10 sm:w-10"
							color="#FEF2E6"
						/>
					</div>
				</div>
			) : (
				<div className="tetx-3xl text-[#FEF2E6] md:hidden">
					Loading...
				</div>
			)}
		</>
	);
}

export default function Team() {
	return (
		<section
			className={`${oswald.className} flex h-full w-full flex-col space-y-20 border-y-2 border-muted-foreground pb-20`}
		>
			<div className="mx-auto flex w-full flex-col items-center justify-center">
				<h2 className="px-4 text-center text-3xl font-bold md:px-0">
					Demo Responsive Team Section
				</h2>
				<h1 className="pt-10 text-center font-oswald text-xl font-bold italic text-[#FEF2E6] sm:text-3xl md:text-4xl lg:text-5xl">
					{`Meet The Team That Made ${c.hackathonName} Possible!`}
				</h1>
			</div>
			<div className="flex h-full w-full items-center justify-center">
				<CarouselDefault />
				<MobileTeam />
			</div>
		</section>
	);
}
