import partnerData from "./partners.json";
import PartnerCard from "./PartnerCard";
import Image from "next/image";
// Partner should have an enum type

enum Tier {
  In_Kind_Partner = 1,
  Rowdy_Partner,
  Bronze,
  Silver,
  Gold,
  Title
}

type Partner = {
  name: string;
  logo: string;
  url: string;
  tier: Tier
};

// Async in order to avoid hydration errors
export default async function Partners() {
  return (
    <section className=" relative h-full w-full bg-[rgb(108,60,38)] bg-no-repeat bg-cover flex flex-col gap-y-10 items-center justify-center">
      <Image
        className="absolute"
        src="/img/landing/Partner_BG.svg"
        fill
        priority={true}
        quality={100}
        alt="BG img"
      />
      <h1 className=" text-4xl sm:text-5xl md:text-6xl font-bold font-oswald italic text-[#FEF2E6] text-center pt-7">
        A Huge Thanks To Our Rowdyhacks Partners!
      </h1>
      <div className="z-20 flex justify-center items-center w-full md:w-full h-auto flex-wrap pb-12 space-y-8 md:pt-8">
        {partnerData.partners.map((partner: Partner) => (
          <PartnerCard key={partner.name} {...partner} />
        ))}
      </div>
    </section>
  );
}
