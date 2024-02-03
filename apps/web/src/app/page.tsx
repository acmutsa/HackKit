import Navbar from "@/components/shared/Navbar";
import Hero from "@/components/landing/Hero";
import Filler from "@/components/landing/Filler";
import About from "@/components/landing/About";
import FillerAboutPartners from "@/components/landing/FillerAboutPartners";
import Partners from "@/components/landing/Partners";
import FillerPartnersTeam from "@/components/FillerPartnersTeam";
import Team from "@/components/landing/Team";
import Footer from "@/components/landing/Footer";

import { Oswald } from "next/font/google";

const oswald = Oswald({
	variable: "--font-oswald",
	subsets: ["latin"],
});

export default function Home() {
	return (
		<>
			<Navbar />
			<main className={`${oswald.variable} w-full overflow-x-hidden`}>
				<Hero />
				<Filler />
				<About />
				<FillerAboutPartners/>
				<Partners /> 
				<FillerPartnersTeam/>
				<Team />
				<Footer />
			</main>
		</>
	);
}

export const runtime = "edge";
export const revalidate = "30";
