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
    <section className="bg-[#3D5A30] min-h-screen w-full flex flex-col gap-y-10 items-center justify-center">
      <h1 className=" text-5xl sm:text-5xl md:text-6xl font-bold font-oswald italic text-[#7D9037] text-center pt-7">
        A Huge Thanks To Our Rowdyhacks Partners!
      </h1>
      {/* Render Carousel view if it is smaller than a certain width */}
      <div className="flex justify-center items-center w-[80%] h-auto flex-wrap pb-12 space-y-8">
        {partnerData.partners.map((partner: Partner) => (
          <PartnerCard key={partner.name} {...partner} />
        ))}
      </div>
    </section>
  );
}
