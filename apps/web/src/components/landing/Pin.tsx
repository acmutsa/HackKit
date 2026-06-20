import Image from "next/image";

export default function Pin({
	name = "/img/silver-pin.svg",
	size = 10,
	className = "",
	no_thread = false,
	maxSize = 34,
}: {
	name?: string;
	size?: number;
	className?: string;
	no_thread?: boolean;
	maxSize?: number;
}) {
	return (
		<div
			aria-hidden="true"
			className={`shrink-0 drop-shadow-[2px_4px_2px_rgba(0,0,0,0.65)] ${className} ${no_thread ? "" : "pin"}`}
			style={{
				width: `clamp(10px, ${size * 0.2}vw, ${maxSize}px)`,
				height: `clamp(10px, ${size * 0.2}vw, ${maxSize}px)`,
				zIndex: 40,
			}}
		>
			<div className="relative h-full w-full">
				<Image src={name} alt="" fill className="object-contain" />
			</div>
		</div>
	);
}
