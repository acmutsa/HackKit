"use client";

import { Manuale, Shadows_Into_Light } from "next/font/google";
import { motion } from "motion/react";
import Pin from "@/components/landing/Pin";
import Link from "next/link";
const line1 = "Heist";
const line2 = "starts at 9:00";

const shadows = Shadows_Into_Light({
	subsets: ["latin"],
	variable: "--font-shadows",
	weight: "400",
});
const manuale = Manuale({
	subsets: ["latin"],
	weight: "500",
});

function DossierPins() {
	return (
		<>
			<Pin className="absolute left-[12%] top-[15%] z-40 sm:left-[74%] sm:top-[28%] md:left-[67%] md:top-[30%] lg:left-[83%] lg:top-[36%]" />
			<Pin className="absolute left-[55%] top-[18%] z-40 sm:left-[49%] sm:top-[21%] md:left-[44%] md:top-[21%] lg:left-[42%] lg:top-[20%]" />
			<Pin className="absolute left-[88%] top-[28%] z-40 sm:left-[12%] sm:top-[15%] md:left-[7%] md:top-[15%]" />
			<Pin className="absolute left-[94%] top-[54%] z-40 sm:left-[5%] sm:top-[45%]" />
			<Pin className="absolute left-[47%] top-[74%] z-40 sm:left-[14%] sm:top-[85%]" />
			<Pin className="absolute left-[8%] top-[81%] z-40 block sm:hidden" />
		</>
	);
}

export default function Hero() {
	return (
		<>
			<section className="relative w-full pb-[30cqw] pt-[15%] sm:pb-[3cqw] sm:pt-[3%] md:pb-[5cqw] [container-type:inline-size]" id="Hero">
				<DossierPins />

				<div className="relative w-full drop-shadow-[6px_8px_3px_rgba(0,0,0,0.45)] sm:left-4 sm:w-[85%] md:left-5 md:w-[75%] lg:left-10 lg:w-[70%]">
					<img
						src="img/assets/hero/hero.webp"
						alt=""
						className="h-auto w-full"
					/>

					{/* top-secret: animated pop-in (moved from commented code) */}
					<div className="#AC1903 absolute right-[8%] top-[60%] w-[25%] rotate-12">
						<motion.img
							src="img/assets/hero/top-secret.svg"
							alt=""
							className="h-auto w-full"
							initial={{ scale: 0, y: -40, opacity: 0 }}
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
							viewport={{ once: false, amount: 0.5 }}
						/>
					</div>

					<div className="#AC1903 absolute left-[37.5%] top-[21%] w-[17.5%]">
						<img
							src="img/assets/hero/marker-circle3.svg"
							alt=""
							className="h-auto w-full"
						/>
					</div>
					<div className="absolute right-[15%] top-[11%] w-[45%] drop-shadow-[6px_8px_3px_rgba(0,0,0,0.45)]">
						<img
							src="img/assets/hero/logo-background.webp"
							alt=""
							className="h-auto w-full"
						/>
					</div>
					<div className="absolute right-[27%] top-[24%] w-[20%]">
						<img
							src="img/assets/logo_stamp.webp"
							alt=""
							className="h-auto w-full"
						/>
					</div>

					{/* Heist / starts at 9:00: per-character fade-up (moved from commented code) */}
					<div
						className={`${shadows.className} absolute left-[34%] top-[30.5%] w-[15%] rotate-[12deg]`}
					>
						<p className="text-small text-center font-extrabold text-[#AC1903] sm:text-base md:text-lg lg:text-xl xl:text-3xl 2xl:text-4xl">
							{line1.split("").map((char, i) => (
								<motion.span
									key={`l1-${i}`}
									initial={{ opacity: 0, y: 6 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ delay: i * 0.05 }}
									viewport={{ once: false, amount: 0.95 }}
								>
									{char}
								</motion.span>
							))}
						</p>
						<p className="text-small text-center font-extrabold text-[#AC1903] sm:text-base md:text-lg lg:text-xl xl:text-3xl 2xl:text-4xl">
							{line2.split("").map((char, i) => (
								<motion.span
									key={`l2-${i}`}
									initial={{ opacity: 0, y: 6 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.7 + i * 0.05 }}
									viewport={{ once: false, amount: 0.95 }}
								>
									{char}
								</motion.span>
							))}
						</p>
					</div>
				</div>

				<div className="absolute left-[36%] top-[74.5%] w-[30%] sm:left-[83%] sm:top-[70%] sm:w-[12.5%] lg:left-[77.5%]  md:top-[35%] lg:top-[35%] lg:w-[17.5%]">
					<img
						src="/img/assets/hero/register/blank-tape-stickers3.webp"
						alt=""
						className="h-auto w-full drop-shadow-[6px_8px_3px_rgba(0,0,0,0.45)]"
					/>
					<h1
						className={`lg:top[20%] absolute left-[14%] top-[15%] -rotate-[5deg] text-[4.5cqw] font-medium sm:text-[1.5cqw] lg:left-[15%] lg:text-[2.75cqw] ${shadows.className}`}
					>
						Help Wanted
					</h1>
				</div>
				<div className="absolute left-[1%] top-[68%] w-[35%] rotate-3 hover:scale-110 sm:left-[82%] sm:top-[43%] sm:w-[18%] sm:-rotate-3 md:left-[80%] lg:left-[75%] lg:w-[25%]">
					<Link href="/">
					<img
						src="/img/assets/buttons/blank-tape-stickers2.webp"
						alt=""
						className="h-auto w-full drop-shadow-[6px_8px_3px_rgba(0,0,0,0.45)]"
					/>
					<h1
						className={`absolute right-[30%] top-[20%] text-[4.5cqw] font-extrabold text-red-800 sm:right-[25%] sm:top-[18%] sm:text-[2.5cqw] lg:right-[30%] lg:text-[3.5cqw] ${shadows.className}`}
					>
						Register
					</h1>
					</Link>
				</div>
				<div className="absolute left-[22%] top-[83%] w-[25%] hover:scale-110 sm:left-[82%] sm:top-[50%] sm:w-[12.5%] lg:left-[72.5%] lg:top-[55%] lg:w-[17.5%]">
					<Link href="https://tally.so/r/2EZQ2M">
						<img
							src="/img/assets/buttons/blank-tape-stickers1.webp"
							alt=""
							className="h-auto w-full drop-shadow-[6px_8px_3px_rgba(0,0,0,0.45)]"
						/>
						<h1
							className={`absolute left-[32.5%] top-[20%] text-[2.75vw] font-medium sm:left-[25%] sm:top-[10%] sm:text-[1.75vw] lg:top-[12.5%] lg:text-[2.75vw] ${shadows.className}`}
						>
							Mentors
						</h1>
					</Link>
				</div>
				<div className="absolute left-[54.5%] top-[83%] w-[25%] hover:scale-110 sm:left-[87%] sm:top-[55%] sm:w-[12.5%] lg:left-[80%] lg:top-[63%] lg:w-[17.5%]">
					<Link href="https://tally.so/r/44do5k">
						<img
							src="/img/assets/buttons/blank-tape-stickers1.webp"
							alt=""
							className="h-auto w-full drop-shadow-[6px_8px_3px_rgba(0,0,0,0.45)]"
						/>
						<h1
							className={`absolute left-[32.5%] top-[20%] text-[2.75vw] font-medium sm:left-[27.5%] sm:top-[10%] sm:text-[1.75vw] lg:left-[30%] lg:top-[12.5%] lg:text-[2.75vw] ${shadows.className}`}
						>
							Judges
						</h1>
					</Link>
				</div>
				<div className="absolute left-[37%] top-[90%] w-[25%] hover:scale-110 sm:left-[82%] sm:top-[60%] sm:w-[12.5%] lg:left-[72.5%] lg:top-[72%] lg:w-[17.5%]">
					<Link href="https://tally.so/r/lbge2X">
					<img
						src="/img/assets/buttons/blank-tape-stickers1.webp"
						alt=""
						className="h-auto w-full drop-shadow-[6px_8px_3px_rgba(0,0,0,0.45)]"
					/>
					<h1
						className={`absolute left-[27.5%] top-[20%] text-[2.75cqw] font-medium sm:left-[17.5%] sm:top-[10%] sm:text-[1.75cqw] lg:left-[20%] lg:top-[12.5%] lg:text-[2.75cqw] ${shadows.className}`}
					>
						Volunteers
					</h1>
					</Link>
				</div>
			</section>
		</>
	);
}
