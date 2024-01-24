import Carousel from 'react-bootstrap/Carousel';
import TeamPerson from './TeamPerson'

export type Person = {
    name:string; //picture file name must match name with .png
    role:string;
    linkedin:string;
    website:string;
    github:string;
}

function createPerson(name:string, role:string, linkedin:string, website:string, github:string):Person {
    let person:Person = {name:name, role:role, linkedin:linkedin, website:website, github:github}
    return person;
}

type HashMap = {
  [key: string]: Object;
};

let team: Array<Person> = [
    // add each person here. if no website, leave empty string
    createPerson("Mei", "Director", "linkedin.com", "https://www.google.com/", "github.com"),
    createPerson("Nathan", "Director", "", "https://www.google.com/", "https://www.github.com"),
    createPerson("Nathan", "Director", "https://www.linkedin.com", "https://www.google.com/", "https://www.github.com"),
    createPerson("Nathan", "Director", "https://www.linkedin.com", "https://www.google.com/", "https://www.github.com"),
    createPerson("Nathan", "Director", "https://www.linkedin.com", "https://www.google.com/", "https://www.github.com"),
    createPerson("Nathan", "Director", "https://www.linkedin.com", "https://www.google.com/", "https://www.github.com"),
    createPerson("Nathan", "Director", "https://www.linkedin.com", "https://www.google.com/", "https://www.github.com"),
    createPerson("Nathan", "Director", "https://www.linkedin.com", "https://www.google.com/", "https://www.github.com"),
    createPerson("Nathan", "Director", "https://www.linkedin.com", "https://www.google.com/", "https://www.github.com"),
    createPerson("Nathan", "Director", "https://www.linkedin.com", "https://www.google.com/", "https://www.github.com"),
    createPerson("Nathan", "Director", "https://www.linkedin.com", "https://www.google.com/", "https://www.github.com"),
    createPerson("Nathan", "Director", "https://www.linkedin.com", "https://www.google.com/", "https://www.github.com"),
    createPerson("Nathan", "Director", "https://www.linkedin.com", "https://www.google.com/", "https://www.github.com"),
    createPerson("Nathan", "Director", "https://www.linkedin.com", "https://www.google.com/", "https://www.github.com"),
    createPerson("Nathan", "Director", "https://www.linkedin.com", "https://www.google.com/", "https://www.github.com"),
]

export function CarouselDefault() {

    let teamPageArray: Person[][] = [];

    for (let i = 0; i < team.length / 10; i++) {
        teamPageArray[i] = [];
        for (let j = 0; j < 10; j++) {
            if (team.length <= i*10+j) break;
            teamPageArray[i].push(team[(i*10)+j])
        }
    }

    return (
        <Carousel interval={null}>
            {teamPageArray.map((people, index) =>
                <Carousel.Item>
                    <Page key={index} list={people}/>
                </Carousel.Item>)}
        </Carousel>
    );
}


function Page({list}:{list:Person[]}) {
    return (
        <div className={"grid grid-cols-5 grid-rows-2 mx-20 gap-x-0.5 p-5"}>
            {list.map((person:Person, index:React.Key) =>
                <TeamPerson key={index} person={person}/>
            )}
        </div>
    )
}

export default function Team() {

    return (
        <>
            <div className="flex flex-wrap -mx-3 bg-[#3D5A30]">
                <div className="w-full max-w-full px-3 mb-6 mx-auto">
                    <div
                        className="relative flex-[1_auto] flex flex-col break-words min-w-0 bg-clip-border rounded-[.95rem] m-5">
                        {/* card body  */}
                        <div className="flex-auto block py-8 px-9">
                            <div>
                                <div className="mb-9">
                                    <h1 className="mb-2 text-[1.75rem] font-semibold text-dark">
                                        Rowdyhacks IX Organizers
                                    </h1>
                                    <span className="text-[1.15rem] font-medium text-muted">
                                        {" "}Meet All The People Who worked To Make Rowdyhacks Possible!{" "}
                                    </span>
                                </div>
                                <CarouselDefault/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}