import Balancer from "react-wrap-balancer";
import Image from "next/image";
import D1 from "../../../public/img/landing/d1.svg";
import D2 from "../../../public/img/landing/d2.svg";
import D3 from "../../../public/img/landing/d3.svg";
import D4 from "../../../public/img/landing/d4.svg";
import Dino_Coding from "../../../public/img/landing/dinos_coding.png";
import { Manuale, Shadows_Into_Light } from "next/font/google";

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
		<section
			className="flex w-full items-center justify-center"
			id="About"
		>
			<div className="flex w-full max-w-[1000px] flex-col items-center justify-center ">
				<div className="transition delay-150 duration-400 ease-in-out hover:scale-110 hover:rotate-[3deg] relative flex w-full max-w-[1600px] flex-col items-center justify-center [container-type:inline-size] ">
					<img src="/img/assets/about.svg" alt="RowdyHacks XII About Us Section"
						className="w-full h-full pl-[8cqw] "
					/>
					<div className="absolute top-[15%] flex flex-row w-full items-left justify-left gap-[0.6cqw] pl-[22.5cqw] pt-[1.8cqw] -rotate-[5deg]">
						<img src="/img/assets/acm-logo-black.svg" alt="ACM Logo" className="w-[6.6cqw]" />
						<img src="/img/assets/UTSA-logo-black.svg" alt="UTSA Logo" className="w-[6.6cqw] -scale-x-100" />
					</div>
					<div className="absolute top-[15%] flex flex-row w-full items-left justify-center pt-[2.6cqw] -rotate-[5deg]">
						<h3 className={`pt-[0.6cqw] font-semibold ml-[cqw] text-[2cqw] ${manuale.className}`}>Fall 2016 - Present Day</h3>
					</div>
					<div className="absolute top-[35%] left-[10%] flex w-[80%] m-[4cqw] flex-col items-center gap-[0.6cqw] pt-[1.3cqw] -rotate-[5deg]">
						<h2 className={`font-bold mr-[3.3cqw] pr-[4.6cqw] text-[2.5cqw] leading-tight ${manuale.className}`}>
							What is RowdyHacks?
						</h2>
						<p className={`font-light text-center leading-tight pr-[4.6cqw] -ml-[2.6cqw] w-[50%] text-[2.5cqw] ${manuale.className}`}>
							RowdyHacks is UTSA's annual hackathon, hosted by the Association for Computing Machinery (ACM) at UTSA.
							<br />
							It's a weekend-long event where students, tech enthusiasts, and creative minds from all backgrounds come together to collaborate, innovate, and build real-world projects in 24 hours.
						</p>
						<div className=" transition delay-150 duration-400 ease-in-out hover:scale-110 hover:underline decoration-2 absolute top-[110%] left-[50%] flex items-center justify-center w-[25%] -rotate-[15deg]">
							<img src="/img/assets/blank-tape-stickers1.svg" alt="" className="w-full" />
							<a href="https://acmutsa.org/" className={`absolute ${shadow.className} text-[3cqw] text-red-800`}>What is ACM?</a>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
