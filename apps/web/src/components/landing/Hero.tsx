import { Shadows_Into_Light } from "next/font/google";

const shadows = Shadows_Into_Light({
	subsets: ["latin"],
	variable: "--font-shadows",
	weight: "400",
});
export default function Hero() {
	return (
		<>
			<section className="relative w-full overflow-hidden px-2 sm:px-4 lg:px-8">
				<div className="relative mx-auto w-full max-w-[1600px] pb-[30cqw] [container-type:inline-size] sm:pb-0">
					<div className="relative w-full sm:w-[85%] md:w-[80%] lg:w-[75%]">
						<img
							src="img/assets/logo-background.svg"
							alt=""
							className="h-auto w-full"
						/>
						<div className="absolute bottom-[6.4rem] right-[3.2rem] w-[25%] rotate-12 sm:bottom-[8.25rem] sm:right-[4.2rem] md:bottom-[10rem] md:right-[5rem] lg:bottom-[13.8rem] lg:right-[7.3rem]">
							<img
								src="img/assets/top-secret.svg"
								alt=""
								className="h-auto w-full"
							/>
						</div>
						<div className="absolute right-[23%] top-[13.5%] w-[50%] lg:right-[21%] lg:top-[13%]">
							<img
								src="img/assets/logo-background-paper.svg"
								alt=""
								className="h-auto w-full"
							/>
						</div>
						<div className="absolute right-[37.5%] top-[28%] w-[20%] lg:right-[36%] lg:top-[28%]">
							<img
								src="img/assets/rh-city-logo-black.svg"
								alt=""
								className="h-auto w-full"
							/>
						</div>
						<div className="absolute left-[7.5%] top-[35%] w-[17.5%]">
							<img
								src="img/assets/marker-circle3.svg"
								alt=""
								className="h-auto w-full"
							/>
						</div>
						<div className="pin absolute bottom-[12.5%] right-[5%] z-40 h-fit w-[3.5%] sm:left-[5%] sm:top-[47.5%] sm:w-[2.5%]">
							<img
								src="img/assets/silver-pin.svg"
								alt=""
								className="h-auto w-full"
							/>
						</div>
						<div className="pin absolute right-[10%] top-[30%] z-40 w-[3.5%] sm:left-[9.75%] sm:top-[24.75%] sm:w-[2.5%]">
							<img
								src="img/assets/silver-pin.svg"
								alt=""
								className="h-auto w-full"
							/>
						</div>
						<div className="pin absolute right-[47.5%] top-[21.25%] z-40 w-[3.5%] sm:right-[52%] sm:top-[22.5%] sm:w-[2.5%]">
							<img
								src="img/assets/silver-pin.svg"
								alt=""
								className="h-auto w-full"
							/>
						</div>

						<div className="pin absolute left-[5.5%] top-[25%] z-40 w-[3.5%] sm:left-[77.5%] sm:top-[28%] sm:w-[2.5%]">
							<img
								src="img/assets/silver-pin.svg"
								alt=""
								className="h-auto w-full"
							/>
						</div>
						<div
							className={`${shadows.className} absolute left-[15%] top-[32.5%] w-[15%] rotate-[12deg] font-semibold sm:top-[31%]`}
						>
							<p className="text-center text-[1.5cqw] text-red-800">
								Heist
							</p>
							<p className="text-center text-[1.5cqw] text-red-800">
								starts at 9:00
							</p>
						</div>
					</div>
					<div className="absolute left-[36%] top-[74.5%] w-[30%] sm:left-[83%] sm:top-[70%] sm:w-[12.5%] lg:left-[77.5%] lg:top-[35%] lg:w-[17.5%]">
						<img
							src="/img/assets/blank-tape-stickers3.svg"
							alt=""
							className="h-auto w-full"
						/>
						<h1
							className={`lg:top[20%] absolute left-[14%] top-[15%] -rotate-[5deg] text-[4.5cqw] font-medium sm:text-[1.5cqw] lg:left-[15%] lg:text-[2.75cqw] ${shadows.className}`}
						>
							Help Wanted
						</h1>
						<div className="pin absolute hidden sm:right-[49%] sm:top-[7.5%] sm:block sm:w-[10%]">
							<img
								src="/img/assets/silver-pin.svg"
								alt=""
								className="h-auto w-full"
							/>
						</div>
					</div>
					<div className="absolute left-[1%] top-[68%] w-[35%] rotate-3 hover:scale-110 sm:left-[82%] sm:top-[43%] sm:w-[18%] sm:-rotate-3 md:left-[80%] lg:left-[75%] lg:w-[25%]">
						<img
							src="/img/assets/blank-tape-stickers1.svg"
							alt=""
							className="h-auto w-full"
						/>
						<h1
							className={`absolute right-[30%] top-[20%] text-[4.5cqw] font-extrabold text-red-800 sm:right-[25%] sm:top-[18%] sm:text-[2.5cqw] lg:right-[30%] lg:text-[3.5cqw] ${shadows.className}`}
						>
							Register
						</h1>
					</div>
					<div className="absolute left-[22%] top-[83%] w-[25%] hover:scale-110 sm:left-[82%] sm:top-[50%] sm:w-[12.5%] lg:left-[72.5%] lg:top-[55%] lg:w-[17.5%]">
						<img
							src="/img/assets/blank-tape-stickers1.svg"
							alt=""
							className="h-auto w-full"
						/>
						<h1
							className={`absolute left-[32.5%] top-[20%] text-[2.75cqw] font-medium sm:left-[25%] sm:top-[10%] sm:text-[1.75cqw] lg:top-[12.5%] lg:text-[2.75cqw] ${shadows.className}`}
						>
							Mentors
						</h1>
					</div>
					<div className="absolute left-[54.5%] top-[83%] w-[25%] hover:scale-110 sm:left-[87%] sm:top-[55%] sm:w-[12.5%] lg:left-[80%] lg:top-[63%] lg:w-[17.5%]">
						<img
							src="/img/assets/blank-tape-stickers1.svg"
							alt=""
							className="h-auto w-full"
						/>
						<h1
							className={`absolute left-[32.5%] top-[20%] text-[2.75cqw] font-medium sm:left-[27.5%] sm:top-[10%] sm:text-[1.75cqw] lg:left-[30%] lg:top-[12.5%] lg:text-[2.75cqw] ${shadows.className}`}
						>
							Judges
						</h1>
					</div>
					<div className="absolute left-[37%] top-[90%] w-[25%] hover:scale-110 sm:left-[82%] sm:top-[60%] sm:w-[12.5%] lg:left-[72.5%] lg:top-[72%] lg:w-[17.5%]">
						<img
							src="/img/assets/blank-tape-stickers1.svg"
							alt=""
							className="h-auto w-full"
						/>
						<h1
							className={`absolute left-[27.5%] top-[20%] text-[2.75cqw] font-medium sm:left-[17.5%] sm:top-[10%] sm:text-[1.75cqw] lg:left-[20%] lg:top-[12.5%] lg:text-[2.75cqw] ${shadows.className}`}
						>
							Volunteers
						</h1>
					</div>
					<div className="pin absolute bottom-[16.5%] left-[12.5%] z-40 w-[3.5%] sm:bottom-[24.5%] sm:left-[44.5%] sm:w-[2%]">
						<img
							src="img/assets/silver-pin.svg"
							alt=""
							className="h-auto w-full"
						/>
					</div>
				</div>
			</section>
		</>
	);
}
