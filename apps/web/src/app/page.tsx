import Navbar from "@/components/shared/Navbar";
import Hero from "@/components/landing/Hero";
import CreatedwithHackkit from "@/components/landing/CreatedwithHackkit";
import About from "@/components/landing/About";

import Partners from "@/components/landing/Partners";
import Footer from "@/components/landing/Footer";
import MLHBadge from "@/components/landing/MLHBadge";

import { Oswald } from "next/font/google";
import WorkWithUs from "@/components/landing/WorkWithUs";
import CreatedWithHackkit from "@/components/landing/CreatedwithHackkit";

const oswald = Oswald({
	variable: "--font-oswald",
	subsets: ["latin"],
});

export default function Home() {
	return (
		<div className={`${oswald.variable} w-full overflow-x-hidden`}>
			<Navbar />
			<MLHBadge />
			<main className="overflow-x-hidden">
				<Hero />

				<About />
				<Partners />
				<WorkWithUs />
				<CreatedWithHackkit />
				<Footer />
			</main>
		</div>
	);
}

export const runtime = "edge";
export const revalidate = 30;
