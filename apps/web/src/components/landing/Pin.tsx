import Image from "next/image";

export default function Pin({
	name = "/img/assets/silver-pin.svg",
	size = 25,
	className = "",
	no_thread = false,
	no_img = false, 
}: {
	name?: string;
	size?: number;
	className?: string;
	no_thread?: boolean;
	no_img?: boolean;
	maxSize?: number;
}) {
	return (
		<div
			aria-hidden="true"
			className={`shrink-0 drop-shadow-[2px_4px_2px_rgba(0,0,0,0.65)] w-[calc(var(--pin-size)*0.55)] h-[calc(var(--pin-size)*0.55)] md:w-[calc(var(--pin-size)*0.75)] md:h-[calc(var(--pin-size)*0.75)] lg:w-[var(--pin-size)] lg:h-[var(--pin-size)] ${className} ${no_thread ? "" : "pin"}`}
			style={{ "--pin-size": `${size}px` } as React.CSSProperties}
		>
			{!no_img && (
				<div className="relative h-full w-full">
					<Image src={name} alt="" fill className="object-contain" />
				</div>
			)}
		</div>
	);
}
