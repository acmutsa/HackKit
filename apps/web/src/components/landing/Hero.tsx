"use client";

import Image from "next/image";
import { useRef } from "react";
import { useScroll, useSpring, useTransform, motion } from "framer-motion";
import Volcano from "@/components/landing/Volcano";
import { Signika } from "next/font/google";
import Link from "next/link";
import Marquee from "react-fast-marquee";
import { MousePointer2 } from "lucide-react";

const signika = Signika({
	subsets: ["latin"],
});

export default function Hero() {
	const contentWrapperRef = useRef(null);
	const { scrollYProgress } = useScroll({
		target: contentWrapperRef,
		offset: ["start start", "end start"],
	});
	const springyScrollProg = useSpring(scrollYProgress, {
		stiffness: 400,
		damping: 90,
	});

	const sky = useTransform(springyScrollProg, [0, 1], ["0%", "20%"]);
	const grass_back_5 = useTransform(springyScrollProg, [0, 1], ["0%", "50%"]);
	const grass_back_4 = useTransform(springyScrollProg, [0, 1], ["0%", "40%"]);
	const grass_back_3 = useTransform(springyScrollProg, [0, 1], ["0%", "30%"]);
	const grass_back_caveplants_2 = useTransform(springyScrollProg, [0, 1], ["0%", "20%"]);
	const grass_back_1 = useTransform(springyScrollProg, [0, 1], ["0%", "10%"]);

	return (
		<section
			ref={contentWrapperRef}
			className={`min-h-screen w-screen overflow-x-hidden overflow-y-hidden relative`}
		>
			<motion.div
				style={{ y: sky }}
				className="absolute h-full w-full bg-gradient-to-t from-[#E3E165] via-[#CCD2AD] to-[#CCD2AD]"
			>
				<Marquee autoFill={true} direction="right" speed={10}>
					<div className="relative h-screen -translate-y-20 w-screen">
						<Image src={"/img/landing/clouds.svg"} alt="" fill className="opacity-30" />
					</div>
				</Marquee>
			</motion.div>
			<motion.div style={{ y: grass_back_5 }} className="absolute w-full h-full">
				<Volcano />
			</motion.div>
			<motion.div style={{ y: grass_back_5 }} className="absolute w-full h-full">
				<Image
					src="/img/landing/layers/grass_back_5.svg"
					alt=""
					className="object-cover object-center"
					fill
				/>
			</motion.div>
			<motion.div style={{ y: grass_back_4 }} className="absolute w-full h-full">
				<Image
					src="/img/landing/layers/grass_back_4.svg"
					alt=""
					className="object-cover object-center"
					fill
				/>
			</motion.div>
			<motion.div style={{ y: grass_back_3 }} className="absolute w-full h-full">
				<Image
					src="/img/landing/layers/grass_back_3.svg"
					alt=""
					className="object-cover object-center"
					fill
				/>
			</motion.div>
			<motion.div style={{ y: grass_back_caveplants_2 }} className="absolute w-full h-full">
				<Image
					src="/img/landing/layers/grass_back_caveplants_2.svg"
					alt=""
					className="object-cover object-center"
					fill
				/>
			</motion.div>
			<motion.div style={{ y: grass_back_1 }} className="absolute w-full h-full">
				<Image
					src="/img/landing/layers/grass_back_1.svg"
					alt=""
					className="object-cover object-center"
					fill
				/>
			</motion.div>
			<div className="absolute w-full h-full">
				<Image
					src="/img/landing/layers/wall_left.svg"
					alt=""
					className="object-cover object-left-bottom hidden lg:block"
					fill
				/>
			</div>
			<div className="absolute w-full h-full">
				<Image
					src="/img/landing/layers/wall_right.svg"
					alt=""
					className="object-cover object-right-bottom hidden lg:block"
					fill
				/>
			</div>{" "}
			<Link href={"/register"} className="bg-red-500">
				<div className="absolute w-[400px] h-[400px] hover:cursor-pointer bottom-0">
					<Image
						src={"/img/landing/rock.png"}
						alt="Register Now!"
						width={400}
						height={400}
						className="absolute z-20 md:bottom-[7vh] bottom-[-2vh] md:left-[8vw] left-1/2 -translate-x-1/2 md:translate-x-0 md:scale-100 scale-75"
					/>
					<div className="absolute z-20 md:bottom-[7vh] bottom-[-2vh] md:left-[8vw] left-1/2 -translate-x-1/2 md:translate-x-0 md:scale-100 scale-75 h-[275px] w-[350px] flex items-center pt-12 md:pl-10 pl-0 justify-center">
						<h1
							className={`text-gray-700 italic flex items-end font-black text-6xl text-center leading-[3.5rem] ${signika.className}`}
						>
							Register
							<br />
							Now!
							<MousePointer2 size={62} />
						</h1>
					</div>
				</div>
			</Link>
			<div className="absolute w-full h-full pointer-events-none">
				<div className="h-[5px] w-screen absolute bg-[#7D9037] bottom-0"></div>
				<Image
					src="/img/landing/layers/grass_front.svg"
					alt=""
					className="object-cover object-center"
					fill
				/>
			</div>
			<div className="flex lg:flex-row flex-col items-center justify-center absolute w-screen lg:top-[30%] top-[10%] lg:pr-24">
				<div className="md:h-[300px] md:w-[300px] h-[200px] w-[200px]">
					<Image
						src={"/img/logo/logo.png"}
						height={300}
						width={300}
						alt="RowdyHacks 2024 Logo"
					></Image>
				</div>
				<div className="relative md:scale-100 scale-50 md:my-0 -my-10">
					<div className="font-oswald absolute translate-y-1 -translate-x-2">
						<h2 className="font-bold m-0 md:text-3xl text-4xl leading-[0.95] text-[#A88567] pl-2 md:pb-0 pb-3 italic lg:text-left text-center">
							A LAND BEFORE
						</h2>
						<h1 className="font-bold text-9xl m-0 leading-[0.95] select-none text-[#A88567] lg:text-left text-center">
							RowdyHacks
						</h1>
						<h2 className="font-bold m-0 md:text-3xl text-4xl leading-[0.95] text-[#A88567] md:pt-3 pt-6 italic lg:text-right w-full text-center">
							FEB. 24TH - 25TH
						</h2>
					</div>
					<div className="font-oswald relative">
						<h2 className="font-bold m-0 md:text-3xl text-4xl leading-[0.95] text-[#FEF2E6] pl-2 md:pb-0 pb-3 opacity-0  lg:text-left text-center">
							A LAND BEFORE
						</h2>
						<h1 className="font-bold text-9xl m-0 leading-[0.95] text-[#FEF2E6]  lg:text-left text-center">
							RowdyHacks
						</h1>
						<h2 className="font-bold m-0 md:text-3xl text-4xl leading-[0.95] text-[#FEF2E6] md:pt-3 pt-6 opacity-0  lg:text-right w-full text-center">
							FEB. 25TH - 26TH
						</h2>
					</div>
				</div>
			</div>
		</section>
	);
}
