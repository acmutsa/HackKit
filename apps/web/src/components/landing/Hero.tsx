'use client'

import { Manuale, Shadows_Into_Light } from "next/font/google"
import { motion } from "motion/react";

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

export default function Hero() {
	return (
		<>
			<section className="w-full overflow-hidden relative pb-[30vw] sm:pb-[0]">
				<div className="absolute w-full sm:w-[85%] md:w-[75%] lg:w-[70%] sm:left-4 md:left-5 lg:left-10 relative drop-shadow-[6px_8px_3px_rgba(0,0,0,0.45)]">
					<img
						src="img/assets/hero/hero.png"
						alt=""
						className="w-full h-auto"
					/>

					{/* top-secret: animated pop-in (moved from commented code) */}
					<div className="absolute rotate-12 top-[60%] right-[8%] w-[25%] #AC1903">
						<motion.img
							src="img/assets/hero/top-secret.svg"
							alt=""
							className="w-full h-auto"
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

					<div className="absolute w-[17.5%] top-[21%] left-[37.5%] #AC1903">
						<img
							src="img/assets/hero/marker-circle3.svg"
							alt=""
							className="w-full h-auto"
						/>
					</div>
					<div className="absolute right-[15%] top-[11%] w-[45%] drop-shadow-[6px_8px_3px_rgba(0,0,0,0.45)]">
						<img
							src="img/assets/hero/logo-background.png"
							alt=""
							className="w-full h-auto"
						/>
					</div>
					<div className="absolute w-[20%] right-[27%] top-[24%]">
						<img
							src="img/assets/hero/rh-logo.svg"
							alt=""
							className="w-full h-auto" />
					</div>

					{/* Heist / starts at 9:00: per-character fade-up (moved from commented code) */}
					<div className={`${shadows.className} absolute w-[15%] top-[30.5%] left-[34%] rotate-[12deg]`}>
						<p className="text-[#AC1903] text-center font-extrabold text-small sm:text-base md:text-lg lg:text-xl xl:text-3xl 2xl:text-4xl">
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
						<p className="text-[#AC1903] text-center font-extrabold text-small sm:text-base md:text-lg lg:text-xl xl:text-3xl 2xl:text-4xl">
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

				<div className="absolute w-[30%] sm:w-[12.5%] lg:w-[17.5%] left-[36%] top-[74.5%] sm:top-[70%] sm:left-[83%] lg:top-[35%] lg:left-[77.5%]">
					<img
						src="/img/assets/hero/register/blank-tape-stickers3.png"
						alt=""
						className="w-full h-auto drop-shadow-[6px_8px_3px_rgba(0,0,0,0.45)]"
					/>
					<h1 className={`absolute top-[15%] left-[14%] -rotate-[5deg] text-[4.5vw] sm:text-[1.5vw] lg:text-[2.75vw] lg:top[20%] lg:left-[15%] font-medium ${shadows.className}`}>Help Wanted</h1>
				</div>
				<div className="absolute hover:scale-110 w-[35%] sm:w-[18%] lg:w-[25%] top-[68%] left-[1%] sm:left-[82%] sm:top-[43%] md:left-[80%] lg:left-[75%] rotate-3 sm:-rotate-3">
					<img
						src="/img/assets/hero/register/blank-tape-stickers2.png"
						alt=""
						className="w-full h-auto drop-shadow-[6px_8px_3px_rgba(0,0,0,0.45)]"
					/>
					<h1 className={`absolute top-[20%] right-[30%] sm:top-[18%] lg:right-[30%] sm:right-[25%] text-red-800 text-[4.5vw] sm:text-[2.5vw] lg:text-[3.5vw] font-extrabold ${shadows.className}`}>Register</h1>
				</div>
				<div className="absolute hover:scale-110 w-[25%] left-[22%] top-[83%] sm:w-[12.5%] sm:left-[82%] sm:top-[50%] lg:top-[55%] lg:left-[72.5%] lg:w-[17.5%]">
					<img
						src="/img/assets/hero/register/blank-tape-stickers1.png"
						alt=""
						className="w-full h-auto drop-shadow-[6px_8px_3px_rgba(0,0,0,0.45)]"
					/>
					<h1 className={`absolute top-[20%] left-[32.5%] text-[2.75vw] sm:text-[1.75vw] sm:top-[10%] sm:left-[25%] font-medium lg:text-[2.75vw] lg:top-[12.5%] ${shadows.className}`}>Mentors</h1>
				</div>
				<div className="absolute hover:scale-110 w-[25%] left-[54.5%] top-[83%] sm:w-[12.5%] sm:left-[87%] sm:top-[55%] lg:top-[63%] lg:left-[80%] lg:w-[17.5%]">
					<img
						src="/img/assets/hero/register/blank-tape-stickers1.png"
						alt=""
						className="w-full h-auto drop-shadow-[6px_8px_3px_rgba(0,0,0,0.45)]"
					/>
					<h1 className={`absolute top-[20%] left-[32.5%] text-[2.75vw] sm:text-[1.75vw] sm:top-[10%] sm:left-[27.5%] font-medium lg:text-[2.75vw] lg:left-[30%] lg:top-[12.5%] ${shadows.className}`}>Judges</h1>
				</div>
				<div className="absolute hover:scale-110 w-[25%] left-[37%] top-[90%] sm:w-[12.5%] sm:left-[82%] sm:top-[60%] lg:top-[72%] lg:left-[72.5%] lg:w-[17.5%]">
					<img
						src="/img/assets/hero/register/blank-tape-stickers1.png"
						alt=""
						className="w-full h-auto drop-shadow-[6px_8px_3px_rgba(0,0,0,0.45)]"
					/>
					<h1 className={`absolute top-[20%] left-[27.5%] text-[2.75vw] sm:text-[1.75vw] sm:top-[10%] sm:left-[17.5%] font-medium lg:text-[2.75vw] lg:top-[12.5%] lg:left-[20%] ${shadows.className}`}>Volunteers</h1>
				</div>
			</section>
		</>
	);
}