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
    const marathon: Partner = {
        name: "Amazon",
        logo: "amazon.png",
        url: "https://amazon.jobs",
        tier: "Planet Sponsor",
    };

    return (
        <section className="relative min-h-screen w-full flex flex-col gap-y-10 items-center justify-center border-y-2 border-muted-foreground">
            <h1 className="z-20 text-4xl sm:text-5xl md:text-6xl font-bold font-oswald italic text-center pt-7 sm:pb-8">
                A Huge Thanks To Our sunhacks Partners!
            </h1>

            <div className="z-20 flex justify-center items-center w-full h-full pt-8"> {/* Reduced padding */}
                <PartnerCard partner={marathon} is_title={true} />
            </div>

            <div className="z-20 grid place-items-center justify-center grid-flow-row grid-cols-1 sm:grid-cols-1 gap-10 lg:gap-12 w-[98%] pt-4 sm:pt-6 md:pt-8 lg:pt-10 pb-2 sm:pb-8 lg:pb-12 overflow-y-hidden overflow-x-visible no-scrollbar"> {/* Reduced top padding */}
                {partnerData.partners.map((partner: Partner) => (
                    <PartnerCard key={partner.name} partner={partner} is_title={false} />
                ))}
            </div>
        </section>
    );
}
