import Image from "next/image";
import c from "@/hackkit.config";
import { Button } from "@/components/shadcn/ui/button";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import Hero from "@/components/landing/Hero";
import About from "@/components/landing/About";
import Partners from "@/components/landing/Partners";
import Footer from "@/components/landing/Footer";

export default function Home() {
	return (
		<>
			<Navbar />
			<main className="w-full">
				<Hero />
				<About />
				<Partners />
				<Footer />
			</main>
		</>
	);
}
