import Image from "next/image";
export default function SilverPin({ name = "/img/silver-pin.svg", size = 10 }: { name?: string, size?: number }) {
    return (
        <div className="pin relative drop-shadow-[2px_4px_2px_rgba(0,0,0,0.65)]" style={{ width: `${size * 0.2}vw`, height: `${size * 0.2}vw` }}>
            <Image
                src={name}
                alt="pin"
                fill
                className="object-contain"
            />
        </div>
    )
}

