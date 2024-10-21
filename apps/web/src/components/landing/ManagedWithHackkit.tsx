import Image from "next/image";
import c from "config";
import HackkitIcon from "../../../public/img/logo/hackkit.svg";

export default function ManagedByHackkit() {
	return (
		<div className="flex w-full flex-row items-center gap-x-2 rounded-lg bg-black py-[6px] pl-[7px] pr-4">
			<Image
				src={HackkitIcon}
				alt="HackKit Logo"
				width={35}
				height={35}
			/>
			<p className="w-full text-sm">Managed with HackKit</p>
		</div>
	);
}
