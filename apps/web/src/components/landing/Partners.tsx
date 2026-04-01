import partnerData from "./partners.json";
import PartnerCard from "./PartnerCard";
import Image from "next/image";
import { Shadows_Into_Light } from "next/font/google";

const shadowsIntoLight = Shadows_Into_Light({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-shadows",
});

type Partner = {
	name: string;
	logo: string;
	url: string;
	tier: string;
};

export default async function Partners() {
	return (
		<section className="relative flex min-h-screen w-full h-fit flex-col items-center justify-center gap-y-10 border-y-2 border-muted-foreground">

			<div
			className={`w-[50vw] md:w-[20wh] h-fit bg-contain bg-center bg-no-repeat ${shadowsIntoLight.className} -rotate-6 drop-shadow-[2px_5px_1px_rgba(0,0,0,0.35)]`}
			style={{backgroundImage: "url('/img/sponsors/sponsors-header-background.svg')",}}
			>
				<p className="font-shadows text-black text-2xl md:text-4xl lg:text-6xl text-center p-6">
				Sponsors
				</p>
			</div>

		
			<div className="relative w-full h-fit">

				<div className="absolute inset-0 flex justify-end items-center w-full pt-[5vh] sm:h-[50vh] md:h-[65vh] lg:h-[80vh] xl:h-[90vh] 2xl:h-[100vh] h-[50vh]">
					<Image
						src="/img/sponsors/sponsors-background.svg"
						alt="sponsors-background"
						fill
						className="object-contain object-right px-[5vw]"
					/>
				</div>

				<div className="relative z-20 flex flex-wrap mx-auto justify-start items-center gap-5 lg:gap-12 w-[90%] sm:w-[90%] h-fit  pt-8 sm:pt-10 md:pt-[3.5rem] lg:pt-[4rem] pb-2 sm:pb-8 lg:pb-12 overflow-y-hidden overflow-x-visible no-scrollbar">
					{partnerData.partners.map((partner: Partner, index: number) => (
						<PartnerCard key={partner.name} partner={partner} is_title={false} index={index} />
					))}
				</div>
	  		</div>

		</section>
	);
}
