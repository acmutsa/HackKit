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
  // Christian Walker: Aware of weird bug from 1280px to 1286 px where background dissapears
  const marathon: Partner = {
    name: "Amazon",
    logo: "amazon-w500px.png",
    url: "https://amazon.jobs",
    tier: "Planet Sponsor",
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col gap-y-10 items-center justify-center border-y-2 border-muted-foreground">
      {/* <div className="w-full flex flex-col items-center justify-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-black text-center">
          Partners Sections
        </h1>
        <h3 className="text-lg md:text-2xl font-bold text-center px-4 lg:px-0">
          {
            "See the Partners Component inside components/landing/Partners for an example"
          }
        </h3>
      </div> */}
      {/* Example Code of what our previous partner section looked like */}
      <h1 className="z-20 text-4xl sm:text-5xl md:text-6xl font-bold font-oswald italic text-center pt-7 sm:pb-8">
        A Huge Thanks To Our sunhacks Partners!
      </h1>

      <div className="z-20 flex justify-center items-center w-full h-full pt-12">
        <PartnerCard partner={marathon} is_title={true}/>
      </div>
     
      <div className="z-20 grid place-items-center justify-center grid-flow-row grid-cols-1 sm:grid-cols-1 gap-10 lg:gap-12 w-[98%] pt-8 sm:pt-10 md:pt-[3.5rem] lg:pt-[4rem] pb-2 sm:pb-8 lg:pb-12 overflow-y-hidden overflow-x-visible no-scrollbar">
        {partnerData.partners.map((partner: Partner) => (
          <PartnerCard key={partner.name} partner={partner} is_title={false} />
        ))}
      </div>
    </section>
  );
}
