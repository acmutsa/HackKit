import partnerData from "./partners.json";
import PartnerCard from "./PartnerCard";
// Partner should have an enum type

enum Tier {
  In_Kind =1,
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

export default async function Partners() {
  return (
    <section className="bg-[#3D5A30] min-h-screen w-full flex flex-col gap-y-36 items-center justify-center">
      <h1 className="text-6xl font-bold font-oswald italic text-[#7D9037] text-center">
        Partners
      </h1>
      <div className="FIXME">
        {partnerData.partners.map((partner: Partner) => (
          <PartnerCard key={partner.name} {...partner} />
        ))}
      </div>
    </section>
  );
}
