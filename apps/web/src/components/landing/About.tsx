// "use client";
// import Balancer from "react-wrap-balancer";
// import Image from "next/image";
// import D1 from "../../../public/img/landing/d1.svg";
// import D2 from "../../../public/img/landing/d2.svg";
// import D3 from "../../../public/img/landing/d3.svg";
// import D4 from "../../../public/img/landing/d4.svg";
// import Dino_Coding from "../../../public/img/landing/dinos_coding.png";
// import { Manuale, Shadows_Into_Light } from "next/font/google";
// import { motion } from "motion/react"

// const manuale = Manuale({
// 	subsets: ["latin"],
// 	display: "swap",
// });
// const shadow = Shadows_Into_Light({
// 	subsets: ["latin"],
// 	weight: "400",
// });

// export default function About() {
// 	const d1_stylesheet = {
// 		width: "25rem",
// 		height: "auto",
// 		sm: "width: 30rem",
// 	};
// 	return (
// 		<section
// 			className="flex w-full items-center justify-center overflow-visible"
// 			id="About"
// 		>
// 			<div className="flex w-full max-w-[1000px] flex-col items-center justify-center ">
// 				<div className="lg:hidden xl:hidden transition delay-150 duration-400 ease-in-out hover:scale-110 hover:rotate-[3deg] relative flex w-full max-w-[1600px] flex-col items-center justify-center [container-type:inline-size] ">
					
					
					
// 					<img src="/img/assets/about1.png"
// 						className=" absolute w-[80%]  object-contain  -top-[15%]"
// 					/>

// 					<img src="/img/assets/about/about.png" alt="RowdyHacks XII About Us Section"
// 						className="relative w-[60%] z-20 drop-shadow-[6px_8px_3px_rgba(0,0,0,0.45)] rotate-[-5deg]"
// 					/>



// 					<div className="absolute top-[35%] left-[10%] flex w-[80%] m-[4cqw] flex-col items-center gap-[0.6cqw] pt-[4.5cqw] -rotate-[5deg] z-20">
// 						<div className="relative overflow-visible">
// 							<h2
// 								className={`font-bold mr-[3.3cqw] pr-[4.6cqw] text-[3.5cqw] leading-tight ${manuale.className}`}
// 							>
// 								What is RowdyHacks?
// 							</h2>

// 							{/* Circle
// 							<motion.svg
// 								className="absolute top-1/2 left-[55%] w-[50cqw] -translate-x-[70%] -translate-y-1/2 -rotate-[2deg]"
// 								viewBox="0 0 500 100"
// 								fill="none"
// 							>
// 								{[0, 1, 2, 3].map((i) => {
// 									const baseLeft = 90 - i * 2;
// 									const baseRight = 480 + i * 2;

// 									// shared distortion values
// 									const wobbleX = (i % 2 === 0 ? -10 : 8);
// 									const wobbleYTop = (i % 2 === 0 ? -6 : 6);
// 									const wobbleYBottom = (i % 2 === 0 ? 8 : -6);

// 									return (
// 										<motion.path
// 											key={i}
// 											d={`M${baseLeft + wobbleX},52
// 													C${baseLeft},${10 + wobbleYTop} ${baseRight},${10 - wobbleYTop} ${baseRight - wobbleX},48
// 													C${baseRight},${90 + wobbleYBottom} ${baseLeft},${90 - wobbleYBottom} ${baseLeft + wobbleX},52`}
// 											stroke="#991b1b"
// 											strokeWidth={2 + i * 0.4}
// 											strokeLinecap="round"
// 											fill="none"
// 											animate={{
// 												pathLength: [0, 1, 1, 0],
// 												opacity: [0, 1, 1, 0],
// 											}}
// 											transition={{
// 												duration: 6,
// 												times: [0, 0.15, 0.8, 1],
// 												delay: i * 0.05,
// 												repeat: Infinity,
// 												repeatDelay: 2,
// 												ease: "easeInOut",
// 											}}
// 										/>
// 									);
// 								})}
// 							</motion.svg> */}
// 						</div>
// 						<p className={`font-light text-center leading-tight pr-[4.6cqw] -ml-[2.6cqw] w-[55%] text-[3.0cqw] ${manuale.className}`}>
// 							RowdyHacks is UTSA's annual hackathon, hosted by the Association for Computing Machinery (ACM) at UTSA.
// 							<br />
// 							It's a weekend-long event where students, tech enthusiasts, and creative minds from all backgrounds come together to collaborate, innovate, and build real-world projects in 24 hours.
// 						</p>
// 						<div className=" transition delay-150 duration-400 ease-in-out hover:scale-110 hover:underline decoration-2 absolute top-[110%] left-[50%] flex items-center justify-center w-[40%] -rotate-[15deg]">
// 							<img src="/img/assets/blank-tape-stickers1.svg" alt="" className="w-full" />
// 							<a href="https://acmutsa.org/" className={`absolute ${shadow.className} text-[4.0cqw] text-red-800`}>What is ACM?</a>
// 						</div>
// 					</div>
// 				</div>



// 				{/* Desktop Version (Visible on screens > 1024px) */}
// 				<div className="hidden lg:flex relative w-full right-[10vw] lg:right-[5vw] xl:right-[10vw] 2xl:right-[17vw] overflow-visible">

// 					<img src="/img/assets/about/about1.png"
// 						className="absolute z-[1] w-[45vw] -top-[1vw] right-[2.5vw] -rotate-[8deg] drop-shadow-[6px_8px_3px_rgba(0,0,0,0.45)] "
// 					/>

// 					<div className="relative z-[20] w-[40vw] top-[1vw] right-[-5vw] rotate-[-5deg] flex flex-col items-center justify-center [container-type:inline-size] ">

// 						<img src="/img/assets/about/about.png" alt="RowdyHacks XII About Us Section"
// 							className="drop-shadow-[6px_8px_3px_rgba(0,0,0,0.45)]"
// 						/>

// 						<div className="absolute z-[25] top-[35%] left-[10%] flex w-[80%] m-[4cqw] flex-col items-center gap-[0.6cqw] pt-[1.3cqw] -rotate-[5deg]">
							
// 							<div className="absolute top-[35%] left-[5%] flex w-[80%] m-[4cqw] flex-col items-center gap-[0.6cqw] pt-[1.3cqw]">
// 								<h2
// 									className={`font-bold mr-[3.3cqw] pr-[4.6cqw] text-[2.5cqw] leading-tight ${manuale.className}`}
// 								>
// 									What is RowdyHacks?
// 								</h2>

// 								{/* Circle
// 								<motion.svg
// 									className="absolute top-1/2 left-1/2 w-[35cqw] -translate-x-[70%] -translate-y-1/2 -rotate-[2deg]"
// 									viewBox="0 0 500 100"
// 									fill="none"
// 								>
// 									{[0, 1, 2, 3].map((i) => {
// 										const baseLeft = 90 - i * 2;
// 										const baseRight = 480 + i * 2;

// 										// shared distortion values
// 										const wobbleX = (i % 2 === 0 ? -10 : 8);
// 										const wobbleYTop = (i % 2 === 0 ? -6 : 6);
// 										const wobbleYBottom = (i % 2 === 0 ? 8 : -6);

// 										return (
// 											<motion.path
// 												key={i}
// 												d={`M${baseLeft + wobbleX},52
// 														C${baseLeft},${10 + wobbleYTop} ${baseRight},${10 - wobbleYTop} ${baseRight - wobbleX},48
// 														C${baseRight},${90 + wobbleYBottom} ${baseLeft},${90 - wobbleYBottom} ${baseLeft + wobbleX},52`}
// 												stroke="#991b1b"
// 												strokeWidth={2 + i * 0.4}
// 												strokeLinecap="round"
// 												fill="none"
// 												animate={{
// 													pathLength: [0, 1, 1, 0],
// 													opacity: [0, 1, 1, 0],
// 												}}
// 												transition={{
// 													duration: 6,
// 													times: [0, 0.15, 0.8, 1],
// 													delay: i * 0.05,
// 													repeat: Infinity,
// 													repeatDelay: 2,
// 													ease: "easeInOut",
// 												}}
// 											/>
// 										);
// 									})}
// 								</motion.svg> */}

// 							</div>
// 							<p className={`font-light text-center leading-tight w-[65%] lg:text-xl xl:text-2xl 2xl:text-3xl rotate-[1deg] ${manuale.className}`}>
// 								RowdyHacks is UTSA's annual hackathon, hosted by the Association for Computing Machinery (ACM) at UTSA.
// 								<br />
// 								It's a weekend-long event where students, tech enthusiasts, and creative minds from all backgrounds come together to collaborate, innovate, and build real-world projects in 24 hours.
// 							</p>
// 							<div className=" transition delay-150 duration-400 ease-in-out hover:scale-110 hover:underline decoration-2 absolute top-[110%] left-[50%] flex items-center justify-center w-[40%] -rotate-[15deg]">
// 								<img src="/img/assets/blank-tape-stickers1.svg" alt="" className="w-full" />
// 								<a href="https://acmutsa.org/" className={`absolute ${shadow.className} text-[4cqw] text-red-800`}>What is ACM?</a>
// 							</div>
// 						</div>

// 					</div>

// 					<div className="absolute top-[1vw] left-[40vw] w-[50vw] z-[2] flex flex-col items-center justify-center [container-type:inline-size] opacity-100 rotate-[7.35deg]">
						
// 						<img src="/img/assets/about2.png" alt="RowdyHacks XII About Us Section"
// 							className="pl-[8cqw] drop-shadow-[6px_8px_3px_rgba(0,0,0,0.45)]"
// 						/>

// 						<div className="absolute top-[35%] left-[5%] flex w-[80%] m-[4cqw] flex-col items-center gap-[0.6cqw] pt-[1.3cqw]">
// 							<motion.img src="/img/assets/about/confidential.svg" 
// 								className="w-[55%] h-auto object-contain absolute -top-[25%] right-[8%] -rotate-[15deg]"
// 								initial={{ scale: 0, y: -40, opacity: 0, rotate: 15 }}
// 								whileInView={{
// 									scale: [0.25, 3, 1],
// 									y: [-80, 0],
// 									opacity: [0, 1, 1],

// 								}}
// 								transition={{
// 									duration: 0.5,
// 									delay: 0.75,
// 									ease: [0.2, 0.9, 0.2, 1],
// 								}}
// 								viewport={{ once: false, margin: "0px 0px -20% 0px" }}
// 							/>
// 							<p className={`font-light text-center leading-tight w-[65%] lg:text-xl xl:text-2xl 2xl:text-3xl rotate-[1deg] ${manuale.className}`}>
// 								Whether you’ve a seasoned hackathon vet or you’re just getting started, you’ll feel right at home at RowdyHacks.
// 								Come hang out, try something new, team up with others, and bring your ideas to life. There’s plenty of room to explore, learn as you go, and get help when you need it. You don’t need to be an expert, just curious and ready to build.

// 								By the end, you’ll have something real to show for it, and probably a few new friends along the way.
// 							</p>
// 						</div>

// 				</div>
// 				</div>


// 			</div>
// 		</section>
// 	);
// }


"use client";
import Balancer from "react-wrap-balancer";
import Image from "next/image";
import D1 from "../../../public/img/landing/d1.svg";
import D2 from "../../../public/img/landing/d2.svg";
import D3 from "../../../public/img/landing/d3.svg";
import D4 from "../../../public/img/landing/d4.svg";
import Dino_Coding from "../../../public/img/landing/dinos_coding.png";
import { Manuale, Shadows_Into_Light } from "next/font/google";
import { motion } from "motion/react"

const manuale = Manuale({
	subsets: ["latin"],
	display: "swap",
});
const shadow = Shadows_Into_Light({
	subsets: ["latin"],
	weight: "400",
});

export default function About() {
	const d1_stylesheet = {
		width: "25rem",
		height: "auto",
		sm: "width: 30rem",
	};
	return (
		<section className="flex w-full items-center justify-center" id="About">
        	<div className={`relative flex flex-col items-center justify-center w-full h-fit py-0 xl:py-12 lg:py-12 2xl:py-12`}>


				<div className="w-[85%] sm:w-[75%] md:w-[70%] lg:w-[60%] xl:w-[60%]">
					

					<div className="lg:hidden xl:hidden transition delay-150 duration-400 ease-in-out hover:scale-110 hover:rotate-[3deg] relative flex w-[100%] flex-col items-center justify-center [container-type:inline-size] ">
							
							<img src="/img/assets/about/about1.png"
								className="absolute w-[135%] h-auto -top-[3%] right-[12%] -rotate-[8deg] drop-shadow-[6px_8px_3px_rgba(0,0,0,0.45)]"
							/>

							<img src="/img/assets/about/about.png" alt="RowdyHacks XII About Us Section"
								className="relative w-[100%] h-full z-15 drop-shadow-[6px_8px_3px_rgba(0,0,0,0.45)]"
							/>

							<div className="absolute top-[45%] left-[10%] flex w-[80%] flex-col items-center gap-[0.6cqw]">
								<div className="relative overflow-visible">
									<h2
										className={`font-bold text-md sm:text-lg md:text-xl lg:text-2xl pb-[6%] leading-tight ${manuale.className}`}
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
								<p className={`font-light text-center leading-tight w-[90%] text-sm sm:text-base md:text-lg ${manuale.className}`}>
									RowdyHacks is UTSA's annual hackathon, hosted by the Association for Computing Machinery (ACM) at UTSA.
									<br />
									It's a weekend-long event where students, tech enthusiasts, and creative minds from all backgrounds come together to collaborate, innovate, and build real-world projects in 24 hours.
								</p>
								<div className=" transition delay-150 duration-400 ease-in-out hover:scale-110 hover:underline decoration-2 absolute top-[110%] left-[50%] flex items-center justify-center w-[40%] -rotate-[15deg]">
									<img src="/img/assets/blank-tape-stickers1.svg" alt="" className="w-full" />
									<a href="https://acmutsa.org/" className={`absolute ${shadow.className} text-md sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-[#AC1903]`}>What is ACM?</a>
								</div>
							</div>
					</div>
					
					{/* ===== Desktop ===== */}
					<div className=" hidden lg:flex relative w-[90%]">

						<div className="relative w-full z-10 right-[25%] -rotate-[5deg] flex flex-col items-center justify-center [container-type:inline-size]">

							<img src="/img/assets/about/about1.png"
								className="absolute w-[95%] h-auto -top-[3%] right-[12%] -rotate-[8deg] drop-shadow-[6px_8px_3px_rgba(0,0,0,0.45)]"
							/>

							<img src="/img/assets/about/about.png" alt="RowdyHacks XII About Us Section"
								className="relative w-[80%] h-full z-15 drop-shadow-[6px_8px_3px_rgba(0,0,0,0.45)]"
							/>

							<div className="absolute top-[45%] left-[10%] flex w-[80%] flex-col items-center gap-[0.6cqw]">
								<div className="relative overflow-visible">
									<h2
										className={`font-bold lg:text-2xl xl:text-4xl 2xl:text-4xl pb-[6%] leading-tight ${manuale.className}`}
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
								<p className={`font-light text-center leading-tight w-[75%] lg:text-lg xl:text-xl 2xl:text-3xl ${manuale.className}`}>
									RowdyHacks is UTSA's annual hackathon, hosted by the Association for Computing Machinery (ACM) at UTSA.
									<br />
									It's a weekend-long event where students, tech enthusiasts, and creative minds from all backgrounds come together to collaborate, innovate, and build real-world projects in 24 hours.
								</p>
								<div className=" transition delay-150 duration-400 ease-in-out hover:scale-110 hover:underline decoration-2 absolute top-[110%] left-[50%] flex items-center justify-center w-[40%] -rotate-[15deg]">
									<img src="/img/assets/blank-tape-stickers1.svg" alt="" className="w-full" />
									<a href="https://acmutsa.org/" className={`absolute ${shadow.className} text-md sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-[#AC1903]`}>What is ACM?</a>
								</div>
							</div>

						</div>

						<div className="absolute w-full z-0 -top-[10%] left-[52%] rotate-[7.35deg] flex flex-col items-center justify-center [container-type:inline-size] opacity-100 ">
							
							<img src="/img/assets/about/about2.png" alt="RowdyHacks XII About Us Section"
								className="w-[100%] h-auto drop-shadow-[6px_8px_3px_rgba(0,0,0,0.45)]"
							/>

							<div className="absolute top-[40%] flex w-[80%] flex-col items-center gap-[0.6cqw]">
								
								<motion.img src="/img/assets/about/confidential.svg"
									className="w-[55%] h-auto absolute -top-[50%] right-[8%] -rotate-[15deg]"
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
								<p className={`font-light text-center leading-tight w-[75%] lg:text-lg xl:text-xl 2xl:text-3xl ${manuale.className}`}>
									Whether you’ve a seasoned hackathon vet or you’re just getting started, you’ll feel right at home at RowdyHacks.
									Come hang out, try something new, team up with others, and bring your ideas to life. There’s plenty of room to explore, learn as you go, and get help when you need it. You don’t need to be an expert, just curious and ready to build.

									By the end, you’ll have something real to show for it, and a few new friends along the way.
								</p>
							</div>

						</div>
					</div>

				</div>

			</div>
		</section>
	);
}





