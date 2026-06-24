"use client";
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
			<Pin className="absolute right-[70%] top-[0%] z-40 sm:right-[18%] sm:top-[9%]  md:right-[18%] md:top-[9%]" />
			<Pin className="absolute right-[40%] top-[-2%] z-40 sm:right-[7%]  sm:top-[49%] md:right-[7%]  md:top-[49%]" />
			<Pin className="absolute right-[5%] top-[6%] z-40 sm:right-[14%] sm:top-[85%] md:right-[19%] md:top-[90%] lg:right-[10%] lg:top-[91%]" />
			<Pin className="absolute right-[11%] top-[90%] z-40 sm:right-[45%] sm:top-[95%] lg:right-[36%] lg:top-[95%]" />
		</>
	);
}

export default function About() {
	return (
		<section className="relative w-full flex items-center justify-center pb-[12vw] sm:pb-[3vw] md:pb-[5vw]" id="About"> 
			<DossierPins />
			<div className={`relative flex h-fit w-full flex-col items-center justify-center py-0 lg:py-12 xl:py-12 2xl:py-12`}>
				<div className="w-[85%] sm:w-[75%] md:w-[70%] lg:w-[60%] xl:w-[60%]">
					<div className="duration-400 relative flex w-[100%] flex-col items-center justify-center ease-in-out [container-type:inline-size] lg:hidden xl:hidden">
						<img
							src="/img/assets/about/about1.png"
							className="absolute -top-[3%] right-[12%] h-auto w-[135%] -rotate-[8deg] drop-shadow-[6px_8px_3px_rgba(0,0,0,0.45)]"
						/>

						<img
							src="/img/assets/about/about.png"
							alt="RowdyHacks XII About Us Section"
							className="z-15 relative h-full w-[100%] drop-shadow-[6px_8px_3px_rgba(0,0,0,0.45)]"
						/>

						<div className="absolute left-[10%] top-[45%] flex w-[80%] flex-col items-center gap-[0.6cqw]">
							<div className="relative overflow-visible">
								<h2
									className={`text-md pb-[6%] font-bold leading-tight sm:text-lg md:text-xl lg:text-2xl ${manuale.className}`}
								>
									What is RowdyHacks?
								</h2>

							</div>
							<p
								className={`w-[90%] text-center text-sm font-light leading-tight sm:text-base md:text-lg ${manuale.className}`}
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
									src="/img/assets/buttons/blank-tape-stickers1.png"
									alt=""
									className="w-full"
								/>
								<a
									href="https://acmutsa.org/"
									className={`absolute ${shadow.className} text-md text-[#AC1903] sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl`}
								>
									What is ACM?
								</a>
							</div>
						</div>
					</div>

					{/* ===== Desktop ===== */}
					<div className="relative hidden w-[90%] lg:flex">
						<div className="relative right-[25%] z-10 flex w-full -rotate-[5deg] flex-col items-center justify-center [container-type:inline-size]">
							<img
								src="/img/assets/about/about1.png"
								className="absolute -top-[3%] right-[12%] h-auto w-[90%] -rotate-[8deg] drop-shadow-[6px_8px_3px_rgba(0,0,0,0.45)]"
							/>

							<img
								src="/img/assets/about/about.png"
								alt="RowdyHacks XII About Us Section"
								className="z-15 relative h-full w-[80%] drop-shadow-[6px_8px_3px_rgba(0,0,0,0.45)]"
							/>

							<div className="absolute left-[10%] top-[45%] flex w-[80%] flex-col items-center gap-[0.6cqw]">
								<div className="relative overflow-visible">
									<h2
										className={`pb-[6%] font-bold leading-tight lg:text-2xl xl:text-4xl 2xl:text-4xl ${manuale.className}`}
									>
										What is RowdyHacks?
									</h2>

								</div>
								<p
									className={`w-[75%] text-center font-light leading-tight lg:text-lg xl:text-xl 2xl:text-3xl ${manuale.className}`}
								>
									RowdyHacks is UTSA's annual hackathon,
									hosted by the Association for Computing
									Machinery (ACM) at UTSA.
									<br />
									It's a weekend-long event where students,
									tech enthusiasts, and creative minds from
									all backgrounds come together to
									collaborate, innovate, and build real-world
									projects in 24 hours.
								</p>
								<div className="duration-400 absolute left-[50%] top-[110%] flex w-[40%] -rotate-[15deg] items-center justify-center decoration-2 transition delay-150 ease-in-out hover:scale-110 hover:underline">
									<img
										src="/img/assets/buttons/blank-tape-stickers1.png"
										alt=""
										className="w-full"
									/>
									<a
										href="https://acmutsa.org/"
										className={`absolute ${shadow.className} text-md text-[#AC1903] sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl`}
									>
										What is ACM?
									</a>
								</div>
							</div>
						</div>

						<div className="absolute -top-[10%] left-[52%] z-0 flex w-full rotate-[7.35deg] flex-col items-center justify-center opacity-100 [container-type:inline-size]">
							<img
								src="/img/assets/about/about2.png"
								alt="RowdyHacks XII About Us Section"
								className="h-auto w-[100%] drop-shadow-[6px_8px_3px_rgba(0,0,0,0.45)]"
							/>

							<div className="absolute top-[40%] flex w-[80%] flex-col items-center gap-[0.6cqw]">
								<motion.img
									src="/img/assets/about/confidential.svg"
									className="absolute -top-[50%] right-[8%] h-auto w-[55%] -rotate-[15deg]"
									initial={{
										scale: 0,
										y: -40,
										opacity: 0,
										rotate: 15,
									}}
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
									viewport={{
										once: false,
										margin: "0px 0px -20% 0px",
									}}
								/>
								<p
									className={`w-[75%] text-center font-light leading-tight lg:text-lg xl:text-xl 2xl:text-3xl ${manuale.className}`}
								>
									Whether you’ve a seasoned hackathon vet or
									you’re just getting started, you’ll feel
									right at home at RowdyHacks. Come hang out,
									try something new, team up with others, and
									bring your ideas to life. There’s plenty of
									room to explore, learn as you go, and get
									help when you need it. You don’t need to be
									an expert, just curious and ready to build.
									By the end, you’ll have something real to
									show for it, and a few new friends along the
									way.
								</p>


							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
