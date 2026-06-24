"use client";
import Image from "next/image";
import { useRef } from "react";
import { Shadows_Into_Light } from "next/font/google";
import Pin from "@/components/landing/Pin";
import { findPosition } from "@/hooks/findPosition";
import { motion } from "motion/react";

const line1 = "CONNECTED?";
const line2_1 = "UTSA";
const line2_2 = "Main Campus";
const line3_1 = "UTSA";
const line3_2 = "San Pedro 1";
const line3_3 = "(Place of action)";

const shadowsIntoLight = Shadows_Into_Light({
	weight: "400",
	subsets: ["latin"],
	variable: "--font-shadows",
});

export default function Map() {
	const mapContainerRef = useRef<HTMLDivElement>(null);
	const mapImgRef = useRef<HTMLImageElement>(null);
	const mainCampusCardRef = useRef<HTMLDivElement>(null);
	const mainCampusImgRef = useRef<HTMLImageElement>(null);
	const sp1CardRef = useRef<HTMLDivElement>(null);
	const sp1CampusImgRef = useRef<HTMLImageElement>(null);

	const sp1PinStyle = findPosition(
		mapContainerRef,
		mapImgRef,
		{ x: 0.54, y: 0.75 },
		20,
	);
	const sp1TextStyle = findPosition(
		mapContainerRef,
		mapImgRef,
		{ x: 0.46, y: 0.82 },
		10,
	);
	const sp1CircleStyle = findPosition(
		mapContainerRef,
		mapImgRef,
		{ x: 0.54, y: 0.77 },
		10,
	);
	const sp1CardTextStyle = findPosition(
		sp1CardRef,
		sp1CampusImgRef,
		{ x: 0.3, y: 0.87 },
		20,
	);

	const mainCampusPinStyle = findPosition(
		mapContainerRef,
		mapImgRef,
		{ x: 0.31, y: 0.22 },
		20,
	);
	const mainCampusTextStyle = findPosition(
		mapContainerRef,
		mapImgRef,
		{ x: 0.3, y: 0.29 },
		10,
	);
	const mainCampusCircleStyle = findPosition(
		mapContainerRef,
		mapImgRef,
		{ x: 0.31, y: 0.24 },
		10,
	);
	const mainCampusCardTextStyle = findPosition(
		mainCampusCardRef,
		mainCampusImgRef,
		{ x: 0.4, y: 0.87 },
		20,
	);

	const connectedStyle = findPosition(
		mapContainerRef,
		mapImgRef,
		{ x: 0.48, y: 0.5 },
		10,
	);

	return (
		<section className="relative w-full flex items-center justify-center pb-[0vw] sm:pb-[3vw] md:pb-[5vw]" id="About">
			<div
				className={`relative flex h-fit w-full flex-col items-center justify-center gap-y-10 py-0 lg:py-12 xl:py-12 2xl:py-12 ${shadowsIntoLight.className}`}
			>
				<div className="relative h-fit w-full">
					{/* Pictures */}

					<div className="absolute -z-10 flex h-fit w-full items-center justify-between">
						<div className={`invisible pb-[20%] lg:visible`}>
							<div
								ref={mainCampusCardRef}
								className="relative aspect-[3.5/4] w-[20vw] rotate-[3deg] drop-shadow-[6px_8px_3px_rgba(0,0,0,0.45)]"
							>
								<Image
									ref={mainCampusImgRef}
									src="/img/assets/map/main-campus.png"
									alt="main campus"
									fill
									className="object-contain"
								/>
								<div className="absolute inset-0 flex items-start justify-center pt-4">
									<Pin no_thread />
								</div>
								<div style={mainCampusCardTextStyle}>
									<p className="w-full font-extrabold text-[#AC1903] lg:text-xl xl:text-2xl 2xl:text-3xl">
										Target 2
									</p>
								</div>
							</div>
						</div>

						<div className={`invisible pt-[20%] lg:visible`}>
							<div
								ref={sp1CardRef}
								className="relative aspect-[3.5/4] w-[20vw] rotate-[3deg] drop-shadow-[6px_8px_3px_rgba(0,0,0,0.45)]"
							>
								<Image
									ref={sp1CampusImgRef}
									src="/img/assets/map/SP1.png"
									alt="sp1"
									fill
									className="object-contain"
								/>
								<div className="absolute inset-0 flex items-start justify-center pt-4">
									<Pin no_thread />
								</div>

								<div style={sp1CardTextStyle}>
									<p className="w-full font-extrabold text-[#AC1903] lg:text-xl xl:text-2xl 2xl:text-3xl">
										SP1 - Target 1
									</p>
								</div>
							</div>
                    </div>
					</div>

					<div
						ref={mapContainerRef}
						className={`relative flex h-[45vh] w-full items-center justify-start sm:h-[55vh] md:h-[70vh] lg:h-[70vh] xl:h-[80vh] 2xl:h-[100vh]`}
					>
						{/* Main Campus */}
						<div style={mainCampusPinStyle}>
							<Pin name="/img/assets/map/pin5.png" size={50} />
						</div>

						{/* San Pedro 1 */}
						<div style={sp1PinStyle}>
							<Pin name="/img/assets/map/pin5.png" size={50} />
						</div>

						<a
							href="https://maps.app.goo.gl/cRWsqr1B3qmSnTcM6"
							target="_blank"
							style={sp1TextStyle}
						>
							<p className="text-sm font-extrabold text-[#AC1903] hover:underline sm:text-base md:text-lg lg:text-xl xl:text-3xl 2xl:text-4xl">
								{line3_1.split("").map((char, i) => (
									<motion.span
										key={`l1-${i}`}
										initial={{ opacity: 0, y: 6 }}
										whileInView={{ opacity: 1, y: 0 }}
										transition={{ delay: 1.8 + i * 0.05 }}
										viewport={{ once: false, amount: 0.95 }}
									>
										{char}
									</motion.span>
								))}
								<br />
								{line3_2.split("").map((char, i) => (
									<motion.span
										key={`l1-${i}`}
										initial={{ opacity: 0, y: 6 }}
										whileInView={{ opacity: 1, y: 0 }}
										transition={{ delay: 2.7 + i * 0.05 }}
										viewport={{ once: false, amount: 0.95 }}
									>
										{char}
									</motion.span>
								))}
								<br />
								{line3_3.split("").map((char, i) => (
									<motion.span
										key={`l1-${i}`}
										initial={{ opacity: 0, y: 6 }}
										whileInView={{ opacity: 1, y: 0 }}
										transition={{ delay: 3.6 + i * 0.05 }}
										viewport={{ once: false, amount: 0.95 }}
									>
										{char}
									</motion.span>
								))}
							</p>
						</a>

						<div style={sp1CircleStyle}>
							<div className="relative h-[8vw] w-[8vw] sm:h-[6vw] sm:w-[6vw]">
								<Image
									src="/img/assets/map/red-circle1.svg"
									alt="pin"
									fill
									className="object-contain"
								/>
							</div>
						</div>

						<div style={mainCampusCircleStyle}>
							<div className="relative h-[8vw] w-[8vw] sm:h-[6vw] sm:w-[6vw]">
								<Image
									src="/img/assets/map/red-circle1.svg"
									alt="pin"
									fill
									className="object-contain"
								/>
							</div>
						</div>

						<a
							href="https://maps.app.goo.gl/DesReqWDY8sV5jrY9"
							target="_blank"
							style={mainCampusTextStyle}
						>
							<p className="text-sm font-bold font-extrabold text-[#AC1903] hover:underline sm:text-base md:text-lg lg:text-xl xl:text-3xl 2xl:text-4xl">
								{line2_1.split("").map((char, i) => (
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
								<br />
								{line2_2.split("").map((char, i) => (
									<motion.span
										key={`l1-${i}`}
										initial={{ opacity: 0, y: 6 }}
										whileInView={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.8 + i * 0.05 }}
										viewport={{ once: false, amount: 0.95 }}
									>
										{char}
									</motion.span>
								))}
							</p>
						</a>

						<div style={connectedStyle}>
							<p className="rotate-[61deg] text-lg font-extrabold text-[#AC1903] sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl">
								{line1.split("").map((char, i) => (
									<motion.span
										key={`l1-${i}`}
										initial={{ opacity: 0, y: 6 }}
										whileInView={{ opacity: 1, y: 0 }}
										transition={{ delay: 5 + i * 0.05 }}
										viewport={{ once: false, amount: 0.95 }}
									>
										{char}
									</motion.span>
								))}
							</p>
						</div>

						<Image
							ref={mapImgRef}
							src="/img/assets/map/map-background.png"
							alt="red-circle"
							fill
							className="object-contain object-center drop-shadow-[6px_10px_3px_rgba(0,0,0,0.55)]"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
