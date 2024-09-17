import ShinyLogo from "./ShinyLogo";
import Link from "next/link";

export default function Home() {
	return (
		<main className="relative flex h-screen w-screen flex-col items-center justify-center">
			<div
				className={`z-20 mx-4 flex flex-col items-center space-y-3 md:flex-row md:space-y-0`}
			>
				<ShinyLogo/>
				<h1 className="bg-gradient-to-b from-orange-600 via-yellow-300 to-orange-600 bg-clip-text p-5 pl-2 font-bttf text-5xl text-transparent sm:text-7xl lg:text-8xl">
					<span className="text-7xl sm:text-8xl md:text-[length:inherit]">
						{"HACK<"}
					</span>
					<br/>
					{"&future>"}
				</h1>
			</div>
			<p className="z-20 mx-2 mb-6 text-center font-mono text-xl font-bold italic text-orange-400 md:mx-0 xl:mb-8 2xl:text-3xl">
				October 26th - 27th 2024
			</p>
			<div className="w-full relative hover:scale-125 ease-in-out duration-150">
				<Link href={'/register'}>
					<div className="relative max-w-[250px] lg:max-w-[475px] mx-auto my-10">
						<div
							className="absolute z-[5] h-[64px] w-full max-w-[500px] hover:cursor-pointer bg-white mx-auto flex items-center justify-center register-clip">
							<h2 className="bg-gradient-to-b from-orange-600 via-yellow-300 to-orange-600 bg-clip-text px-2 font-bttf text-2xl lg:text-5xl text-transparent lg:mt-3">
								register
							</h2>
						</div>
						<div
							className="translate-y-2 absolute h-[64px] w-full max-w-[500px] hover:cursor-pointer bg-orange-400 mx-auto flex items-center justify-center register-clip"></div>
					</div>
				</Link>
			</div>
			<Overlay/>
		</main>
	);
}

function Overlay() {
	return (
		<div className="pointer-events-none fixed left-0 top-0 z-50 h-full w-screen select-none p-5 pt-16">
			<div className="relative h-full w-full">

				<p className="absolute bottom-0 left-0 w-full text-center font-mono text-orange-400">
					ROWDYHACKS X · SAN PEDRO I, UTSA
				</p>
			</div>
		</div>
	);
}
