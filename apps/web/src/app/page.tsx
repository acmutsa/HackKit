import Navbar from "@/components/shared/Navbar";
import Hero from "@/components/landing/Hero";
import About from "@/components/landing/About";

import Partners from "@/components/landing/Partners";
import Footer from "@/components/landing/Footer";
import MLHBadge from "@/components/landing/MLHBadge";

import { Racing_Sans_One } from "next/font/google";
import WorkWithUs from "@/components/landing/WorkWithUs";

const racingSansOne = Racing_Sans_One({
	subsets: ["latin"],
	weight: "400",
	variable: "--font-racing",
});

export default function Home() {
	return (
		<div className={`${racingSansOne.variable} w-full overflow-x-hidden`}>
			<Navbar />
			<MLHBadge />
			<main className="overflow-x-hidden">
				<Hero />
				<About />
				<Partners />
				<WorkWithUs />
				<Footer />
			</main>
		</div>
	);
}

export const runtime = "edge";
export const revalidate = 30;
