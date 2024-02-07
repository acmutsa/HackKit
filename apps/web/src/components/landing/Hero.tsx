"use client";

import Image from "next/image";
import { useRef } from "react";
import { useScroll, useSpring, useTransform, motion } from "framer-motion";
import Volcano from "@/components/landing/Volcano";

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
  const grass_back_caveplants_2 = useTransform(
    springyScrollProg,
    [0, 1],
    ["0%", "20%"]
  );
  const grass_back_1 = useTransform(springyScrollProg, [0, 1], ["0%", "10%"]);

	return (
		<section
			ref={contentWrapperRef}
			className="min-h-screen w-screen overflow-x-hidden overflow-y-hidden relative"
		>
			<motion.div
				style={{ y: sky }}
				className="absolute h-full w-full bg-gradient-to-t from-[#E3E165] via-[#CCD2AD] to-[#CCD2AD]"
			></motion.div>
			{/* <motion.div style={{ y: grass_back_5 }} className="absolute w-full h-full">
				<Volcano />
			</motion.div> */}
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
			</div>
			<div className="absolute w-full h-full">
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
						<h2 className="font-bold m-0 text-3xl sm:text-4xl leading-[0.95] text-[#A88567] pl-2 italic lg:text-left text-center">
							A LAND BEFORE
						</h2>
						<h1 className="font-bold text-9xl sm:text-[10rem] md:text-9xl m-0 leading-[0.95] select-none text-[#A88567] lg:text-left text-center">
							RowdyHacks
						</h1>
            <h2 className="font-bold m-0 text-5xl leading-[0.95] text-[#A88567] select-none pl-2 pt-5 italic lg:text-left text-center">
              February 24th - 25th
            </h2>
					</div>
					<div className="font-oswald relative">
						<h2 className="font-bold m-0 text-3xl sm:text-4xl leading-[0.95] text-[#FEF2E6] pl-2 opacity-0  lg:text-left text-center">
							A LAND BEFORE
						</h2>
						<h1 className="font-bold text-9xl sm:text-[10rem] md:text-9xl m-0 leading-[0.95] text-[#FEF2E6]  lg:text-left text-center">
							RowdyHacks
						</h1>
            <h2 className="font-bold text-5xl pt-[1.25rem] pl-[0.35rem] pr-1 m-0 leading-[1.00] text-[#FEF2E6] italic lg:text-left text-center">
              February 24th - 25th
            </h2>
					</div>
				</div>
			</div>
		</section>
	);
}
