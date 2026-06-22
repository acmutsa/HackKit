import partnerData from "./partners.json";
import PartnerCard from "./PartnerCard";
import Image from "next/image";
import { Shadows_Into_Light } from "next/font/google";
import Pin from "./Pin";

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
		<section
			id="Sponsors"
			className="relative flex h-fit min-h-screen w-full flex-col items-center justify-center gap-y-6 py-10"
		>
			<div
				className={`relative h-fit w-[50vw] max-w-[440px] bg-contain bg-center bg-no-repeat ${shadowsIntoLight.className} -rotate-6 drop-shadow-[2px_5px_1px_rgba(0,0,0,0.35)]`}
				style={{
					backgroundImage:
						"url('/img/sponsors/sponsors-header-background.svg')",
				}}
			>
				<Pin size={12} className="absolute left-[8%] top-[12%] z-30" />
				<Pin size={12} className="absolute right-[8%] top-[12%] z-30" />
				<p className="font-shadows p-6 text-center text-2xl text-black md:text-4xl lg:text-6xl">
					Sponsors
				</p>
			</div>

			<div className="relative h-fit w-full">
				<div className="absolute inset-0 flex h-[50vh] w-full items-center justify-end pt-[5vh] sm:h-[50vh] md:h-[65vh] lg:h-[80vh] xl:h-[90vh] 2xl:h-[100vh]">
					<Image
						src="/img/sponsors/sponsors-background.svg"
						alt="sponsors-background"
						fill
						className="object-contain object-right px-[5vw]"
					/>
					<Pin
						size={14}
						className="absolute left-[54%] top-[9%] z-30"
					/>
					<Pin
						size={14}
						className="absolute right-[7%] top-[10%] z-30"
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
			</div>
		</section>
	);
}
