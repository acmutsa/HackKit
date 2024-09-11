import ShinyLogo from "./ShinyLogo";
import { WavyBackground } from "./WavyBackground";
import Link from "next/link";

export default function Home() {
	return (
		<main className="relative flex h-screen w-screen flex-col items-center justify-center bg-[#1A3A9E]">
			<div className="absolute left-0 top-0 h-screen w-screen overflow-hidden">
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
					containerClassName="scale-x-125 scale-y-[2]"
				/>
			</div>
			<div
				className={`z-20 mx-4 flex flex-col items-center space-y-3 md:flex-row md:space-y-0`}
			>
				<ShinyLogo />
				<h1 className="bg-gradient-to-b from-orange-600 via-yellow-300 to-orange-600 bg-clip-text p-5 pl-2 font-bttf text-5xl text-transparent sm:text-7xl lg:text-8xl">
					<span className="text-7xl sm:text-8xl md:text-[length:inherit]">
						{"HACK<"}
					</span>
					<br />
					{"&future>"}
				</h1>
			</div>
			<p className="z-20 mx-2 mb-6 text-center font-mono text-xl font-bold italic text-orange-400 md:mx-0 xl:mb-8 2xl:text-3xl">
				October 26th - 27th 2024
			</p>
			<Link
				href="/register"
				className="z-20 rounded-md text-center font-bttf text-xl md:text-2xl 2xl:text-3xl bg-white flex justify-center items-center border-orange-400 border-4 drop-shadow-md"
				target="_blank"
			>
				<h1 className="bg-gradient-to-b from-orange-600 via-yellow-300 to-orange-600 bg-clip-text p-2 font-bttf text-5xl text-transparent sm:text-7xl lg:text-8xl mb-3 lg:mt-3 lg:mb-0">
					<span className="text-2xl sm:text-8xl md:text-[length:inherit]">
						{"register now"}
					</span>
					</h1>
			</Link>
			<Overlay />
		</main>
	);
}

function Overlay() {
	return (
		<div className="pointer-events-none fixed left-0 top-0 z-50 h-full w-screen select-none p-5 pt-16">
			<div className="relative h-full w-full">
				{/* Start Corners */}
				{/* <div className="absolute left-0 top-0 h-[15px] w-[15px] border-l-2 border-t-2 border-orange-400"/>
				<div className="absolute right-0 top-0 h-[15px] w-[15px] border-r-2 border-t-2 border-orange-400"/>
				<div className="absolute bottom-0 left-0 h-[15px] w-[15px] border-b-2 border-l-2 border-orange-400"/>
				<div className="absolute bottom-0 right-0 h-[15px] w-[15px] border-b-2 border-r-2 border-orange-400"/> */}
				{/* End Corners */}
				<p className="absolute bottom-0 left-0 w-full text-center font-mono text-orange-400">
					ROWDYHACKS X · SAN PEDRO I, UTSA
				</p>
			</div>
		</div>
	);
}