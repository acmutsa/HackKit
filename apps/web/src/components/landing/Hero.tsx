'use client'
import Image from "next/image";
import Link from "next/link";
import { Button } from "../shadcn/ui/button";
import { Manuale, Shadows_Into_Light } from "next/font/google"
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

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
				<div className="absolute w-full sm:w-[85%] md:w-[80%] lg:w-[75%] sm:left-4 md:left-8 lg:left-12 relative">
					<img
						src="img/assets/logo-background.svg"
						alt=""
						className="w-full h-auto"
					/>
					<div className="absolute rotate-12 right-[3.2rem] bottom-[6.4rem] sm:right-[4.2rem] sm:bottom-[8.25rem] md:right-[5rem] md:bottom-[10rem] lg:right-[7.3rem] lg:bottom-[13.8rem] w-[25%]">
					<motion.img
							src="img/assets/top-secret.svg"
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
					<div className="absolute right-[23%] top-[13.5%] w-[50%] lg:right-[21%] lg:top-[13%]">
						<img
							src="img/assets/logo-background-paper.svg"
							alt=""
							className="w-full h-auto"
						/>
					</div>
					<div className="absolute w-[20%] top-[28%] right-[37.5%] lg:top-[28%] lg:right-[36%]">
						<img
							src="img/assets/rh-city-logo-black.svg"
							alt=""
							className="w-full h-auto" />
					</div>
					<div className="absolute w-[17.5%] top-[35%] left-[7.5%]">
						<img
							src="img/assets/marker-circle3.svg"
							alt=""
							className="w-full h-auto"
						/>
					</div>
					<div className="absolute w-[42.5%] top-[23%] left-[7.75%] -rotate-[5deg] sm:w-[32.5%] sm:top-[25.25%] sm:left-[46.5%] sm:rotate-[9.5deg]">
						<img
							src="img/assets/red-thread.svg"
							alt=""
							className="w-full h-auto"
						/>
					</div>
					<div className="absolute w-[40%] top-[26%] left-[50%] rotate-[13deg] sm:w-[36.5%] sm:left-[10.5%] sm:top-[23.5%] sm:-rotate-[4deg]">
						<img
							src="img/assets/red-thread.svg"
							alt=""
							className="w-full h-auto"
						/>
					</div>
					<div className="absolute w-[55%] top-[57.5%] left-[63.5%] rotate-[84.5deg] sm:w-[23.5%] sm:top-[36%] sm:left-[-3%] sm:rotate-[102.5deg]">
						<img
							src="img/assets/red-thread.svg"
							alt=""
							className="w-full h-auto"
						/>
					</div>
					<div className="absolute w-[84%] top-[93.5%] left-[11.75%] rotate-[165deg] z-10 sm:w-[27.5%] sm:top-[61%] sm:left-[-5%] sm:-rotate-[100.5deg]">
						<img
							src="img/assets/red-thread.svg"
							alt=""
							className="w-full h-auto"
						/>
					</div>
					<div className="absolute w-[3.5%] top-[25%] left-[5.5%] z-[15] sm:top-[28%] sm:left-[77.5%] sm:w-[2.5%]">
						<img
							src="img/assets/silver-pin.svg"
							alt=""
							className="w-full h-auto"
						/>
					</div>
					<div className="absolute w-[3.5%] top-[21.25%] right-[47.5%] z-[15] sm:right-[52%] sm:top-[22.5%] sm:w-[2.5%]">
						<img
							src="img/assets/silver-pin.svg"
							alt=""
							className="w-full h-auto"
						/>
					</div>
					<div className="absolute w-[3.5%] top-[30%] right-[10%] z-[15] sm:left-[9.75%] sm:top-[24.75%] sm:w-[2.5%]">
						<img
							src="img/assets/silver-pin.svg"
							alt=""
							className="w-full h-auto"
						/>
					</div>
					<div className="absolute w-[3.5%] bottom-[12.5%] right-[5%] z-[15] sm:top-[47.5%] sm:left-[5%] sm:w-[2.5%]">
						<img
							src="img/assets/silver-pin.svg"
							alt=""
							className="w-full h-auto"
						/>
					</div>
					<div className={`${shadows.className} absolute w-[15%] top-[32.5%] left-[15%] rotate-[12deg] sm:top-[31%] font-semibold`}>
					<p className="text-red-800 text-center text-[1.75vw]">
							{line1.split("").map((char, i) => (
								<motion.span
									key={`l1-${i}`}
									initial={{ opacity: 0, y: 6 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{
										delay: i * 0.05,
									}}
									viewport={{ once: false, amount: 0.95 }}


								>
									{char}
								</motion.span>
							))}
						</p>

						<p className="text-red-800 text-center text-[1.75vw]">
							{line2.split("").map((char, i) => (
								<motion.span
									key={`l2-${i}`}
									initial={{ opacity: 0, y: 6 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{
										delay: i * 0.05
									}}
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
						src="/img/assets/blank-tape-stickers3.svg"
						alt=""
						className="w-full h-auto"
					/>
					<h1 className={`absolute top-[15%] left-[14%] -rotate-[5deg] text-[4.5vw] sm:text-[1.5vw] lg:text-[2.75vw] lg:top[20%] lg:left-[15%] font-medium ${shadows.className}`}>Help Wanted</h1>
					<div className="absolute hidden sm:block sm:w-[10%] sm:top-[7.5%] sm:right-[49%] ">
						<img
							src="/img/assets/silver-pin.svg"
							alt=""
							className="w-full h-auto"
						/>
					</div>
				</div>
				<div className="absolute hover:scale-110 w-[35%] sm:w-[18%] lg:w-[25%] top-[68%] left-[1%] sm:left-[82%] sm:top-[43%] md:left-[80%] lg:left-[75%] rotate-3 sm:-rotate-3">
					<img
						src="/img/assets/blank-tape-stickers1.svg"
						alt=""
						className="w-full h-auto"
					/>
					<h1 className={`absolute top-[20%] right-[30%] sm:top-[18%] lg:right-[30%] sm:right-[25%] text-red-800 text-[4.5vw] sm:text-[2.5vw] lg:text-[3.5vw] font-extrabold ${shadows.className}`}>Register</h1>
				</div>
				<div className="absolute hover:scale-110 w-[25%] left-[22%] top-[83%] sm:w-[12.5%] sm:left-[82%] sm:top-[50%] lg:top-[55%] lg:left-[72.5%] lg:w-[17.5%]">
					<img
						src="/img/assets/blank-tape-stickers1.svg"
						alt=""
						className="w-full h-auto"
					/>
					<h1 className={`absolute top-[20%] left-[32.5%] text-[2.75vw] sm:text-[1.75vw] sm:top-[10%] sm:left-[25%] font-medium lg:text-[2.75vw] lg:top-[12.5%] ${shadows.className}`}>Mentors</h1>
				</div>
				<div className="absolute hover:scale-110 w-[25%] left-[54.5%] top-[83%] sm:w-[12.5%] sm:left-[87%] sm:top-[55%] lg:top-[63%] lg:left-[80%] lg:w-[17.5%]">
					<img
						src="/img/assets/blank-tape-stickers1.svg"
						alt=""
						className="w-full h-auto"
					/>
					<h1 className={`absolute top-[20%] left-[32.5%] text-[2.75vw] sm:text-[1.75vw] sm:top-[10%] sm:left-[27.5%] font-medium lg:text-[2.75vw] lg:left-[30%] lg:top-[12.5%] ${shadows.className}`}>Judges</h1>
				</div>
				<div className="absolute hover:scale-110 w-[25%] left-[37%] top-[90%] sm:w-[12.5%] sm:left-[82%] sm:top-[60%] lg:top-[72%] lg:left-[72.5%] lg:w-[17.5%]">
					<img
						src="/img/assets/blank-tape-stickers1.svg"
						alt=""
						className="w-full h-auto"
					/>
					<h1 className={`absolute top-[20%] left-[27.5%] text-[2.75vw] sm:text-[1.75vw] sm:top-[10%] sm:left-[17.5%] font-medium lg:text-[2.75vw] lg:top-[12.5%] lg:left-[20%] ${shadows.className}`}>Volunteers</h1>
				</div>
				<div className="absolute w-[3.5%] bottom-[16.5%] left-[12.5%] z-[15] sm:bottom-[22.5%] sm: left-[11.5%] sm:w-[2%]">
					<img
						src="img/assets/silver-pin.svg"
						alt=""
						className="w-full h-auto"
					/>
				</div>
			</section>
			{/* <div className="flex w-full flex-wrap items-center justify-center gap-x-2 gap-y-4">
				<Link href={"https://github.com/acmutsa/hackkit"}>
					<Button variant={"outline"} size={"lg"}>
						GitHub
					</Button>
				</Link>
				<Link href={"https://github.com/acmutsa/hackkit"}>
					<Button variant={"outline"} size={"lg"}>
						Docs
					</Button>
				</Link>
				<Link href={"https://github.com/acmutsa/hackkit"}>
					<Button variant={"outline"} size={"lg"}>
						Channel Log
					</Button>
				</Link>
				<div className="h-0 basis-full" />
				<div className="max-h-[50px] overflow-hidden"></div>
			</div> */}
		</>
	);
}
