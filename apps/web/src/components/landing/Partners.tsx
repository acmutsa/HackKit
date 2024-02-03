import partnerData from "./partners.json";
import PartnerCard from "./PartnerCard";
// Partner should have an enum type

enum Tier {
  In_Kind_Partner =1,
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
  tier:Tier
};
// Async in order to avoid hydration errors
export default async function Partners() {
  return (
    <section className="h-full w-full bg-[#7a613d] bg-[url('/img/landing/Partner_BG.svg')] bg-no-repeat bg-cover flex flex-col gap-y-10 items-center justify-center">
      <h1 className=" text-4xl sm:text-5xl md:text-6xl font-bold font-oswald italic text-[#FEF2E6] text-center pt-7">
        A Huge Thanks To Our Rowdyhacks Partners!
      </h1>
      <div className="flex justify-center items-center w-full md:w-full h-auto flex-wrap pb-12 space-y-8 md:pt-8">
        {partnerData.partners.map((partner: Partner) => (
          <PartnerCard key={partner.name} {...partner} />
        ))}
      </div>
    </section>
  );
}
