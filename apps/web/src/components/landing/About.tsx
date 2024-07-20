import Balancer from "react-wrap-balancer";
import Image from "next/image";
import D1 from "../../../public/img/landing/d1.svg";
import D2 from "../../../public/img/landing/d2.svg";
import D3 from "../../../public/img/landing/d3.svg";
import D4 from "../../../public/img/landing/d4.svg";
import Dino_Coding from "../../../public/img/landing/dinos_coding.png";
export default function About() {
	const d1_stylesheet = {
		width: "25rem",
		height: "auto",
		sm: "width: 30rem",
	};
	return (
		<section
			className="flex min-h-screen w-full items-center justify-center border-y-2 border-muted-foreground"
			id="About"
		>
			<div className="flex w-full flex-col items-center justify-center">
				<h1 className="text-center text-4xl font-black md:text-5xl">
					About Section
				</h1>
				<h3 className="px-4 text-center text-lg font-bold md:px-0 md:text-2xl">
					Introduce the hackathon and its purpose! Make it sound
					enticing
				</h3>
			</div>
		</section>
	);
}
