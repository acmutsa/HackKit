import { log } from "util";
import { Card, CardContent } from "../shadcn/ui/card";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../shadcn/ui/carousel";

import TeamPerson from "./TeamPerson";

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
  return `${firstname}_${lastname}.jpg`;
}
const director = 'Director'
const media = 'Media / Design'
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
    "Josh",
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
    tech,
    "https://www.linkedin.com/in/jacobellerbrock/",
    "",
    ""
  ),
  createPerson("Kathy", "Ngu", media, "", "", ""),
  createPerson("Macreen", "Marbella", media, "", "", ""),
  createPerson("Rin", "Peralez", media, "", "", ""),
  createPerson("Annalisa", "Vuong", pr, "", "", ""),
  createPerson("Diem", "Bui", pr, "", "", ""),
  createPerson("Natasha", "Blussick", pr, "", "", ""),
  createPerson(
    "Alejandro",
    "Mugica",
    logistics,
    "https://www.linkedin.com/in/alessandro-espinosa-a10640242/",
    "",
    ""
  ),
  createPerson("Calvin", "Jessen", logistics, "", "", ""),
  createPerson("Elizabeth", "Truong", logistics, "", "", ""),
  createPerson("Paolo", "Lay", logistics, "", "", ""),
  createPerson("Alessandro", "Espinosa", experience, "", "", ""),
  createPerson("Darren", "Manaligod", experience, "", "", ""),
  createPerson("Iqra", "Abdullah", experience, "", "", ""),
  createPerson("Kailey", "Perrino", experience, "", "", ""),
  createPerson("Anusha", "Abdulla", experience, "", "", ""),
];

export function CarouselDefault() {
  let teamPageArray: Person[][] = [];

  for (let i = 0; i < team.length / 10; i++) {
    teamPageArray[i] = [];
    for (let j = 0; j < 10; j++) {
      if (team.length <= i * 10 + j) break;
      teamPageArray[i].push(team[i * 10 + j]);
    }
  }

  return (
    <Carousel interval={null}>
      {teamPageArray.map((people, index) => (
        <Carousel.Item>
          <Page key={index} list={people} />
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

function Page({ list }: { list: Person[] }) {
  return (
    <div className={"grid grid-cols-5 grid-rows-2 mx-20 gap-x-0.5 p-5"}>
      {list.map((person: Person, index: React.Key) => (
        <TeamPerson key={index} person={person} />
      ))}
    </div>
  );
}

export default function Team() {
  return (
    <>
      <div className="flex flex-wrap -mx-3 bg-[#3D5A30]">
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
                <CarouselDefault />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
