import partnerData from "./partners.json";
import PartnerCard from "./PartnerCard";
// Partner should have an enum type

enum Tier {
  In_Kind_Partner =1,
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
    <section className="min-h-screen w-full bg-green-800 lg:bg-[url('/img/landing/Cave_Design_test.svg')] bg-no-repeat bg-cover flex flex-col gap-y-10 items-center justify-center">
      <h1 className=" text-4xl sm:text-5xl md:text-6xl font-bold font-oswald italic text-[#7D9037] text-center pt-7">
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
