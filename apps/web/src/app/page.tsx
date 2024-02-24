import Navbar from "@/components/shared/Navbar";
import Hero from "@/components/landing/Hero";
import Filler from "@/components/landing/FillerHeroAbout";
import About from "@/components/landing/About";
import FillerAboutPartners from "@/components/landing/FillerAboutPartners";
import Partners from "@/components/landing/Partners";
import Team from "@/components/landing/Team";
import Footer from "@/components/landing/Footer";
import MLHBadge from "@/components/landing/MLHBadge";

import { Oswald } from "next/font/google";
import WorkWithUs from "@/components/landing/WorkWithUs";

const oswald = Oswald({
	variable: "--font-oswald",
	subsets: ["latin"],
});

export default function Home() {
	return (
		<div className={`${oswald.variable} w-full overflow-x-hidden `}>
			<Navbar />
			<MLHBadge />
			<main>
				<Hero />
				<Filler />
				<About />
				<FillerAboutPartners />
				<Partners />
				
				<WorkWithUs />
				<Team />
				<Footer />
			</main>
		</div>
	);
}

export const runtime = "edge";
export const revalidate = "30";
