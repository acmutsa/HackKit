"use client";
import { Manuale } from "next/font/google";
import faqData from "./faq.json";
import { motion } from "motion/react";
import Pin from "./Pin";

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

const questions = [
	{
		question: "Who can attend?",
		answer: "All students can sign up to be a hacker, regardless of experience, education, or background.",
	},
	{
		question: "When is the deadline to apply?",
		answer: "The registration deadline will be announced soon.",
	},
	{
		question: "How much experience do I need?",
		answer: "Absolutely zero! We want you here because you have a passion for creating, not because you're the most experienced hacker on the block.",
	},
	{
		question: "How much does it cost?",
		answer: "Nothing. Nada. Zilch. It's completely free for all accepted hackers.",
	},
	{
		question: "What should I bring?",
		answer: "Bring a valid ID and anything that will help you create or stay comfortable: a laptop, charger, mouse, keyboard, hardware, light jacket, and hygiene products. Don't bring anything you wouldn't bring on an airplane.",
	},
	{
		question: "How do teams work?",
		answer: "Teams are limited to 1–4 hackers. If you have a team in mind, make sure every member submits an application. If you don't have a team, we'll have dedicated time for team formation.",
	},
	{
		question: "Can I stay overnight?",
		answer: "Yes. However, if you leave after the building closes, you won't be able to re-enter until it reopens, so plan accordingly.",
	},
	{
		question: "Where can I park?",
		answer: "Parking information will be announced before the event.",
	},
];

function FAQSheet({
	items,
	classified = false,
}: {
	items: typeof questions;
	classified?: boolean;
}) {
	return (
		<div className="relative w-[88vw] max-w-[600px] shrink-0">
			<img src="/img/assets/FAQ.svg" alt="" className="h-auto w-full" />
			<Pin
				size={14}
				className={`absolute top-[5%] z-30 ${classified ? "right-[10%]" : "left-[10%]"}`}
			/>
			{classified && (
				<img
					src="/img/assets/classified.svg"
					alt="Classified"
					className="absolute right-[8%] top-[6%] z-20 w-[43%] rotate-[12deg]"
				/>
			)}
			<div className="absolute inset-x-[12%] top-[9%]">
				{!classified && (
					<div className="mb-[4%] flex items-stretch">
						<img
							src="/img/assets/finger-print.svg"
							alt=""
							className="w-[18%] border border-r-0 border-black object-contain p-[2%]"
						/>
						<h2 className="flex flex-1 items-center border border-black px-[6%] text-[clamp(14px,4vw,28px)] font-bold">
							FAQ
						</h2>
					</div>
				)}
				<div className={classified ? "pt-[22%]" : ""}>
					{items.map(({ question, answer }) => (
						<div className="mb-[5%]" key={question}>
							<h3 className="text-[clamp(12px,3.5vw,22px)] font-bold leading-tight">
								{question}
							</h3>
							<p className="pl-[4%] text-[clamp(10px,2.8vw,17px)] leading-snug">
								{answer}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default function FAQ() {
	return (
		<section className="flex w-full items-center justify-center" id="FAQ">
			<div className="flex w-full max-w-[1600px] flex-col items-center justify-center gap-8 [container-type:inline-size]">
				{/* ===== Desktop & Tablet ===== */}
				<div className="hidden w-full max-w-[1400px] flex-row items-center justify-center md:flex">
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
						<div className="relative flex w-[40cqw] flex-col gap-y-[0.5cqw] px-[10%] pb-[30%] pt-[20%]">
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
					<div className="relative flex w-[85cqw] flex-col gap-y-[0.5cqw] px-[10%] pb-[30%] pt-[20%]">
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
