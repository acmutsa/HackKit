import partnerData from "./partners.json";
import PartnerCard from "./PartnerCard";
import Image from "next/image";



type Partner = {
  name: string;
  logo: string;
  url: string;
  tier: string;
};

// Async in order to avoid hydration errors
export default async function Partners() {
  // Christian Walker: Aware of weird bug from 1280px to 1286 px where background dissapears
  const marathon: Partner = {
    name: "Marathon",
    logo: "marathon_logo.svg",
    url: "https://www.marathonpetroleum.com/",
    tier: "Title Sponsor",
  };

  return (
    <section className="relative h-full w-full bg-[rgb(108,60,38)] bg-no-repeat bg-cover flex flex-col gap-y-10 items-center justify-center">
      <Image
        className="h-full w-full object-fil"
        src="/img/landing/Partner_BG.svg"
        fill
        priority={true}
        quality={100}
        alt="BG img"
      />
      <h1 className="z-20 text-4xl sm:text-5xl md:text-6xl font-bold font-oswald italic text-[#FEF2E6] text-center pt-7 sm:pb-8">
        A Huge Thanks To Our Rowdyhacks Partners!
      </h1>
      {/* Add Marathon on it's own */}
      <div className="z-20 flex justify-center items-center w-full h-full pt-12">
        <PartnerCard partner={marathon} is_title={true}/>
      </div>
      {/* Maybe floating effect instead? */}
      {/* Make responsive also go and change the text size in partner card */}
      <div className="z-20 grid place-items-center justify-center grid-flow-row grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-10 lg:gap-12 w-[98%] pt-8 sm:pt-10 md:pt-[3.5rem] lg:pt-[4rem] pb-2 sm:pb-8 lg:pb-12 overflow-y-hidden overflow-x-visible no-scrollbar">
        {partnerData.partners.map((partner: Partner) => (
          <PartnerCard key={partner.name} partner={partner} is_title={false} />
        ))}
      </div>
    </section>
  );
}
