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
    "Mei",
    "Sullum",
    director,
    "https://www.linkedin.com/in/meirasullum/",
    "",
    ""
  ),
  createPerson(
    "Nathan",
    "Zuniga",
    "Co-Director",
    "https://www.linkedin.com/in/nathanzuniga/",
    "",
    ""
  ),
  createPerson(
    "Liam",
    "Murray",
    `${logistics} Lead\u00A0/ Tech`,
    "https://www.linkedin.com/in/liamrmurray/",
    "https://www.liammurray.dev/",
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
    "Tech\u00A0Lead",
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
    `${logistics}\u00A0/\u00A0Photographer`,
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
    "Christian",
    "Salinas",
    "Media Lead",
    "https://www.linkedin.com/in/christian--salinas/",
    "",
    "https://github.com/ChristianSalinas722"
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
    "Media co-lead\u00A0/\u00A0Media",
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
    "https://github.com/dmanaligod96"
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
    "Outreach",
    "https://www.linkedin.com/in/anusha-abdulla/",
    "",
    ""
  ),
];

function CarouselDefault() {
  const [data_rendered, setData_rendered] = useState(false);
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );
  useEffect(() => {
    // Basic use effect hook to check if the page has rendered
    setData_rendered(true);
  }, []);
  
  
  return (
    //Where Carousel will go
    <>
      {data_rendered ? (
        <Carousel
          opts={{ align: "start", loop: true }}
          //Christian Walker: Typescript was complaining here so I suppressed. This use of the carousel is correct according to the docs
          // See docs for example code: https://ui.shadcn.com/docs/components/carousel#plugins
          // @ts-ignore
          plugins={[plugin.current]}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          className="hidden md:flex md:w-[75%] xl:w-[85%] 2xl:w-full max-w-7xl 2xl:max-w-[90rem] justify-center items-center ">
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
          <CarouselPrevious className="bg-transparent border-none  hover:cursor-pointer " />
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
          <div className="flex w-full items-center justify-center ">
            <h1 className="text-[#FEF2E6] [@media (min-width)] text-xl sm:text-2xl pr-3 sm:pr-5">
              Swipe For More Organizers
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
      className={`${oswald.className} flex flex-col w-full h-full bg-[rgb(33,15,1)] lg:bg-[rgb(59,30,0)] 2xl:bg-[rgb(92,48,1)] bg-[url('/img/landing/Team_Background.svg')] bg-cover bg-no-repeat space-y-20 pb-20`}>
      <div className="flex w-full justify-center items-center mx-auto">
        <h1 className="pt-10 text-[#FEF2E6] text-xl text-center sm:text-3xl md:text-4xl lg:text-5xl font-bold font-oswald italic">
          Meet The Team That Made RowdyHacks IX Possible!
        </h1>
      </div>
      <div className="flex w-full h-full items-center justify-center">
        <CarouselDefault />
        <MobileTeam />
      </div>
    </section>
  );
}
