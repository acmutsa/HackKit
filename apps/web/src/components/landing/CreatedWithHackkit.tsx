import Image from "next/image";
import Link from "next/link";

import { Shadows_Into_Light } from "next/font/google";

const shadowsIntoLight = Shadows_Into_Light({
	weight: "400",
	subsets: ["latin"],
});

export default function CreatedWithHackkit() {
	return (
		<div className="flex items-center gap-x-2 rounded-lg border-black bg-transparent py-[6px] pl-[7px] pr-4">
			<Image
				src="/img/logo/hackkit.svg"
				alt="HackKit Logo"
				width={35}
				height={35}
			/>
			<div className="flex text-sm">
				<Link
					href="https://github.com/acmutsa/HackKit"
					className={`${shadowsIntoLight.className} text-center hover:underline`}
				>
					Created with HackKit
				</Link>
			</div>
		</div>
	);
}
