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
import { useState,useEffect } from "react";
import Balancer from "react-wrap-balancer";

const oswald = Oswald({
	variable: "--font-oswald",
	subsets: ["latin"],
});

// Creates our person and makes it seamless
function createPerson(
	fname: string,
	lname: string,
	role: string,
	linkedin: string,
	website: string,
	github: string
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

function CreateImgLink(firstname: string, lastname: string) {
	return `/img/landing/team/${firstname}_${lastname}.jpg`;
}

const director = "Director";
const media = "Media/Design";
const experience = "Experience";
const logistics = "Logistics";
const tech = "Tech";
const pr = "PR";

let team: Array<Person> = [
  // add each person here. if no website, leave empty string
  createPerson(
    "Nathan",
    "Zuniga",
    director,
    "https://www.linkedin.com/in/nathanzuniga/",
    "",
    ""
  ),
  createPerson(
    "Mei",
    "Sullum",
    director,
    "https://www.linkedin.com/in/meirasullum/",
    "",
    ""
  ),
  createPerson(
    "Liam",
    "Murray",
    `${tech}\u00A0/\u00A0${logistics}`,
    "https://www.linkedin.com/in/liamrmurray/",
    "",
    "https://github.com/Lermatroid"
  ),
  createPerson(
    "Josh",
    "Silva",
    tech,
    "https://www.linkedin.com/in/joshuasilva414/",
    "https://joshuasilva.netlify.app/",
    "https://github.com/joshuasilva414"
  ),
  createPerson(
    "Christian",
    "Walker",
    tech,
    "https://www.linkedin.com/in/christian-d-walker/",
    "",
    "https://github.com/christianhelp"
  ),
  createPerson(
    "Jacob",
    "Ellerbrock",
    `${logistics}\u00A0/\u00A0${tech}`,
    "https://www.linkedin.com/in/jacobellerbrock/",
    "",
    ""
  ),
  createPerson(
    "Calvin",
    "Jessen",
    `${logistics}\u00A0/\u00A0${pr}\u00A0/Photographer`,
    "https://www.linkedin.com/in/calvin-j-39547a24b/",
    "",
    ""
  ),
  createPerson(
    "Kathy",
    "Nguyen",
    media,
    "https://www.linkedin.com/in/kathy-nguyen-6892812ab/",
    "",
    ""
  ),
  createPerson(
    "Macreen",
    "Marbella",
    media,
    "https://www.linkedin.com/in/macreen-marbella-67b067200/",
    "",
    ""
  ),
  createPerson(
    "Rin",
    "Peralez",
    media,
    "https://www.linkedin.com/in/rin-peralez-046721281/",
    "",
    ""
  ),
  createPerson(
    "Annalisa",
    "Vuong",
    pr,
    "https://www.linkedin.com/in/annalisa-vuong-68b002238/",
    "",
    ""
  ),
  createPerson(
    "Diem",
    "Bui",
    pr,
    "https://www.linkedin.com/in/diembui1910/",
    "",
    ""
  ),
  createPerson(
    "Natasha",
    "Blussick",
    pr,
    "https://www.linkedin.com/in/natasha-blussick/",
    "",
    ""
  ),
  createPerson(
    "Alejandro",
    "Mugica",
    logistics,
    "https://www.linkedin.com/in/alejandromugica/",
    "",
    ""
  ),

  createPerson(
    "Elizabeth",
    "Truong",
    logistics,
    "https://www.linkedin.com/in/elizabeth-truong-/",
    "",
    ""
  ),
  createPerson(
    "Paolo",
    "Lay",
    logistics,
    "https://www.linkedin.com/in/paolo-lay/",
    "",
    ""
  ),
  createPerson(
    "Alessandro",
    "Espinosa",
    experience,
    "https://www.linkedin.com/in/alessandro-espinosa-a10640242/",
    "",
    ""
  ),
  createPerson(
    "Darren",
    "Manaligod",
    experience,
    "https://www.linkedin.com/in/darrenmanaligod/",
    "",
    ""
  ),
  createPerson(
    "Iqra",
    "Abdullah",
    experience,
    "https://www.linkedin.com/in/iqra-abdullah/",
    "",
    ""
  ),
  createPerson(
    "Kailey",
    "Perrino",
    experience,
    "https://www.linkedin.com/in/kailey-perrino-3bb82a213/",
    "",
    ""
  ),
  createPerson(
    "Anusha",
    "Abdulla",
    experience,
    "https://www.linkedin.com/in/anusha-abdulla/",
    "",
    ""
  ),
];

function CarouselDefault() {
	const [data_rendered, setData_rendered] = useState(false);

	useEffect(() => {
		// Basic use effect hook to check if the page has rendered
		setData_rendered(true);
	}, []);

	return (
		//Where Carousel will go
		<>
			{data_rendered ? (
        // We will try a grid view of some sort to see if we can get better results that way
				<Carousel
					opts={{ align: "start" }}
					className="w-[70%]"
				>
					<CarouselContent className="mx-auto">
						{team.map((p: Person, index: React.Key) => (
							<CarouselItem key={index} className=" md:basis-1/3 lg:basis-1/4">
								<TeamMember person={p} />
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselPrevious />
					<CarouselNext />
				</Carousel>
			) : (
				<div className="flex justify-center">
					<h1 className="text-3xl">Loading...</h1>
				</div>
			)}
		</>
	);
}

export default function Team() {
  
  return (
    <section
      className={`${oswald.className} flex flex-col w-full min-h-screen bg-[url('/img/landing/Second_Layer_Background_large.svg')] bg-cover bg-no-repeat space-y-20 md:pb-48`}>
      <div className="flex w-full justify-center items-center mx-auto">
        <h1 className="pt-10 text-[#FEF2E6] text-xl text-center sm:text-3xl md:text-4xl lg:text-5xl font-bold font-oswald italic">
          Meet The Team That Made RowdyHacks IX Possible!
        </h1>
      </div>
      <div className="flex w-full h-full items-center justify-center">
        <CarouselDefault />
      </div>
    </section>
  );
}
