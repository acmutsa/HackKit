import { Manuale, Shadows_Into_Light } from "next/font/google";

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
            <div className="flex w-full max-w-[1600px] flex-col items-center justify-center gap-8 ">
                <div className="flex w-full max-w-[1400px] flex-row items-center justify-center gap-8">
                    <div className="relative flex w-[50%] justify-center">
                        <img src="/img/assets/FAQ.svg" className="w-full" />
                        <img src="/img/assets/classified.svg" className="w-[22cqw] absolute -top-[8%] right-[10%]  rotate-[15deg]" />

                        <div className="absolute top-[10%] flex flex-col items-center w-full gap-4 px-4 gap-y-8">
                            <div className="flex flex-row items-center justify-center max-w-[1600px]">
                                <img src="/img/assets/finger-print.svg" alt="" className="w-[3.5cqw] border border-r-0 border-black" />
                                <h1 className={`text-center font-bold text-[3.5cqw] border border-black pl-[1cqw] pr-[25cqw]  ${manuale.className}`}>
                                    FAQ
                                </h1>
                            </div>
                            {/* need to map out faq.json here */}
                            <div className="flex flex-col items-left justify-center w-[35cqw]">
                                <h2 className={`font-bold text-[1.5cqw]  pr-[5cqw]  ${manuale.className}`}>
                                    What is RowdyHacks?
                                </h2>
                                <p className={`font-normal text-[1.5cqw] pr-[5cqw]  ${manuale.className}`}>
                                    RowdyHacks is UTSA's annual hackathon, hosted by the Association for Computing Machinery (ACM) at UTSA. It's a weekend-long event where students, tech enthusiasts, and creative minds from all backgrounds come together to collaborate, innovate, and build real-world projects in 24 hours.
                                </p>
                            </div>

                            <div className="flex flex-col items-left justify-center w-[35cqw]">
                                <h2 className={`font-bold text-[1.5cqw]  pr-[5cqw]  ${manuale.className}`}>
                                    How Much Experience Do I Need?
                                </h2>
                                <p className={`font-normal text-[1.5cqw]  pr-[5cqw]  ${manuale.className}`}>
                                    No prior experience is required! RowdyHacks is open to all skill levels, from beginners to experienced developers. We'll have workshops, mentors, and resources available to help you get started.
                                </p>
                            </div>

                            <div className="flex flex-col items-left justify-center w-[35cqw]">
                                <h2 className={`font-bold text-[1.5cqw]  pr-[5cqw]  ${manuale.className}`}>
                                    What Should I Bring?
                                </h2>
                                <p className={`font-normal text-[1.5cqw]  pr-[5cqw]  ${manuale.className}`}>
                                    Please bring a valid ID in addition to anything that would help you with creating your hack or making you comfortable. A laptop, charger, mouse, keyboard, hardware, light jacket, and any hygienic products should be helpful. Don't bring anything you wouldn't bring on an airplane.
                                </p>
                            </div>

                        </div>
                    </div>

                    <div className="relative flex w-[50%] justify-center ">
                        <img src="/img/assets/FAQ.svg" className="w-full -scale-y-100" />

                        <div className="absolute top-[10%] flex flex-col items-center  py-16 w-full gap-4 px-4 gap-y-12">
                            {/* need to map out faq.json here */}


                            <div className="flex flex-col items-left justify-center w-[35cqw]">
                                <h2 className={`font-bold text-[1.5cqw]  pr-[5cqw]  ${manuale.className}`}>
                                    How do teams work?
                                </h2>
                                <p className={`font-normal text-[1.5cqw]  pr-[5cqw]  ${manuale.className}`}>
                                    Teams are limited to 1-4 hackers. If you have a team in mind, make sure all members submit an application before the deadline. If you don't have a team and would like to be a part of one, no worries! We'll have a dedicated time for team formation after the opening ceremony.
                                </p>
                            </div>

                            <div className="flex flex-col items-left justify-center w-[35cqw]">
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