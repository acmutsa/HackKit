"use client"

import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../shadcn/ui/carousel";

import TeamMember from "./TeamMember";
import { Oswald } from "next/font/google";
import { useState,useEffect } from "react";


const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});


export type Person = {
  fname: string; //picture file name must match name with .png
  lname: string;
  imgLink: string;
  role: string;
  linkedin: string;
  website: string;
  github: string;
};
// Creates our person and makes it seamless
export function createPerson(
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
    imgLink: createImgLink(fname,lname),
    role: role,
    linkedin: linkedin,
    website: website,
    github: github,
  };
  
}

type HashMap = {
  [key: string]: Object;
};

function createImgLink(firstname: string, lastname: string) {
  return `/img/landing/team/${firstname}_${lastname}.jpg`;
}
const director = 'Director'
const media = 'Media/Design'
const experience = "Experience";
const logistics = "Logistics";
const tech = 'Tech';
const pr = 'PR'
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
    `${tech}/${logistics}`,
    "https://www.linkedin.com/in/liamrmurray/",
    "",
    "https://github.com/Lermatroid"
  ),
  createPerson(
    "Joshua",
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
    `${logistics}/${tech}`,
    "https://www.linkedin.com/in/jacobellerbrock/",
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
    "https://www.linkedin.com/in/alessandro-espinosa-a10640242/",
    "",
    ""
  ),
  createPerson(
    "Calvin",
    "Jessen",
    `${logistics}/${pr}/Photographer`,
    "https://www.linkedin.com/in/calvin-j-39547a24b/",
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

export function CarouselDefault() {
    const [data_rendered, setData_rendered] = useState(false);

    useEffect(() => {
      // Basic use effect hook to check if the page has rendered
      setData_rendered(true);
    }, []);

  return (
    //Where Carousel will go
    <>
    {
        data_rendered ? 
        <Carousel opts={{ align: "start" }} className=" flex justify-center w-full max-w-5xl h-auto">
      <CarouselContent>
        {team.map((p: Person, index: React.Key) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
            <TeamMember person={p} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious/>
      <CarouselNext/>
    </Carousel>
    :<h1 className='text-3xl'>Loading...</h1>
    }
    </>
    // <TeamMember person={p}/>
  );
}


export default function Team() {
  return (
    <section className={`${oswald.className}flex flex-col w-full min-h-screen bg-[rgb(91,130,73)] space-y-20`}>
      <div className="flex w-full justify-center">
        <h1 className="pt-10 text-2xl">
          Meet The Team That Made RowdyHacks IX Possible!
        </h1>
      </div>
      <div className="flex w-full h-full items-center justify-center">
        <CarouselDefault />
      </div>
    </section>
  );
}
