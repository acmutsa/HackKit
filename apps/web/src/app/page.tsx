import Navbar from "@/components/shared/Navbar";
import Hero from "@/components/landing/Hero";
import Filler from "@/components/landing/Filler";
import About from "@/components/landing/About";
import Partners from "@/components/landing/Partners";
import Footer from "@/components/landing/Footer";
import Team from "@/components/landing/Team";
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
				{/* Commenting Out Until All Partners / Teams completed */}
				<Partners /> 
				<Team />
				<Footer />
			</main>
		</>
	);
}

export const runtime = "edge";
export const revalidate = "30";
