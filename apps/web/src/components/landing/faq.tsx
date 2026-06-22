"use client"
import { Manuale } from "next/font/google";
import faqData from "./faq.json";
import { motion } from "motion/react";

const manuale = Manuale({
    subsets: ["latin"],
    display: "swap",
});

type Faq = { question: string; answer: string };

const LEFT_COUNT = 4;
const allFaqs = faqData.faq as Faq[];
const leftFaqs = allFaqs.slice(0, LEFT_COUNT);
const rightFaqs = allFaqs.slice(LEFT_COUNT);


function PaperBg() {
    return (
        <img
            src="/img/assets/faq/FAQ.svg"
            className="absolute inset-0 w-full h-full object-fill drop-shadow-[6px_8px_3px_rgba(0,0,0,0.45)]"
            alt=""
        />
    );
}

function FaqHeader() {
    return (
        <div className="relative flex flex-row pb-[5%]">
            <img
                src="/img/assets/faq/finger-print.svg"
                alt=""
                className="w-[4cqw] h-auto object-contain border border-r-0 border-black p-[0.5cqw]"
            />
            <h1 className={`text-start font-bold text-xs sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl border border-black w-[100%] p-[5%] ${manuale.className}`}>
                FAQ
            </h1>
        </div>
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
                className="w-[55%] h-auto object-contain rotate-[-15deg]"
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

function FaqItem({ item }: { item: Faq }) {
    return (
        <motion.div className="relative flex flex-col" initial="rest" whileHover="hover" animate="rest">
            <div className="relative w-fit pr-[20%] py-[5%]">
                <h2 className={`font-bold text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl ${manuale.className}`}>
                    {item.question}
                </h2>
                <motion.img
                    src="/img/assets/faq/marker-circle4.svg"
                    className="absolute inset-0 w-full h-full object-fill -left-10 -top-1"
                    variants={{
                        rest: { opacity: 0, scale: 0.8 },
                        hover: { opacity: 1, scale: 1 },
                    }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    alt=""
                />
            </div>
            <p className={`font-normal text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl pl-[5%] ${manuale.className}`}>
                {item.answer}
            </p>
        </motion.div>
    );
}

/* ---------- Page ---------- */

export default function FAQ() {
    return (
        <section className="flex w-full items-center justify-center" id="FAQ">
            <div className="flex w-full max-w-[1600px] flex-col items-center justify-center gap-8 [container-type:inline-size]">

                {/* ===== Desktop & Tablet ===== */}
                <div className="hidden w-full max-w-[1400px] flex-row items-center justify-center md:flex">

                    {/* Left paper */}
                    <div className="flex justify-center">
                        <div className="relative flex w-[40cqw] flex-col gap-y-[0.5cqw] px-[10%] pt-[20%] pb-[30%]">
                            <PaperBg />
                            <FaqHeader />
                            {leftFaqs.map((item, index) => (
                                <FaqItem key={index} item={item} />
                            ))}
                        </div>
                    </div>

                    {/* Right paper */}
                    <div className="flex justify-center">
                        <div className="relative flex w-[40cqw] flex-col gap-y-[0.5cqw] px-[10%] pt-[20%] pb-[30%]">
                            <PaperBg />
                            <ClassifiedStamp />
                            {rightFaqs.map((item, index) => (
                                <FaqItem key={index} item={item} />
                            ))}
                        </div>
                    </div>

                </div>

                {/* ===== Mobile ===== */}
                <div className="flex w-full justify-center md:hidden">
                    <div className="relative flex w-[85cqw] flex-col gap-y-[0.5cqw] px-[10%] pt-[20%] pb-[30%]">
                        <PaperBg />

                        <div className="relative">
                            <FaqHeader />
                            <ClassifiedStamp wrapperClassName="pointer-events-none absolute inset-0 flex items-center justify-end pr-[2%]" />
                        </div>

                        {allFaqs.map((item, index) => (
                            <FaqItem key={index} item={item} />
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}