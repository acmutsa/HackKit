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
import c from "config"

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
/**
 * Helper function to find each team member's image in the public img landing folder
 * @param firstname 
 * @param lastname
 * @returns Image Link
 * 
 */
function CreateImgLink(firstname: string, lastname: string):string {
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
    "https://www.github.com/"
  ),
  createPerson(
    "First Name",
    "Last Name",
    roles.director,
    "https://www.linkedin.com/",
    "https://www.google.com/",
    "https://www.github.com/"
  ),
  createPerson(
    "First Name",
    "Last Name",
    roles.media,
    "https://www.linkedin.com/",
    "https://www.google.com/",
    "https://www.github.com/"
  ),
  createPerson(
    "First Name",
    "Last Name",
    roles.experience,
    "https://www.linkedin.com/",
    "https://www.google.com/",
    "https://www.github.com/"
  ),
  createPerson(
    "First Name",
    "Last Name",
    roles.logistics,
    "https://www.linkedin.com/",
    "https://www.google.com/",
    "https://www.github.com/"
  ),
  createPerson(
    "First Name",
    "Last Name",
    roles.tech,
    "https://www.linkedin.com/",
    "https://www.google.com/",
    "https://www.github.com/"
  ),
  createPerson(
    "First Name",
    "Last Name",
    roles.pr,
    "https://www.linkedin.com/",
    "https://www.google.com/",
    "https://www.github.com/"
  ),
];

function CarouselDefault() {
  const [data_rendered, setData_rendered] = useState(false);
  const plugin = React.useRef(
    Autoplay({ delay: 2500, stopOnInteraction: true })
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
          className="hidden md:flex md:w-[75%] xl:w-[85%] 2xl:w-full max-w-7xl 2xl:max-w-[92rem] justify-center items-center ">
          <CarouselContent>
            {team.map((p: Person, index: React.Key) => (
              <CarouselItem
                key={index}
                className="pl-1 md:basis-1/3 lg:basis-1/4 2xl:basis-1/5">
                <TeamMember person={p} />
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* NOTE: Source image of carousel previous and next are modified with color prop  */}
          <CarouselPrevious className="bg-transparent border-none  hover:cursor-pointer" />
          <CarouselNext className="bg-transparent border-none hover:cursor-pointer" />
        </Carousel>
      ) : (
        <div className="hidden md:flex md:justify-center ">
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
        <div className="md:hidden flex flex-col w-full justify-center items-center ">
          <div className="overflow-x-auto overflow-y-hidden grid grid-flow-col w-[85%] grid-rows-2 no-scrollbar ">
            {team.map((p: Person, index: React.Key) => (
              <TeamMember person={p} key={index} />
            ))}
          </div>
          {/* Change directiom */}
          <div className="flex w-full items-center justify-center ">
            <h1 className="text-[#FEF2E6] [@media (min-width)] text-xl sm:text-2xl pr-3 sm:pr-5">
            More Organizers
            </h1>
            <ArrowRight className=" pt-1 arrow_animate self-center w-8 h-8 sm:w-10 sm:h-10" color="#FEF2E6" />
          </div>
        </div>
      ) : (
        <div className="md:hidden text-[#FEF2E6] tetx-3xl">Loading...</div>
      )}
    </>
  );
}

export default function Team() {
  return (
    <section
      className={`${oswald.className} flex flex-col w-full h-full space-y-20 pb-20`}>
      <div className="flex w-full justify-center items-center mx-auto">
        <h1 className="pt-10 text-[#FEF2E6] text-xl text-center sm:text-3xl md:text-4xl lg:text-5xl font-bold font-oswald italic">
          {`Meet The Team That Made ${c.hackathonName} Possible!`}
        </h1>
      </div>
      <div className="flex w-full h-full items-center justify-center">
        <CarouselDefault />
        <MobileTeam />
      </div>
    </section>
  );
}
