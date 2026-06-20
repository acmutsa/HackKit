"use client";
import Image from "next/image";
import { useRef } from "react";
import { Shadows_Into_Light } from "next/font/google";
import Pin from "@/components/landing/Pin";
import { findPosition } from "@/hooks/findPosition";

const shadowsIntoLight = Shadows_Into_Light({
	weight: "400",
	subsets: ["latin"],
	variable: "--font-shadows",
});

export default function Map() {
	const mapContainerRef = useRef<HTMLDivElement>(null);
	const mapImgRef = useRef<HTMLImageElement>(null);

	const sp1PinStyle = findPosition(
		mapContainerRef,
		mapImgRef,
		{ x: 0.54, y: 0.75 },
		40,
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
	const mainCampusPinStyle = findPosition(
		mapContainerRef,
		mapImgRef,
		{ x: 0.31, y: 0.22 },
		40,
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
	const connectedStyle = findPosition(
		mapContainerRef,
		mapImgRef,
		{ x: 0.48, y: 0.5 },
		10,
	);

	return (
		<section className="flex w-full items-center justify-center px-4 sm:px-6 lg:px-10">
			<div className="absolute flex h-fit w-full items-center justify-between">
				<div className={`invisible pb-[20%] lg:visible`}>
					<div className="relative aspect-[3.5/4] w-[15cqw]">
						<Image
							src="/img/map/main-campus.svg"
							alt="main campus"
							fill
							className="rotate-[3deg] object-contain drop-shadow-[6px_8px_3px_rgba(0,0,0,0.45)]"
						/>
						<div className="absolute inset-0 flex items-start justify-center pt-4">
							<Pin no_thread={true} />
						</div>
						<div className="absolute bottom-[10%] left-[45%] z-20 -translate-x-1/2 rotate-[3deg]">
							<p className="w-full text-2xl font-extrabold text-[#AC1903]">
								Target 2
							</p>
						</div>
					</div>
				</div>

				<div className={`invisible pt-[20%] lg:visible`}>
					<div className="relative aspect-[3.5/4] w-[15cqw]">
						<Image
							src="/img/map/SP1.svg"
							alt="sp1"
							fill
							className="rotate-[3deg] object-contain drop-shadow-[6px_8px_3px_rgba(0,0,0,0.45)]"
						/>
						<div className="absolute inset-0 flex items-start justify-center pt-4">
							<Pin no_thread={true} />
						</div>

						<div className="absolute bottom-[8%] left-[50%] z-20 -translate-x-1/2 rotate-[3deg]">
							<p className="w-full text-2xl font-extrabold text-[#AC1903]">
								SP1 - Target 1
							</p>
						</div>
					</div>
				</div>
			</div>

			<div
				className={`relative flex h-fit w-full max-w-[1440px] flex-col items-center justify-center gap-y-10 py-0 [container-type:inline-size] lg:py-12 xl:py-12 2xl:py-12 ${shadowsIntoLight.className}`}
			>
				<div className="relative h-fit w-full">
					{/* Pictures */}

					<div
						ref={mapContainerRef}
						className="relative flex aspect-[2856/2108] w-full items-center justify-start"
					>
						{/* Main Campus */}
						<div style={mainCampusPinStyle}>
							<Pin
								name="/img/map/pin5.svg"
								size={36}
								maxSize={51}
							/>
						</div>

						{/* San Pedro 1 */}
						<div style={sp1PinStyle}>
							<Pin
								name="/img/map/pin4.svg"
								size={36}
								maxSize={51}
							/>
						</div>

						<a
							href="https://maps.app.goo.gl/cRWsqr1B3qmSnTcM6"
							target="_blank"
							style={sp1TextStyle}
						>
							<p className="text-xs font-extrabold text-[#AC1903] sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl">
								UTSA <br /> San Pedro 1 <br /> (Place of action)
							</p>
						</a>

						<div style={sp1CircleStyle}>
							<div className="relative h-[8cqw] w-[8cqw] sm:h-[6cqw] sm:w-[6cqw]">
								<Image
									src="/img/map/red-circle1.svg"
									alt="pin"
									fill
									className="object-contain"
								/>
							</div>
						</div>

						<div style={mainCampusCircleStyle}>
							<div className="relative h-[8cqw] w-[8cqw] sm:h-[6cqw] sm:w-[6cqw]">
								<Image
									src="/img/map/red-circle1.svg"
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
							<p className="text-xs font-bold font-extrabold text-[#AC1903] sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl">
								UTSA <br /> Main Campus
							</p>
						</a>

						<div style={connectedStyle}>
							<p className="rotate-[61deg] text-lg font-extrabold text-[#AC1903] sm:text-xl md:text-2xl lg:text-3xl xl:text-3xl 2xl:text-4xl">
								CONNECTED?
							</p>
						</div>

						<Image
							ref={mapImgRef}
							src="/img/map/map-background.svg"
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
