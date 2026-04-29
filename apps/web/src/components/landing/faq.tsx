"use client"
import { Manuale, Shadows_Into_Light } from "next/font/google";
import { motion } from "motion/react"
const manuale = Manuale({
    subsets: ["latin"],
    display: "swap",
});
const shadow = Shadows_Into_Light({
    subsets: ["latin"],
    weight: "400",
});

export default function FAQ() {
    return (
        <section
            className="flex w-full items-center justify-center"
            id="About"
        >
            <div className="flex w-full max-w-[1600px] flex-col items-center justify-center gap-8 [container-type:inline-size]">
                <div className="flex w-full max-w-[1400px] flex-row items-center justify-center">
                    <div className="relative flex w-[50%] justify-center">
                        <img src="/img/assets/FAQ.svg" className="w-[33cqw]" />

                        <div className="absolute top-[8%] flex flex-col items-center w-full gap-4 px-4 gap-y-1">
                            <div className="flex flex-row items-stretch justify-center max-w-[1600px]">
                                <img src="/img/assets/finger-print.svg" alt="" className="w-[2.5cqw] h-auto object-contain border border-r-0 border-black" />
                                <h1 className={`text-center font-bold text-[2.5cqw] border border-black pl-[1cqw] pr-[20cqw]  ${manuale.className}`}>
                                    FAQ
                                </h1>

                            </div>
                            {/* need to map out faq.json here */}
                            <div className="flex flex-col items-left justify-center w-[25cqw]">
                                <h2 className={`font-bold text-[1.5cqw]  pr-[5cqw]  ${manuale.className}`}>
                                    What is RowdyHacks?
                                </h2>
                                <p className={`font-normal text-[1.5cqw] pr-[2cqw]  ${manuale.className}`}>
                                    RowdyHacks is UTSA's annual hackathon, hosted by the Association for Computing Machinery (ACM) at UTSA. It's a weekend-long event where students, tech enthusiasts, and creative minds from all backgrounds come together to collaborate, innovate, and build real-world projects in 24 hours.
                                </p>
                            </div>

                            <div className="flex flex-col items-left justify-center w-[25cqw]">
                                <h2 className={`font-bold text-[1.5cqw]  pr-[5cqw]  ${manuale.className}`}>
                                    How Much Experience Do I Need?
                                </h2>
                                <p className={`font-normal text-[1.5cqw]  pr-[2cqw]  ${manuale.className}`}>
                                    No prior experience is required! RowdyHacks is open to all skill levels, from beginners to experienced developers. We'll have workshops, mentors, and resources available to help you get started.
                                </p>
                            </div>

                        </div>
                    </div>

                    <div className="relative flex w-[50%] justify-center  pt-[5%]">
                        <img src="/img/assets/FAQ.svg" className="w-[33cqw]" />
                        <img src="/img/assets/classified.svg" className="w-[40%] h-auto object-contain absolute -top-[4%] right-[15%] rotate-[15deg]" />
                        <div className="absolute top-[8%] flex flex-col items-center py-[6cqw] w-full gap-4 px-4 gap-y-1">
                            {/* need to map out faq.json here */}


                            <div className="flex flex-col items-left justify-center w-[25cqw]">
                                <h2 className={`font-bold text-[1.5cqw]  pr-[5cqw]  ${manuale.className}`}>
                                    How do teams work?
                                </h2>
                                <p className={`font-normal text-[1.5cqw]  pr-[5cqw]  ${manuale.className}`}>
                                    Teams are limited to 1-4 hackers. If you have a team in mind, make sure all members submit an application before the deadline. If you don't have a team and would like to be a part of one, no worries! We'll have a dedicated time for team formation after the opening ceremony.
                                </p>
                            </div>

                            <div className="flex flex-col items-left justify-center w-[25cqw]">
                                <h2 className={`font-bold text-[1.5cqw]  pr-[5cqw]  ${manuale.className}`}>
                                    Can I stay overnight?
                                </h2>
                                <p className={`font-normal text-[1.5cqw]  pr-[5cqw]  ${manuale.className}`}>
                                    Yes, however, if you leave the building after its closing time, you will not be able to re-enter until it re-opens, so plan accordingly. The building closes at 6PM and re-opens at 6AM.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );

}