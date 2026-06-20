"use client";

import { Manuale } from "next/font/google";
import Pin from "./Pin";

const manuale = Manuale({
	subsets: ["latin"],
	display: "swap",
});

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
		<section
			id="FAQ"
			className={`flex w-full justify-center py-10 ${manuale.className}`}
		>
			<div className="flex w-full max-w-[1240px] flex-col items-center gap-0 lg:flex-row lg:items-start lg:justify-center lg:gap-4">
				<FAQSheet items={questions.slice(0, 4)} />
				<div className="-mt-[18vw] lg:mt-10">
					<FAQSheet items={questions.slice(4)} classified />
				</div>
			</div>
		</section>
	);
}
