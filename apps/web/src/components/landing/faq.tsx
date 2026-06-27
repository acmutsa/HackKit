"use client";
import { Manuale } from "next/font/google";
import faqData from "./faq.json";
import { motion } from "motion/react";
import Pin from "./Pin";
import Link from "next/link";


export function FaqHoverLink() {
  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      className=" relative py-[2cqw] pb-0 "
    >
      <Link href="/faq" className="inline-flex items-center gap-2">
	  <motion.span
          variants={{
            rest: { opacity: 0, x: -12 },
            hover: { opacity: [0,0.25,0.5,0.75,1], x: 2 },
          }}
          transition={{ duration: 0.15 }}
		  className={`text-2xl ${manuale.className} hover:underline`}
        >
          More Questions?</motion.span>
        <motion.svg
          width="40"
          height="40"
          viewBox="0 0 20 20"
          variants={{
            rest: { opacity:1, x: 5 },
            hover: {opacity:1, x: 175 },
          }}
		  transition={{duration: 0.25}}
		  className="absolute justify-end"
        
        >
          <path
            d="M7.5 5L12.5 10L7.5 15"
            fill="none"
            stroke="#AB1820"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
		
      </Link>
    </motion.div>
  );
}
const manuale = Manuale({
	subsets: ["latin"],
	display: "swap",
});

type Faq = { question: string; answer: string };

const LEFT_COUNT = 4;
const allFaqs = faqData.faq as Faq[];
const leftFaqs = allFaqs.slice(0, LEFT_COUNT);
const rightFaqs = allFaqs.slice(LEFT_COUNT);

function DossierPins() {
	return (
		<>
		<Pin className="absolute left-[25%] top-[5%] z-30 sm:left-[25%] sm:top-[7%]  md:left-[25%] md:top-[7%]" />
		<Pin className="absolute left-[50%] top-[3%] z-30 sm:left-[50%] sm:top-[4%] md:left-[57%] md:top-[18%] lg:left-[57%] lg:top-[23%]" />
		<Pin className="absolute left-[80%] top-[6%] z-30 sm:left-[80%] sm:top-[8%] md:left-[75%] md:top-[15%] lg:left-[75%] lg:top-[17%]" />
		</>
	);
}

function PaperBg() {
	return (
		<img
			src="/img/assets/faq/FAQ.svg"
			className="absolute inset-0 h-full w-full object-fill drop-shadow-[6px_8px_3px_rgba(0,0,0,0.45)]"
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
				className="h-auto w-[4cqw] border border-r-0 border-black object-contain p-[0.5cqw]"
			/>
			<h1
				className={`w-[100%] border border-black p-[5%] text-start text-xs font-bold sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl ${manuale.className}`}
			>
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

function FaqItem({ item }: { item: Faq }) {
	return (
		<motion.div
			className="relative flex flex-col"
			initial="rest"
			whileHover="hover"
			animate="rest"
		>
			<div className="relative w-fit py-[5%] pr-[20%]">
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

/* ---------- Page ---------- */

export default function FAQ() {
	return (
		<section className="relative w-full flex items-center justify-center pb-[0vw] sm:pb-[3vw] md:pb-[5vw]" id="FAQ"> 
			<DossierPins />
			<div className="flex w-full flex-col items-center justify-center gap-8 [container-type:inline-size]">
				{/* ===== Desktop & Tablet ===== */}
				<div className="hidden w-full flex-row items-center justify-center md:flex">
					{/* Left paper */}
					<div className="flex justify-center">
						<div className="relative flex w-[40cqw] flex-col gap-y-[0.5cqw] px-[10%] pb-[30%] pt-[20%]">
							<PaperBg />
							<FaqHeader />
							{leftFaqs.map((item, index) => (
								<FaqItem key={index} item={item} />
							))}
						</div>
					</div>

					{/* Right paper */}
					<div className="flex justify-center">
						<div className="relative flex w-[40cqw] flex-col gap-y-[0.5cqw] px-[10%] pb-[26%] pt-[40%]">
							<PaperBg />
							<ClassifiedStamp />
							{rightFaqs.map((item, index) => (
								<FaqItem key={index} item={item} />
							))}

							<FaqHoverLink/>

						</div>
					</div>
				</div>
				
				{/* ===== Mobile ===== */}
				<div className="flex w-full justify-center md:hidden">
					<div className="relative flex w-[85cqw] flex-col gap-y-[0.5cqw] px-[10%] pb-[30%] pt-[20%]">
						<PaperBg />

						<div className="relative">
							<FaqHeader />
							<ClassifiedStamp wrapperClassName="pointer-events-none absolute inset-0 flex items-center justify-end pr-[2%]" />
						</div>

						{allFaqs.map((item, index) => (
							<FaqItem key={index} item={item} />
						))}
								<FaqHoverLink/>
					</div>
				</div>
			</div>
		</section>
	);
}
