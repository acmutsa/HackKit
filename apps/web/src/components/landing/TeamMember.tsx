"use client"

import { Person } from "./Person";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../shadcn/ui/card"
import { Oswald } from "next/font/google";
import Image from "next/image";
import { useState } from "react";
const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});


// Using the raw svg tag is inefficient. Will need to change later
function LinkedIn({ fillColor }: {fillColor:string}) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={fillColor}>
            <path
                d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
    );
}


function Website({fillColor}:{fillColor:string}) {
    return (
        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"
             className={fillColor} overflow={"true"}>
            <path
                d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12m2.557 16h-5.115c.546 2.46 1.441 4.114 2.558 5.744 1.194-1.741 2.041-3.41 2.557-5.744m-7.157 0h-4.567c1.236 2.825 3.704 4.972 6.755 5.716-1.048-1.733-1.783-3.658-2.188-5.716m13.767 0h-4.567c-.391 1.988-1.095 3.887-2.175 5.694 3.012-.763 5.517-2.895 6.742-5.694m-14.005-6h-4.962c-.267 1.313-.267 2.685 0 4h4.915c-.119-1.329-.101-2.672.047-4m7.661 0h-5.647c-.165 1.326-.185 2.672-.053 4h5.753c.133-1.328.111-2.673-.053-4m6.977 0h-4.963c.148 1.328.166 2.671.048 4h4.915c.26-1.285.273-2.648 0-4m-12.156-7.729c-3.077.732-5.567 2.886-6.811 5.729h4.653c.435-2.042 1.178-3.985 2.158-5.729m2.355-.048c-1.089 1.77-1.91 3.453-2.463 5.777h4.927c-.534-2.246-1.337-3.948-2.464-5.777m2.368.069c1.013 1.812 1.733 3.76 2.146 5.708h4.654c-1.232-2.816-3.762-4.958-6.8-5.708"/>
        </svg>
    )
}


function Github({ fillColor }:{fillColor:string}) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={fillColor}>
            <path
                d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
    )
}


export default function TeamMember({person}:{person:Person}) {
    // Edit the max width and height and then set the height to auto in the styling

    const [src,setSrc] = useState(person.imgLink);
    const [styling, setStyling] = useState(
      "max-w-[150px] md:max-w-[170px] lg:max-w-[190px] 2xl:max-w-[200px] h-auto rounded-lg"
    );

    const FallBackStyling = "max-w-[105px] md:max-w-[132px] lg:max-w-[150px] xl:max-w-[151px] 2xl:max-w-[188px] rounded-lg";

      
    return (
      <Card
        className={`flex items-center justify-center ${oswald.className} bg-transparent border-transparent shadow-none hover:scale-[1.15] duration-300 basis-1/2 md:basis-auto`}>
        <div>
          <CardHeader className="items-center">
            <CardTitle className="text-xl sm:text-2xl md:text-xl 2xl:text-3xl">
              <h1 className="font-bold">{`${person.fname}\u00A0${person.lname}`}</h1>
            </CardTitle>
            <CardDescription>
              <h2 className="text-sm">{person.role}</h2>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            {/* This also needs to be fixed */}
            <Image
              width={300}
              height={300}
              src={src}
              className={`${styling}`}
              quality={100}
              priority={true}
              alt="Person Placeholder"
              onError={(e) => {
                setSrc("/img/logo/hackkit.svg");
                setStyling(FallBackStyling);
              }}
            />
          </CardContent>
          <CardFooter>
            <div
              className={
                "flex w-full h-full items-baseline justify-center gap-3"
              }>
              <a
                href={person.linkedin}
                target="_blank"
                className={person.linkedin ? "" : "hidden"}>
                <div className={"size-8"}>
                  <LinkedIn fillColor={"fill-gray-400"} />
                </div>
              </a>
              <a
                href={person.website}
                target="_blank"
                className={person.website ? "" : "hidden"}>
                <div className={"size-8"}>
                  <Website fillColor={"fill-gray-400"} />
                </div>
              </a>
              <a
                href={person.github}
                target="_blank"
                className={person.github ? "" : "hidden"}>
                <div className={"size-8"}>
                  <Github fillColor={"fill-gray-400"} />
                </div>
              </a>
            </div>
          </CardFooter>
        </div>
      </Card>
    );
}