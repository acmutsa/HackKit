"use client";
import React from "react";
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
  linkedin?: string,
  website?: string,
  github?: string
): Person {
  return {
    fname: fname,
    lname: lname,
    imgLink: CreateImgLink(fname),
    role: role,
    linkedin: linkedin || '',
    website: website || '',
    github: github || '',
  };
}
/**
 * Helper function to find each team member's image in the public img landing folder
 * @param firstname 
 * @param lastname
 * @returns Image Link
 * 
 */
function CreateImgLink(firstname: string):string {
  return `/img/people/${firstname.toLowerCase()}.png`;
}

// Insert whatever roles that you want here and add them to the roles object
const roles = {
  ops: "Operations",
  industry: "Industry",
  hackex: "Hacker Experience",
  designmark: "Design and Marketing",
  finance: "Finance",
  tech: "Technology",
  dei: "Diversity, Equity, and Inclusion",
  associate: "Associate",
};

function director(role: keyof typeof roles | 'colead') {
  if (role === 'colead') return 'Co-Lead Director';
  return `Director of ${roles[role]}`;
}

let team: Array<Person> = [
  // add each person here. if no website, leave empty string
  createPerson(
    "Trent",
    "Ward",
    director('colead'),
    // "https://www.linkedin.com/",
    // "https://www.google.com/",
    // "https://www.github.com/"
  ),
  createPerson(
    "Saharsh",
    "Goenka",
    director('colead'),
    // "https://www.linkedin.com/",
    // "https://www.google.com/",
    // "https://www.github.com/"
  ),
  createPerson(
    "Kartik",
    "Aggarwal",
    "Director of Finance",
    // "https://www.linkedin.com/",
    // "https://www.google.com/",
    // "https://www.github.com/"
  ),
  createPerson(
    "Omkaar",
    "Shenoy",
    "Director of Hacker Experience",
    // "https://www.linkedin.com/",
    // "https://www.google.com/",
    // "https://www.github.com/"
  ),
  createPerson(
    "Yoni",
    "Rosenbloom",
    "Director of Industry",
    // "https://www.linkedin.com/",
    // "https://www.google.com/",
    // "https://www.github.com/"
  ),
  createPerson(
    "Satya",
    "Neriyanuru",
    roles.industry,
    // "https://www.linkedin.com/",
    // "https://www.google.com/",
    // "https://www.github.com/"
  ),
  // createPerson(
  //   "Keerthana",
  //   "Gontu",
  //   roles.,
  //   // "https://www.linkedin.com/",
  //   // "https://www.google.com/",
  //   // "https://www.github.com/"
  // ),
  createPerson(
    "Dhanush",
    "Vardhan",
    roles.tech,
    // "https://www.linkedin.com/",
    // "https://www.google.com/",
    // "https://www.github.com/"
  ),
  createPerson(
    "Dhravya",
    "Shah",
    roles.tech,
    // "https://www.linkedin.com/",
    // "https://www.google.com/",
    // "https://www.github.com/"
  ),
  // createPerson(
  //   "Satya",
  //   "Neriyanuru",
  //   roles.,
  //   // "https://www.linkedin.com/",
  //   // "https://www.google.com/",
  //   // "https://www.github.com/"
  // ),
  createPerson(
    "Bhoomi",
    "Sahajsinghani",
    roles.designmark,
    // "https://www.linkedin.com/",
    // "https://www.google.com/",
    // "https://www.github.com/"
  ),
  // createPerson(
  //   "David",
  //   "Nguyen",
  //   roles.,
  //   // "https://www.linkedin.com/",
  //   // "https://www.google.com/",
  //   // "https://www.github.com/"
  // ),
  // createPerson(
  //   "Christian",
  //   "Thompson",
  //   roles.,
  //   // "https://www.linkedin.com/",
  //   // "https://www.google.com/",
  //   // "https://www.github.com/"
  // ),
  createPerson(
    "Cecilia",
    "La Place",
    roles.associate,
    // "https://www.linkedin.com/",
    // "https://www.google.com/",
    // "https://www.github.com/"
  ),
  createPerson(
    "Paul",
    "Horton",
    roles.associate,
    // "https://www.linkedin.com/",
    // "https://www.google.com/",
    // "https://www.github.com/"
  ),
  createPerson(
    "Edmund",
    "Dong",
    roles.associate,
    // "https://www.linkedin.com/",
    // "https://www.google.com/",
    // "https://www.github.com/"
  ),
  // createPerson(
  //   "Evan",
  //   "Tung",
  //   roles.associate,
  //   // "https://www.linkedin.com/",
  //   // "https://www.google.com/",
  //   // "https://www.github.com/"
  // ),
];

function MobileTeam() {
  const [data_rendered, setData_rendered] = useState(false);

  useEffect(() => {
    // Basic use effect hook to check if the page has rendered
    setData_rendered(true);
  }, []);

  return (
    <>
      {data_rendered ? (
        <div className="flex flex-col w-full justify-center items-center ">
          <div className="overflow-x-auto overflow-y-hidden grid grid-flow-row w-[85%] grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 no-scrollbar ">
            {team.map((p: Person, index: React.Key) => (
              <TeamMember person={p} key={index} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-[#FEF2E6] tetx-3xl">Loading...</div>
      )}
    </>
  );
}

export default function Team() {
  return (
    <section
      className={`${oswald.className} flex flex-col w-full h-full space-y-20 pb-20 border-y-2 border-muted-foreground`}>
      <div className="flex flex-col w-full justify-center items-center mx-auto">
        {/* <h2 className="text-3xl font-bold px-4 md:px-0 text-center">
          Demo Responsive Team Section
        </h2> */}
        <h1 className="pt-10 text-xl text-center sm:text-3xl md:text-4xl lg:text-5xl font-bold font-oswald italic">
          {`Meet the team!`}
        </h1>
      </div>
      <div className="flex w-full h-full items-center justify-center">
        <MobileTeam />
      </div>
    </section>
  );
}
