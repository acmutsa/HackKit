import Navbar from "@/components/shared/Navbar";
import { Oswald } from "next/font/google";
import c from "config";
import { FaDiscord, FaInstagram, FaTwitter, FaGithub, FaFacebook } from "react-icons/fa";
import Link from "next/link";

const oswald = Oswald({
	variable: "--font-oswald",
	subsets: ["latin"],
});

export default function Page() {
	return (
		<>
			<Navbar className="bg-[#818F44] border-b-0" />
			<main
				className={`bg-[#818F44] ${oswald.variable} min-h-screen pt-16 flex items-center justify-center`}
			>
				<div className="mx-auto w-full max-w-6xl grid grid-cols-6 gap-4">
					<div className="col-span-4 flex gap-y-4 flex-col items-center justify-center">
						<h1 className="font-black font-oswald text-8xl text-[#3E5A31]">Contact Us</h1>
						<p className="font-mono max-w-[500px] text-center">
							Have a question and want to reach out? Feel free to use one of the contact methods
							listed here!
						</p>
					</div>
					<Link
						href={c.links.discord}
						className="bg-[#3E5A31] h-full col-span-2 aspect-square rounded-xl flex items-center justify-center"
					>
						<FaDiscord className="text-9xl" />
					</Link>

					<div className="bg-transparent h-full col-span-2 aspect-square rounded-xl grid grid-cols-2 gap-4 grid-rows-2">
						<Link
							href={c.links.instagram}
							className="aspect-square border-[#3E5A31] text-[#3E5A31] border-2 border-dashed hover:border-solid duration-150 transition-all rounded-xl flex items-center justify-center"
						>
							<FaInstagram className="text-6xl" />
						</Link>
						<Link
							href={c.links.twitter}
							className="aspect-square border-[#3E5A31] text-[#3E5A31] border-2 border-dashed hover:border-solid duration-150 transition-all rounded-xl flex items-center justify-center"
						>
							<FaTwitter className="text-6xl" />
						</Link>
						<Link
							href={c.links.github}
							className="aspect-square border-[#3E5A31] text-[#3E5A31] border-2 border-dashed hover:border-solid duration-150 transition-all rounded-xl flex items-center justify-center"
						>
							<FaGithub className="text-6xl" />
						</Link>
						<Link
							href={c.links.facebook}
							className="aspect-square border-[#3E5A31] text-[#3E5A31] border-2 border-dashed hover:border-solid duration-150 transition-all rounded-xl flex items-center justify-center"
						>
							<FaFacebook className="text-6xl" />
						</Link>
					</div>
					<div className="bg-[#3E5A31] h-full col-span-4 w-full rounded-xl"></div>
				</div>
			</main>
		</>
	);
}
