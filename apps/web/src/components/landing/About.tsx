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
		<section className="flex w-full items-center justify-center" id="About">
			<div
				className={`relative flex h-fit w-full flex-col items-center justify-center py-0 lg:py-12 xl:py-12 2xl:py-12`}
			>
				<div className="w-[85%] sm:w-[75%] md:w-[70%] lg:w-[60%] xl:w-[60%]">
					<div className="duration-400 relative flex w-[100%] flex-col items-center justify-center transition delay-150 ease-in-out [container-type:inline-size] hover:rotate-[3deg] hover:scale-110 lg:hidden xl:hidden">
						<img
							src="/img/assets/about/about1.png"
							className="absolute -top-[3%] right-[12%] h-auto w-[135%] -rotate-[8deg] drop-shadow-[6px_8px_3px_rgba(0,0,0,0.45)]"
						/>

						<img
							src="/img/assets/about/about.png"
							alt="RowdyHacks XII About Us Section"
							className="z-15 relative h-full w-[100%] drop-shadow-[6px_8px_3px_rgba(0,0,0,0.45)]"
						/>
						<DossierPins />

						<div className="absolute left-[10%] top-[45%] flex w-[80%] flex-col items-center gap-[0.6cqw]">
							<div className="relative overflow-visible">
								<h2
									className={`text-md pb-[6%] font-bold leading-tight sm:text-lg md:text-xl lg:text-2xl ${manuale.className}`}
								>
									What is RowdyHacks?
								</h2>

								{/* Circle
									<motion.svg
										className="absolute top-1/2 left-[55%] w-[50cqw] -translate-x-[70%] -translate-y-1/2 -rotate-[2deg]"
										viewBox="0 0 500 100"
										fill="none"
									>
										{[0, 1, 2, 3].map((i) => {
											const baseLeft = 90 - i * 2;
											const baseRight = 480 + i * 2;

											shared distortion values
											const wobbleX = (i % 2 === 0 ? -10 : 8);
											const wobbleYTop = (i % 2 === 0 ? -6 : 6);
											const wobbleYBottom = (i % 2 === 0 ? 8 : -6);

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
									</motion.svg> */}
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
									src="/img/assets/blank-tape-stickers1.svg"
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
								className="absolute -top-[3%] right-[12%] h-auto w-[95%] -rotate-[8deg] drop-shadow-[6px_8px_3px_rgba(0,0,0,0.45)]"
							/>

							<img
								src="/img/assets/about/about.png"
								alt="RowdyHacks XII About Us Section"
								className="z-15 relative h-full w-[80%] drop-shadow-[6px_8px_3px_rgba(0,0,0,0.45)]"
							/>
							<DossierPins />

							<div className="absolute left-[10%] top-[45%] flex w-[80%] flex-col items-center gap-[0.6cqw]">
								<div className="relative overflow-visible">
									<h2
										className={`pb-[6%] font-bold leading-tight lg:text-2xl xl:text-4xl 2xl:text-4xl ${manuale.className}`}
									>
										What is RowdyHacks?
									</h2>

									{/* Circle */}
									{/* <motion.svg
										className="absolute top-1/2 left-1/2 w-[35cqw] -translate-x-[70%] -translate-y-1/2 -rotate-[2deg]"
										viewBox="0 0 500 100"
										fill="none"
									>
										{[0, 1, 2, 3].map((i) => {
											const baseLeft = 90 - i * 2;
											const baseRight = 480 + i * 2;

											// shared distortion values
											const wobbleX = (i % 2 === 0 ? -10 : 8);
											const wobbleYTop = (i % 2 === 0 ? -6 : 6);
											const wobbleYBottom = (i % 2 === 0 ? 8 : -6);

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
									</motion.svg> */}
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
										src="/img/assets/blank-tape-stickers1.svg"
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
