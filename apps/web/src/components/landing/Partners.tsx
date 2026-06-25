import partnerData from "./partners.json";
import PartnerCard from "./PartnerCard";
import Image from "next/image";
import { Manuale, Shadows_Into_Light } from "next/font/google";
import Pin from "./Pin";

const shadowsIntoLight = Shadows_Into_Light({
	weight: "400",
	subsets: ["latin"],
	variable: "--font-shadows",
});

const manuale = Manuale({
	subsets: ["latin"],
	display: "swap",
});

type Partner = {
	name: string;
	logo: string;
	url: string;
	tier: string;
};

function DossierPins() {
	return (
		<>
		<Pin className="absolute left-[70%] top-[18%] z-30 sm:left-[70%] sm:top-[15%] md:left-[69%] md:top-[17%] lg:left-[60%] lg:top-[10%]"/>
		<Pin className="absolute left-[50%] top-[0%] z-30 lg:left-[50%] lg:top-[3%]" />
		<Pin className="absolute left-[26%] top-[26%] z-30 sm:left-[26%] sm:top-[23%] md:left-[30%] md:top-[22%] lg:left-[38%] lg:top-[23%]" />

		<Pin no_thread className="absolute left-[50%] top-[62%] z-30 sm:top-[53%] md:top-[49%] lg:top-[45%]" />
		</>
	);
}

export default async function Partners() {
	return (
		<section id="Sponsors" className="relative w-full flex items-center justify-center pb-[0vw] sm:pb-[3vw] md:pb-[5vw]">
			<DossierPins />

			<div className="relative flex flex-col items-center justify-center gap-y-6 py-10">

				<div
					className={`relative h-fit w-[65vw] sm:w-[60vw] md:w-[50vw] lg:w-[30vw] bg-contain bg-center bg-no-repeat ${shadowsIntoLight.className} -rotate-6 drop-shadow-[2px_5px_1px_rgba(0,0,0,0.35)]`}
					style={{
						backgroundImage:
							"url('/img/sponsors/sponsors-header-background.svg')",
					}}
				>

					<p className="font-shadows p-6 text-center text-black sm:text-lg md:text-xl lg:text-2xl xl:text-4xl 2xl:text-5xl">
						Sponsors
					</p>
				</div>

				<div
					className={`relative h-fit w-[70vw] bg-contain bg-center bg-no-repeat ${shadowsIntoLight.className} rotate-4 drop-shadow-[2px_5px_1px_rgba(0,0,0,0.35)]`}
					style={{
						backgroundImage:
							"url('/img/sponsors/sponsors-header-background.svg')",
					}}
				>

					<p className="font-shadows p-6 text-center text-black sm:text-lg md:text-xl lg:text-2xl xl:text-4xl 2xl:text-5xl">
						Currently under investigation  
					</p>
				</div>

				{/* <div className="relative h-fit w-full">
					<div className="absolute inset-0 flex h-[100vh] w-full items-center justify-end pt-[5vh] sm:h-[50vh] md:h-[100vh] lg:h-[80vh] xl:h-[90vh] 2xl:h-[100vh]">
						<Image
							src="/img/sponsors/sponsors-background.svg"
							alt="sponsors-background"
							fill
							className="object-contain object-right px-[5vw] rotate-[10deg] drop-shadow-[6px_8px_3px_rgba(0,0,0,0.45)]"
						/>
					</div>

					<div className="no-scrollbar relative mx-auto flex h-fit w-[90%] flex-wrap items-center justify-start gap-5 overflow-y-hidden overflow-x-visible pb-2 pt-8 sm:w-[90%] sm:pb-8 sm:pt-10 md:pt-[3.5rem] lg:gap-12 lg:pb-12 lg:pt-[4rem]">
						{partnerData.partners.map(
							(partner: Partner, index: number) => (
								<PartnerCard
									key={partner.name}
									partner={partner}
									is_title={false}
									index={index}
								/>
							),
						)}
						{Array.from({ length: 6 }, (_, index) => (
							<PartnerCard
								key={`sponsor-placeholder-${index}`}
								partner={{
									name: "Logo",
									logo: "",
									url: "",
									tier: "",
								}}
								is_title={false}
								index={partnerData.partners.length + index}
							/>
						))}
					</div>
				</div> */}
			</div>
		</section>
	);
}
