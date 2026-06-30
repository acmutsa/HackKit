"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Shadows_Into_Light } from "next/font/google";
import { Person } from "./Person";
import teamData from "./team.json";
import Link from "next/link";
import { Linkedin } from "lucide-react";
import { motion } from "motion/react";
import Pin from "./Pin";

const people: Person[] = teamData.team;

const shadowsIntoLight = Shadows_Into_Light({
	weight: "400",
	subsets: ["latin"],
	variable: "--font-shadows",
});

function srcFor(p: Person) {
	return p.imgLink && p.imgLink.length > 0 ? p.imgLink : `/${p.fname}.png`;
}

// Polaroid signature:
function Polaroid({
	person,
	slotIndex,
}: {
	person: Person;
	slotIndex: number;
}) {
	const [front, setFront] = useState(person);
	const [back, setBack] = useState(person);
	const [showFront, setShowFront] = useState(true);
	const [roration] = useState(() => Math.random() * 10 - 3);

	useEffect(() => {
		if (showFront && person !== front) {
			setBack(person);
			setShowFront(false);
		} else if (!showFront && person !== back) {
			setFront(person);
			setShowFront(true);
		}
	}, [person, front, back, showFront]);

	return (
		<div
			className="z-40 h-auto w-[40vw] rounded-[3px] bg-[#F0EDE7] px-[5%] pb-[15%] pt-[12%] shadow-[0_7px_10px_rgba(0,0,0,0.28)] drop-shadow-[2px_5px_1px_rgba(0,0,0,0.45)] sm:w-[25vw] sm:pb-[18%] md:w-[15vw] md:w-[21vw] md:pb-[20%] lg:w-[16vw] lg:pb-[23%] xl:w-[16vw] xl:pb-[22%]"
			style={{ transform: `rotate(${roration}deg)` }}
		>
			<Pin className="absolute left-[50%] top-[1%] z-30" />
			{/* photo */}
			<div className="relative h-auto w-full overflow-hidden">
				<img
					src={srcFor(front)}
					alt={`${front.fname} ${front.lname}`}
					style={{ transition: "opacity 2000ms ease-in-out" }}
					className={`h-full w-full object-cover ${showFront ? "opacity-100" : "opacity-0"}`}
				/>
				<img
					src={srcFor(back)}
					alt=""
					style={{ transition: "opacity 2000ms ease-in-out" }}
					className={`absolute inset-0 h-full w-full object-cover ${showFront ? "opacity-0" : "opacity-100"}`}
				/>
			</div>

			{/* name + linkedin in a row */}
			<div className="relative flex h-auto w-[100%] items-center justify-center gap-2 px-[5%] pb-[10%] pt-[5%] leading-none">
				{/* name crossfade */}
				<div className="relative h-fit w-[100%]">
					<p
						style={{ transition: "opacity 2000ms ease-in-out" }}
						className={`h-auto w-[100%] sm:text-base md:text-lg lg:text-xl xl:text-3xl 2xl:text-4xl ${shadowsIntoLight.className} ${showFront ? "opacity-100" : "opacity-0"}`}
					>
						{front.fname} {front.lname}
					</p>
					<p
						style={{ transition: "opacity 2000ms ease-in-out" }}
						className={`absolute inset-0 h-auto w-[100%] sm:text-base md:text-lg lg:text-xl xl:text-3xl 2xl:text-4xl ${shadowsIntoLight.className} ${showFront ? "opacity-0" : "opacity-100"}`}
					>
						{back.fname} {back.lname}
					</p>
				</div>

				{/* icon crossfade — its own relative box keeps it in the row */}
				<div className="relative h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-8 lg:w-8 xl:h-10 xl:w-10">
					{front.linkedin && (
						<Link
							href={front.linkedin}
							className={`absolute inset-0 ${showFront ? "" : "pointer-events-none"}`}
							tabIndex={showFront ? 0 : -1}
							aria-hidden={!showFront}
						>
							<Linkedin
								style={{
									transition: "opacity 2000ms ease-in-out",
								}}
								className={`h-4 w-4 p-[15%] sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-8 lg:w-8 xl:h-10 xl:w-10 ${showFront ? "opacity-100" : "opacity-0"}`}
							/>
						</Link>
					)}
					{back.linkedin && (
						<Link
							href={back.linkedin}
							className={`absolute inset-0 ${showFront ? "pointer-events-none" : ""}`}
							tabIndex={showFront ? -1 : 0}
							aria-hidden={showFront}
						>
							<Linkedin
								style={{
									transition: "opacity 2000ms ease-in-out",
								}}
								className={`h-4 w-4 p-[15%] sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-8 lg:w-8 xl:h-10 xl:w-10 ${showFront ? "opacity-0" : "opacity-100"}`}
							/>
						</Link>
					)}
				</div>
			</div>

			{(() => {
				const active = showFront ? front : back;
				if (!active.note) return null;
				return (
					<div
						className="absolute rotate-[-10deg]"
						style={{ top: active.top, left: active.left }}
					>
						<p
							key={`${slotIndex}-${active.note}`} // remount → re-animate whenever the note changes
							className={`w-full text-xl text-[#AC1903] sm:text-xl md:text-2xl lg:text-3xl xl:text-5xl ${shadowsIntoLight.className}`}
						>
							{active.note.split("").map((char, i) => (
								<motion.span
									key={`note-${i}`}
									initial={{ opacity: 0, y: 6 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{
										delay: 2 + i * 0.05,
										duration: 1,
									}}
									viewport={{ once: false, amount: 0.95 }}
									className="inline-block"
								>
									{char === " " ? "\u00A0" : char}
								</motion.span>
							))}
						</p>
					</div>
				);
			})()}
		</div>
	);
}

function DossierPins() {
	return (
		<>
			<Pin className="absolute left-[93%] top-[28%] z-30" />
			<Pin className="absolute left-[50%] top-[-15%] z-30 sm:top-[-30%] md:top-[-60%]" />
			<Pin className="absolute left-[3%] top-[23%] z-30" />
		</>
	);
}

export default function WorkWithUs() {
	const [index, setIndex] = useState(0);
	const len = people.length || 1;

	const [step, setStep] = useState(3);

	useEffect(() => {
		const lg = window.matchMedia("(min-width: 1024px)"); // lg
		const md = window.matchMedia("(min-width: 768px)"); // md
		const sm = window.matchMedia("(min-width: 640px)"); // sm

		const update = () => {
			if (lg.matches) setStep(5);
			else if (md.matches) setStep(4);
			else if (sm.matches) setStep(3);
			else setStep(2);
		};

		update();
		lg.addEventListener("change", update);
		md.addEventListener("change", update);
		sm.addEventListener("change", update);
		return () => {
			lg.removeEventListener("change", update);
			md.removeEventListener("change", update);
			sm.removeEventListener("change", update);
		};
	}, []);

	const move = (delta: number) => setIndex((i) => (i + delta + len) % len);
	const slots = [0, 1, 2, 3, 4];

	return (
		<section
			className="relative flex w-full items-center justify-center pb-[12vw] sm:pb-[3vw] md:pb-[5vw]"
			id="WorkWithUs"
		>
			<div className="w-full px-[3vw]">
				<div className="relative flex flex-col items-center justify-center gap-y-6 pb-[3%] pl-[20%] sm:pb-[8%]">
					<div
						className={`relative z-40 h-fit w-[48vw] bg-contain bg-center bg-no-repeat sm:w-[38vw] ${shadowsIntoLight.className} rotate-[13deg] drop-shadow-[2px_5px_1px_rgba(0,0,0,0.45)]`}
						style={{
							backgroundImage:
								"url('/img/sponsors/sponsors-header-background.svg')",
						}}
					>
						<DossierPins />
						<p className="font-shadows p-6 text-center text-black sm:text-lg md:text-xl lg:text-2xl xl:text-4xl 2xl:text-5xl">
							Main Suspects
						</p>
					</div>
				</div>

				{/* carousel row */}
				<div className="flex items-center justify-center gap-[3vw] md:gap-[1.6vw]">
					<button
						type="button"
						onClick={() => move(-step)}
						className={`${shadowsIntoLight.className} text-[7vw] transition-transform hover:scale-110 active:scale-95`}
					>
						{"\u2039"}
					</button>

					{slots.map((slot) => {
						const person_id = (index + slot) % len;
						const person = people[person_id];
						const visibility =
							slot < 2
								? "flex"
								: slot === 2
									? "hidden sm:flex"
									: slot === 3
										? "hidden md:flex"
										: "hidden lg:flex";
						return (
							<div key={slot} className={visibility}>
								<Polaroid
									person={person}
									slotIndex={person_id}
								/>
							</div>
						);
					})}

					<button
						type="button"
						onClick={() => move(step)}
						className={`${shadowsIntoLight.className} text-[7vw] transition-transform hover:scale-110 active:scale-95`}
					>
						{"\u203A"}
					</button>
				</div>
			</div>
		</section>
	);
}
