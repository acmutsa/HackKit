
"use client"
import { Oswald } from "next/font/google";
import { Manuale } from "next/font/google";
import faqs from "./faq.json";
import { motion } from "motion/react";
import Pin from "@/components/landing/Pin";
const manuale = Manuale({
    subsets: ["latin"],
    display: "swap",
});
const oswald = Oswald({
    variable: "--font-oswald",
    subsets: ["latin"],
});

function PaperBg(){
    return(
        <img src="img/assets/faq/FAQ.svg" alt="" 
        className="absolute w-full h-full inset-0 drop-shadow-[6px_8px_3px_rgba(0,0,0,0.45)]"/>
    );

}

type Faq = { question: string; answer: string };

const LEFT_COUNT = 5;
const allFaqs = faqs.faq as Faq[];
const leftFaqs = allFaqs.slice(0, LEFT_COUNT);
const rightFaqs = allFaqs.slice(LEFT_COUNT);

function DossierPins() {
    return (
        <>
        <Pin className="absolute left-[25%] top-[5%] z-30 sm:left-[30%] sm:top-[7%]  md:left-[20%] md:top-[2%]" />
        <Pin className="absolute left-[50%] top-[3%] z-30 sm:left-[50%] sm:top-[4%] md:left-[30%] md:top-[7%] lg:left-[30%] lg:top-[10%]" />
        <Pin className="absolute left-[80%] top-[6%] z-30 sm:left-[80%] sm:top-[8%] md:left-[40%] md:top-[4%] lg:left-[40%] lg:top-[6%]" />

        <Pin className=" hidden md:block absolute left-[90%] top-[5%] z-30 sm:left-[25%] sm:top-[7%]  md:left-[60%] md:top-[12%]" />
        <Pin className=" hidden sm:block lg:hidden absolute left-[1200%] top-[10%] z-30 sm:left-[35%] sm:top-[7%]  md:left-[80%] md:top-[7%]" />
        <Pin className=" hidden sm:block  absolute left-[100%] top-[3%] z-30 sm:left-[50%] sm:top-[4%] md:left-[30%] md:top-[7%] lg:left-[80%] lg:top-[8%]" />
        
        </>
    );
}
function ClassifiedStamp({
    wrapperClassName = "relative flex justify-end pr-[5%] pb-[5%]",
}: {
    wrapperClassName?: string;
}) {
    return (
        <div className={wrapperClassName}>
            <motion.img
                src="/img/assets/faq/classified.svg"
                className="h-auto w-[55%] rotate-[-15deg] object-contain"
                initial={{ scale: 0, y: -40, opacity: 0, rotate: 15 }}
                whileInView={{
                    scale: [0.25, 3, 1],
                    y: [-80, 0],
                    opacity: [0, 1, 1],
                }}
                transition={{
                    duration: 0.5,
                    delay: 0.75,
                    ease: [0.2, 0.9, 0.2, 1],
                }}
                viewport={{ once: false, margin: "0px 0px -20% 0px" }}
            />
        </div>
    );
}

function FaqHeader() {
    return (
        <div className="relative flex flex-row  w-full  py-[5cqw]">
            <img
                src="/img/assets/faq/finger-print.svg"
                alt=""
                className="h-auto w-[4cqw] border border-r-0 border-black object-contain p-[0.25cqw]"
            />
            <h1
                className={`w-[100%] border border-black  p-[5%] text-start text-2xl font-bold sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl ${manuale.className}`}
            >
                FAQ
            </h1>
        </div>
    );
}

function FaqItem({ item }: { item: Faq }) {
    return (
        <motion.div
            className="relative flex flex-col"
            initial="rest"
            whileHover="hover"
            animate="rest"
        >
            <div className="relative w-fit py-[0%] pr-[20%]">
                <h2
                    className={`text-xs font-bold sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl ${manuale.className}`}
                >
                    {item.question}
                </h2>
                <motion.img
                    src="/img/assets/faq/marker-circle4.svg"
                    className="absolute inset-0 -left-10 -top-1 h-full w-full object-fill"
                    variants={{
                        rest: { opacity: 0, scale: 0.8 },
                        hover: { opacity: 1, scale: 1 },
                    }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    alt=""
                />
            </div>
            <p
                className={`pl-[5%] text-xs font-normal sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl ${manuale.className}`}
            >
                {item.answer}
            </p>
        </motion.div>
    );
}

export default function FAQClient() {
    return (
        <section className="relative w-full flex items-center justify-center pb-[0vw] sm:pb-[3vw] md:pb-[8vw] lg:pb-[10vw]">
            <Pin className="absolute left-[-20%] top-[-10%] z-30 sm:left-[-20%] sm:top-[-10%]  md:left-[-20%] md:top-[-10%]" />
            <DossierPins/>
        <div className="relative w-full ">
            
            {/* <Navbar /> */}
            <div className="flex w-full flex-col items-center justify-center gap-8 [container-type:inline-size]">
            <div className="hidden h-full w-full flex-row items-start justify-center md:flex">
                {/* Left Paper */}
                <div className="flex justify-center">
                <div className="relative flex flex-col w-[40cqw] pb-[40%] pt-[10%] px-[10%]">
                    <PaperBg />
                    <div className="relative">
                        <FaqHeader/>
                    </div>
                    {leftFaqs.map((item,index)=>(
                        <FaqItem key={index} item={item}/>
                    ))}
                </div>
                </div>
    
                {/* Right Paper */}
                <div className="flex justify-center pt-[4%]">
                <div className="relative flex flex-col  w-[40cqw] pb-[40%] pt-[40%] px-[10%]">
                    <PaperBg />
                    <div className="relative">
                        <ClassifiedStamp/>
                    </div>
                    {rightFaqs.map((item, index) => (
                        <FaqItem key={index} item={item} />
                    ))}
                </div>
                </div>
                
            </div>
            </div>

            <div className="flex w-full justify-center md:hidden">
                        <div className="relative flex w-[100cqw] flex-col gap-y-[1.5cqw] px-[10%] pb-[50%] pt-[25%]">
                            <PaperBg />

                            <div className="relative">
                                <FaqHeader />
                                <ClassifiedStamp wrapperClassName="pointer-events-none absolute inset-0 flex items-center justify-end pr-[-50%]" />
                            </div>
                            
                            {allFaqs.map((item, index) => (
                                <FaqItem key={index} item={item} />
                            ))}
                        </div>
                    </div>
        </div>
        <Pin
            className=" block sm:hidden lg:block absolute left-[190vw] top-[90%] z-30 sm:left-[180vw] sm:top-[90%] md:left-[190vw] md:top-[10%]"
            />
    </section>
    );
  }
