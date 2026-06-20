"use client";
import Balancer from "react-wrap-balancer";
import Image from "next/image";
import D1 from "../../../public/img/landing/d1.svg";
import D2 from "../../../public/img/landing/d2.svg";
import D3 from "../../../public/img/landing/d3.svg";
import D4 from "../../../public/img/landing/d4.svg";
import Dino_Coding from "../../../public/img/landing/dinos_coding.png";
import { Manuale, Shadows_Into_Light } from "next/font/google";
import { motion } from "motion/react";
import Pin from "./Pin";

const manuale = Manuale({
	subsets: ["latin"],
	display: "swap",
});
const shadow = Shadows_Into_Light({
	subsets: ["latin"],
	weight: "400",
});

function DossierPins() {
	return (
		<>
			<Pin size={14} className="absolute left-[14%] top-[8%] z-30" />
			<Pin size={14} className="absolute right-[18%] top-[9%] z-30" />
			<Pin size={14} className="absolute right-[7%] top-[49%] z-30" />
			<Pin size={14} className="absolute bottom-[9%] right-[10%] z-30" />
		</>
	);
}

export default function About() {
	const d1_stylesheet = {
		width: "25rem",
		height: "auto",
		sm: "width: 30rem",
	};
	return (
		<section
			className="flex w-full items-center justify-center overflow-visible"
			id="About"
		>
			<div className="flex w-full max-w-[1000px] flex-col items-center justify-center">
				<div className="duration-400 relative flex w-full max-w-[1600px] flex-col items-center justify-center transition delay-150 ease-in-out [container-type:inline-size] hover:rotate-[3deg] hover:scale-110 lg:hidden xl:hidden">
					<img
						src="/img/assets/about-background 2.png"
						className="absolute -top-[15%] w-[115%] object-contain"
					/>
					<img
						src="/img/assets/about-background.png"
						className="absolute right-[2%] h-full w-full rotate-[8deg] object-contain"
					/>
					<img
						src="/img/assets/about.png"
						alt="RowdyHacks XII About Us Section"
						className="relative z-20 h-full w-full pl-[8cqw]"
					/>
					<DossierPins />

					{/* <div className="absolute top-[15%] flex flex-row w-full items-left justify-left gap-[0.6cqw] pl-[22.5cqw] pt-[1.8cqw] -rotate-[5deg]">
						<img src="/img/assets/acm-logo-black.svg" alt="ACM Logo" className="w-[6.6cqw]" />
						<img src="/img/assets/UTSA-logo-black.svg" alt="UTSA Logo" className="w-[6.6cqw] -scale-x-100" />
					</div>
					<div className="absolute top-[15%] flex flex-row w-full items-left justify-center pt-[2.6cqw] -rotate-[5deg]">
						<h3 className={`pt-[0.6cqw] font-semibold ml-[cqw] text-[2cqw] ${manuale.className}`}>Fall 2016 - Present Day</h3>
					</div> */}
					<div className="absolute left-[10%] top-[35%] z-20 m-[4cqw] flex w-[80%] -rotate-[5deg] flex-col items-center gap-[0.6cqw] pt-[4.5cqw]">
						<div className="relative overflow-visible">
							<h2
								className={`mr-[3.3cqw] pr-[4.6cqw] text-[3.5cqw] font-bold leading-tight ${manuale.className}`}
							>
								What is RowdyHacks?
							</h2>

							{/* Circle */}
							<motion.svg
								className="absolute left-[55%] top-1/2 w-[50cqw] -translate-x-[70%] -translate-y-1/2 -rotate-[2deg]"
								viewBox="0 0 500 100"
								fill="none"
							>
								{[0, 1, 2, 3].map((i) => {
									const baseLeft = 90 - i * 2;
									const baseRight = 480 + i * 2;

									// shared distortion values
									const wobbleX = i % 2 === 0 ? -10 : 8;
									const wobbleYTop = i % 2 === 0 ? -6 : 6;
									const wobbleYBottom = i % 2 === 0 ? 8 : -6;

									return (
										<motion.path
											key={i}
											d={`M${baseLeft + wobbleX},52
													C${baseLeft},${10 + wobbleYTop} ${baseRight},${10 - wobbleYTop} ${baseRight - wobbleX},48
													C${baseRight},${90 + wobbleYBottom} ${baseLeft},${90 - wobbleYBottom} ${baseLeft + wobbleX},52`}
											stroke="#991b1b"
											strokeWidth={2 + i * 0.4}
											strokeLinecap="round"
											fill="none"
											animate={{
												pathLength: [0, 1, 1, 0],
												opacity: [0, 1, 1, 0],
											}}
											transition={{
												duration: 6,
												times: [0, 0.15, 0.8, 1],
												delay: i * 0.05,
												repeat: Infinity,
												repeatDelay: 2,
												ease: "easeInOut",
											}}
										/>
									);
								})}
							</motion.svg>
						</div>
						<p
							className={`-ml-[2.6cqw] w-[55%] pr-[4.6cqw] text-center text-[3.0cqw] font-light leading-tight ${manuale.className}`}
						>
							RowdyHacks is UTSA's annual hackathon, hosted by the
							Association for Computing Machinery (ACM) at UTSA.
							<br />
							It's a weekend-long event where students, tech
							enthusiasts, and creative minds from all backgrounds
							come together to collaborate, innovate, and build
							real-world projects in 24 hours.
						</p>
						<div className="duration-400 absolute left-[50%] top-[110%] flex w-[40%] -rotate-[15deg] items-center justify-center decoration-2 transition delay-150 ease-in-out hover:scale-110 hover:underline">
							<img
								src="/img/assets/blank-tape-stickers1.svg"
								alt=""
								className="w-full"
							/>
							<a
								href="https://acmutsa.org/"
								className={`absolute ${shadow.className} text-[4.0cqw] text-red-800`}
							>
								What is ACM?
							</a>
						</div>
					</div>
				</div>

				{/* Desktop Version (Visible on screens > 1024px) */}
				<div className="relative right-[25%] hidden w-full overflow-visible lg:flex">
					<div className="relative z-10 flex w-full -rotate-[5deg] flex-col items-center justify-center [container-type:inline-size]">
						<img
							src="/img/assets/about-background 2.png"
							className="absolute -top-[15%] w-[90%] object-contain"
						/>
						<img
							src="/img/assets/about-background.png"
							className="absolute right-[2%] h-full w-full rotate-[8deg] object-contain"
						/>
						<img
							src="/img/assets/about.png"
							alt="RowdyHacks XII About Us Section"
							className="z-15 relative h-auto w-[80%] pl-[8cqw]"
						/>
						<DossierPins />

						{/* <div className="absolute top-[15%] flex flex-row w-full items-left justify-left gap-[0.6cqw] pl-[22.5cqw] pt-[1.8cqw] -rotate-[5deg]">
							<img src="/img/assets/acm-logo-black.svg" alt="ACM Logo" className="w-[6.6cqw]" />
							<img src="/img/assets/UTSA-logo-black.svg" alt="UTSA Logo" className="w-[6.6cqw] -scale-x-100" />
						</div> */}
						{/* <div className="absolute top-[15%] flex flex-row w-full items-left justify-center pt-[2.6cqw] -rotate-[5deg]">
							<h3 className={`pt-[0.6cqw] font-semibold ml-[cqw] text-[2cqw] ${manuale.className}`}>Fall 2016 - Present Day</h3>
						</div> */}
						<div className="absolute left-[10%] top-[35%] m-[4cqw] flex w-[80%] -rotate-[5deg] flex-col items-center gap-[0.6cqw] pt-[1.3cqw]">
							<div className="relative overflow-visible">
								<h2
									className={`mr-[3.3cqw] pr-[4.6cqw] text-[2.5cqw] font-bold leading-tight ${manuale.className}`}
								>
									What is RowdyHacks?
								</h2>

								{/* Circle */}
								<motion.svg
									className="absolute left-1/2 top-1/2 w-[35cqw] -translate-x-[70%] -translate-y-1/2 -rotate-[2deg]"
									viewBox="0 0 500 100"
									fill="none"
								>
									{[0, 1, 2, 3].map((i) => {
										const baseLeft = 90 - i * 2;
										const baseRight = 480 + i * 2;

										// shared distortion values
										const wobbleX = i % 2 === 0 ? -10 : 8;
										const wobbleYTop = i % 2 === 0 ? -6 : 6;
										const wobbleYBottom =
											i % 2 === 0 ? 8 : -6;

										return (
											<motion.path
												key={i}
												d={`M${baseLeft + wobbleX},52
														C${baseLeft},${10 + wobbleYTop} ${baseRight},${10 - wobbleYTop} ${baseRight - wobbleX},48
														C${baseRight},${90 + wobbleYBottom} ${baseLeft},${90 - wobbleYBottom} ${baseLeft + wobbleX},52`}
												stroke="#991b1b"
												strokeWidth={2 + i * 0.4}
												strokeLinecap="round"
												fill="none"
												animate={{
													pathLength: [0, 1, 1, 0],
													opacity: [0, 1, 1, 0],
												}}
												transition={{
													duration: 6,
													times: [0, 0.15, 0.8, 1],
													delay: i * 0.05,
													repeat: Infinity,
													repeatDelay: 2,
													ease: "easeInOut",
												}}
											/>
										);
									})}
								</motion.svg>
							</div>
							<p
								className={`-ml-[2.6cqw] w-[50%] pr-[4.6cqw] text-center text-[2.5cqw] font-light leading-tight ${manuale.className}`}
							>
								RowdyHacks is UTSA's annual hackathon, hosted by
								the Association for Computing Machinery (ACM) at
								UTSA.
								<br />
								It's a weekend-long event where students, tech
								enthusiasts, and creative minds from all
								backgrounds come together to collaborate,
								innovate, and build real-world projects in 24
								hours.
							</p>
							<div className="duration-400 absolute left-[50%] top-[110%] flex w-[40%] -rotate-[15deg] items-center justify-center decoration-2 transition delay-150 ease-in-out hover:scale-110 hover:underline">
								<img
									src="/img/assets/blank-tape-stickers1.svg"
									alt=""
									className="w-full"
								/>
								<a
									href="https://acmutsa.org/"
									className={`absolute ${shadow.className} text-[4cqw] text-red-800`}
								>
									What is ACM?
								</a>
							</div>
						</div>
					</div>

					<div className="absolute left-[65%] top-4 z-0 flex w-3/4 max-w-[1400px] rotate-[7.35deg] flex-col items-center justify-center opacity-100 [container-type:inline-size]">
						<img
							src="/img/assets/about-background 2.png"
							alt="RowdyHacks XII About Us Section"
							className="h-full w-full pl-[8cqw]"
						/>
						<div className="absolute left-[10%] top-[35%] m-[4cqw] flex w-[80%] rotate-[1deg] flex-col items-center gap-[0.6cqw] pt-[1.3cqw]">
							<img
								src="/img/assets/classified.svg"
								className="absolute -top-[95%] right-[8%] h-auto w-[55%] -rotate-[15deg] object-contain"
							/>
							<p
								className={`w-[65%] -rotate-[2deg] text-center text-[3cqw] font-light leading-tight ${manuale.className}`}
							>
								Whether you’ve a seasoned hackathon vet or
								you’re just getting started, you’ll feel right
								at home at RowdyHacks. Come hang out, try
								something new, team up with others, and bring
								your ideas to life. There’s plenty of room to
								explore, learn as you go, and get help when you
								need it. You don’t need to be an expert, just
								curious and ready to build. By the end, you’ll
								have something real to show for it, and probably
								a few new friends along the way.
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
