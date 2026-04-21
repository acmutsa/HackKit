"use client";
import Image from "next/image";
import { useRef } from "react";
import { Shadows_Into_Light } from "next/font/google";
import Pin from "@/components/landing/Pin";
import { findPosition } from "@/hooks/findPosition";

const shadowsIntoLight = Shadows_Into_Light({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-shadows",
});

export default function Map() {

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapImgRef = useRef<HTMLImageElement>(null);
  const mainCampusCardRef = useRef<HTMLDivElement>(null);
  const mainCampusImgRef = useRef<HTMLImageElement>(null);
  const sp1CardRef = useRef<HTMLDivElement>(null);
  const sp1CampusImgRef = useRef<HTMLImageElement>(null);

  const sp1PinStyle = findPosition(mapContainerRef, mapImgRef, { x: 0.54, y: 0.75 }, 20);
  const sp1TextStyle = findPosition(mapContainerRef, mapImgRef, { x: 0.46, y: 0.82 }, 10);
  const sp1CircleStyle = findPosition(mapContainerRef, mapImgRef, { x: 0.54, y: 0.77 }, 10);
  const sp1CardTextStyle = findPosition(sp1CardRef, sp1CampusImgRef, { x: 0.3, y: 0.87 }, 20);

  const mainCampusPinStyle = findPosition(mapContainerRef, mapImgRef, { x: 0.31, y: 0.22 }, 20);
  const mainCampusTextStyle = findPosition(mapContainerRef, mapImgRef, { x: 0.30, y: 0.29 }, 10);
  const mainCampusCircleStyle = findPosition(mapContainerRef, mapImgRef, { x: 0.31, y: 0.24 }, 10);
  const mainCampusCardTextStyle = findPosition(mainCampusCardRef, mainCampusImgRef, { x: 0.4, y: 0.87 }, 20);

  const connectedStyle = findPosition(mapContainerRef, mapImgRef, { x: 0.48, y: 0.50 }, 10);

  return (
    <section className="flex w-full items-center justify-center">
        <div className={`relative flex-col flex items-center justify-center gap-y-10 w-full h-fit  py-0 xl:py-12 lg:py-12 2xl:py-12 ${shadowsIntoLight.className}`}>

            <div className="relative w-full h-fit">

                {/* Pictures */}

                <div className="absolute -z-10 flex justify-between items-center w-full h-fit">

                    <div className={`invisible lg:visible pb-[20%]`}>
                        <div
                        ref={mainCampusCardRef}
                        className="relative w-[20vw] aspect-[3.5/4] rotate-[3deg] drop-shadow-[6px_8px_3px_rgba(0,0,0,0.45)]"
                        >
                            <Image
                                ref={mainCampusImgRef}
                                src="/img/map/main-campus.svg"
                                alt="main campus"
                                fill
                                className="object-contain"
                            />
                            <div className="absolute inset-0 flex items-start justify-center pt-4">
                                <Pin/>
                            </div>
                            <div style={mainCampusCardTextStyle}>
                                <p className="w-full text-[#AC1903] font-extrabold text-2xl">
                                    Target 2
                                </p>
                            </div>

                        </div>
                    </div>

                    <div className={`invisible lg:visible pt-[20%]`}>
                        <div
                        ref={sp1CardRef}
                        className="relative w-[20vw] aspect-[3.5/4] rotate-[3deg] drop-shadow-[6px_8px_3px_rgba(0,0,0,0.45)]"
                        >
                            <Image
                                ref={sp1CampusImgRef}
                                src="/img/map/SP1.svg"
                                alt="sp1"
                                fill
                                className="object-contain"
                            /> 
                            <div className="absolute inset-0 flex items-start justify-center pt-4">
                                <Pin/>
                            </div>
                            
                            <div style={sp1CardTextStyle}>
                                <p className="w-full text-[#AC1903] font-extrabold text-2xl">
                                    SP1 - Target 1
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

                <div
                  ref={mapContainerRef}
                  className={`relative flex justify-start items-center w-full h-[45vh] sm:h-[55vh] md:h-[70vh] lg:h-[70vh] xl:h-[80vh] 2xl:h-[100vh]`}
                >
                    {/* San Pedro 1 */}
                    <div style={sp1PinStyle}>
                        <Pin name="/img/map/pin4.svg" size={24}/>
                    </div>

                    <a
                        href="https://maps.app.goo.gl/cRWsqr1B3qmSnTcM6"
                        target="_blank"
                        style={sp1TextStyle}
                    >
                        <p className="text-[#AC1903] font-extrabold text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl">
                            UTSA <br/> San Pedro 1 <br/> (Place of action)
                        </p>
                    </a>

                    <div style={sp1CircleStyle}>
                        <div className="relative w-[8vw] h-[8vw] sm:w-[6vw] sm:h-[6vw]">
                            <Image
                                src="/img/map/red-circle1.svg"
                                alt="pin"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>

                    {/* Main Campus */}
                    <div style={mainCampusPinStyle}>
                        <Pin name="/img/map/pin5.svg" size={24}/>
                    </div>

                    <div style={mainCampusCircleStyle}>
                        <div className="relative w-[8vw] h-[8vw] sm:w-[6vw] sm:h-[6vw]">
                            <Image
                                src="/img/map/red-circle1.svg"
                                alt="pin"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>

                    <a
                        href="https://maps.app.goo.gl/DesReqWDY8sV5jrY9"
                        target="_blank"
                        style={mainCampusTextStyle}
                    >
                        <p className="text-[#AC1903] font-extrabold text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-bold">
                            UTSA <br/> Main Campus
                        </p>
                    </a>

                    <div style={connectedStyle}>
                        <p className="rotate-[61deg] text-[#AC1903] font-extrabold text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-3xl 2xl:text-4xl">
                            CONNECTED? 
                        </p>
                    </div>


                    <Image
                        ref={mapImgRef}
                        src="/img/map/map-background.svg"
                        alt="red-circle"
                        fill
                        className="object-contain object-center drop-shadow-[6px_10px_3px_rgba(0,0,0,0.55)]"
                    />
                </div>

            </div>

        </div>
    </section>
  );
}
