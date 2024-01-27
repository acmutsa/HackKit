import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../shadcn/ui/carousel";

import TeamMember from "./TeamMember";

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
    "",
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
  return (
    //Where Carousel will go
    <Carousel opts={
        {align:"start"}
    }
    className="w-full max-w-2xl"
    >
        <CarouselContent>
        {
            team.map((p:Person,index:React.Key)=>(
                <TeamMember key={index} person={p}/>
            ))
        }
        </CarouselContent>
        <CarouselPrevious/>
        <CarouselNext/>
    </Carousel>
  );
}

// function Page({ list }: { list: Person[] }) {
//   return (
//     <div className={"grid grid-cols-5 grid-rows-2 mx-20 gap-x-0.5 p-5"}>
//       {list.map((person: Person, index: React.Key) => (
//         <TeamPerson key={index} person={person} />
//       ))}
//     </div>
//   );
// }

export default function Team() {
  return (
    <>
      <div className="flex flex-col bg-[url('/img/landing/About_background.svg')] bg-cover bg-no-repeat w-full">
        <div className="w-full max-w-full px-3 mb-6 mx-auto">
          <div className="relative flex-[1_auto] flex flex-col break-words min-w-0 bg-clip-border rounded-[.95rem] m-5">
            {/* card body  */}
            <div className="flex-auto block py-8 px-9">
              <div>
                <div className="mb-9">
                  <h1 className="mb-2 text-[1.75rem] font-semibold text-dark">
                    Rowdyhacks IX Organizers
                  </h1>
                  <span className="text-[1.15rem] font-medium text-muted">
                    {" "}
                    Meet All The People Who worked To Make Rowdyhacks Possible!{" "}
                  </span>
                </div>
                <div className="flex items-center justify-center">
                  <CarouselDefault />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
