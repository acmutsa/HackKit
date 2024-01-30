import Link from "next/link";
import partnerData from "./partners.json";
import PartnerCard from "./PartnerCard";

type Partner = {
	name: string;
	logo: string;
	url: string;
};

export default async function Partners() {
	return (
		<section className="bg-[#3D5A30] min-h-screen w-full flex flex-col gap-y-36 items-center justify-center">
			<h1 className="text-6xl font-bold font-oswald italic text-[#7D9037] text-center">Partners</h1>

			{partnerData.partners.map((partner: Partner) => (
				<PartnerCard key={partner.name} {...partner} />
			))}

			{/* <Link href="/register">
				<button className="bg-[#FEF2E6] text-lg text-[#3D5A30] font-mono font-bold px-5 py-2 rounded flex items-center gap-x-2">
					Register Now <FaArrowAltCircleRight />
				</button>
			</Link> */}
		</section>
	);
}
