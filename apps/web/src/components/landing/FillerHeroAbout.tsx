import Image from "next/image";

export default function Filler() {
	return (
		// Christian:  Purpose is to add a bit of fluff and affect between the hero and about section
		<div className="w-screen h-[200px] lg:h-[300px] 2xl:h-[350px] relative">
			<Image src={"/img/landing/filler.png"} alt="" fill className="object-fill w-full h-full" />
		</div>
	);
}
