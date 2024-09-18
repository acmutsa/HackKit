import partnerData from "./partners.json";
import PartnerCard from "./PartnerCard";
import Image from "next/image";

type Partner = {
	name: string;
	logo: string;
	url: string;
	tier: string;
};

export default async function Partners() {
	// Christian Walker: Aware of weird bug from 1280px to 1286 px where background dissapears
	const marathon: Partner = {
		name: "Marathon",
		logo: "marathon_logo.svg",
		url: "https://www.marathonpetroleum.com/",
		tier: "Title Sponsor",
	};

	return (
		<section className="relative flex min-h-screen w-full flex-col items-center justify-center gap-y-10 border-y-2 border-muted-foreground">
			<div className="flex w-full flex-col items-center justify-center space-y-4">
				<h1 className="text-center text-4xl font-black md:text-5xl">
					Partners Sections
				</h1>
				<h3 className="px-4 text-center text-lg font-bold md:text-2xl lg:px-0">
					{
						"See the Partners Component inside components/landing/Partners for an example"
					}
				</h3>
			</div>
		</section>
	);
}
