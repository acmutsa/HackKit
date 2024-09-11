import Navbar from "@/components/shared/Navbar";
import Hero from "@/components/landing/Hero";

import About from "@/components/landing/About";

import Partners from "@/components/landing/Partners";
import Footer from "@/components/landing/Footer";
import MLHBadge from "@/components/landing/MLHBadge";

import { Oswald } from "next/font/google";
import WorkWithUs from "@/components/landing/WorkWithUs";
import TrailerSection from "@/components/landing/TrailerSection";
import { Suspense } from "react";
import { Skeleton } from "@/components/shadcn/ui/skeleton";
import {WavyBackground} from "@/components/landing/WavyBackground";

const oswald = Oswald({
	variable: "--font-oswald",
	subsets: ["latin"],
});

export default function Home() {
	return (
		<div className={`${oswald.variable} w-full overflow-x-hidden`}>
			<Suspense fallback={<Skeleton className="h-16 w-screen" />}>
				<Navbar />
			</Suspense>
			<MLHBadge />
			{/*<main className="relative flex h-screen w-screen flex-col items-center justify-center bg-[#1A3A9E]">*/}
			{/*<div className="absolute left-0 top-0 h-screen w-screen overflow-hidden">*/}
			<main className="overflow-x-hidden relative flex flex-col min-h-full">
					<div className="fixed inset-0 w-screen h-screen -z-10 overflow-hidden">
						<WavyBackground
							backgroundFill="#1A3A9E"
							colors={[
								"#1D41AE",
								"#1A3A9E",
								"#17338E",
								"#1D41AE",
								"#1A3A9E",
								"#1D41AE",
								"#1A3A9E",
								"#17338E",
								"#1D41AE",
								"#1A3A9E",
							]}
							speed="fast"
							waveOpacity={1}
							waveWidth={300}
							containerClassName="scale-x-125 scale-y-[2] h-full"
						/>
					</div>
				<Hero/>
				<About/>
				{/* <Partners /> */}
				<WorkWithUs/>
				<TrailerSection/>
				<Footer/>
			</main>
		</div>
	);
}

export const runtime = "edge";
export const revalidate = 30;
