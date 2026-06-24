import Navbar from "@/components/shared/Navbar";
import Hero from "@/components/landing/Hero";
import About from "@/components/landing/About";
import Map from "@/components/landing/Map";

import Partners from "@/components/landing/Partners";
import Footer from "@/components/landing/Footer";
import MLHBadge from "@/components/landing/MLHBadge";
import FAQ from "@/components/landing/faq";
import LandingThread from "@/components/landing/LandingThread";
import { Oswald } from "next/font/google";
import WorkWithUs from "@/components/landing/WorkWithUs";

const oswald = Oswald({
	variable: "--font-oswald",
	subsets: ["latin"],
});

export default function Home() {
	return (
		<div className={`${oswald.variable} w-full overflow-x-hidden`}>
			<LandingThread />
			<Navbar />
			<MLHBadge />
			{/* <main className="overflow-x-hidden"> */}
				<Hero />
				<About />
				<Map />
				<Partners />
				<FAQ />
				<Footer />
		
			{/* </main> */}
		</div>
	);
}

export const revalidate = 30;
