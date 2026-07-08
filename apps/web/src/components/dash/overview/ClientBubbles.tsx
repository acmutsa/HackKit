"use client";

import { useTimer } from "react-timer-hook";
import { Manuale, Shadows_Into_Light } from "next/font/google";
import Pin from "@/components/landing/Pin";

const manuale = Manuale({
	subsets: ["latin"],
	display: "swap",
});
const shadow = Shadows_Into_Light({
	subsets: ["latin"],
	weight: "400",
});

interface CountdownProps {
	title: string;
	date: Date;
}

export function Countdown({ title, date }: CountdownProps) {
	const { seconds, minutes, hours, days } = useTimer({
		expiryTimestamp: date,
	});
	function DossierPins() {
		return (
			<>
				<Pin className="absolute left-[90%] top-[4%] z-40 min-[500px]:left-[7%] min-[500px]:top-[8%] md:hidden" />
				<Pin className="absolute left-[4%] top-[5%] z-40 min-[500px]:left-[93%] min-[500px]:top-[4%] md:left-[4%] md:top-[6%] lg:left-[-2%] lg:top-[51%]" />
				<Pin className="absolute left-[0%] top-[90%] z-40 min-[500px]:left-[90%] min-[500px]:top-[87%] md:left-[93%] md:top-[8%] lg:hidden" />
				<Pin className="absolute z-40 hidden lg:block lg:left-[90%] lg:top-[11%]" no_thread/>
			</>
		);
	}
	return (
		<div className={`relative flex min-h-[150px] flex-col justify-center p-5 text-foreground ${manuale.className}`}>
			<DossierPins />
			<img
				src={`/img/assets/dash/time-background.webp`}
				alt=""
				aria-hidden
				className="absolute inset-0 -z-10 h-full w-full object-cover drop-shadow-[6px_8px_3px_rgba(0,0,0,0.45)]"
			/>
 			<div className="flex justify-between px-[5%] text-sm">
 				<div className="flex flex-col items-center w-18">
 					<h2
						className="text-2xl font-black tabular-nums"
						suppressHydrationWarning
					>
						{String(days).padStart(2, "0")}
					</h2>
					<h3 className="font-bold">Days</h3>
				</div>
				<div className="flex flex-col items-center w-18">
					<h2
						className="text-2xl font-black tabular-nums"
						suppressHydrationWarning
					>
						{String(hours).padStart(2, "0")}
					</h2>
					<h3 className="font-bold">Hours</h3>
				</div>
				<div className="flex flex-col items-center w-18">
					<h2
						className="text-2xl font-black tabular-nums"
						suppressHydrationWarning
					>
						{String(minutes).padStart(2, "0")}
					</h2>
					<h3 className="font-bold">Minutes</h3>
				</div>
				<div className="flex flex-col items-center w-18">
					<h2
						className="text-2xl font-black tabular-nums" 
						suppressHydrationWarning
					>
						{String(seconds).padStart(2, "0")}
					</h2>
					<h3 className="font-bold">Seconds</h3>
				</div>
			</div>
			<div className={`text-md pt-[6%]  pl-[6%] text-[#AC1903] ${shadow.className}`}>
					Time To {title}
			</div>
		</div>
	);
}