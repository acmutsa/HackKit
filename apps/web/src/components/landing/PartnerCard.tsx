import React from "react";
import Link from "next/link";
import Image from "next/image";
enum Tier {
  In_Kind_Partner = 1,
  Rowdy_Partner,
  Bronze,
  Silver,
  Gold,
  Title,
}

type Partner = {
  name: string;
  logo: string;
  url: string;
  tier: Tier;
};

// TODO Create tier color map based off of value
// Fix to add styling based off of sizes of the screen
const tierBorderMap = {
  [Tier.Title]:           "w-[15rem] sm:w-72 md:w-72      lg:w-80      2xl:w-[19rem]",
  [Tier.Gold]:            "w-[12.75rem]      sm:w-[14.75rem] md:w-[16rem] lg:w-72      2xl:w-[19rem]",
  [Tier.Silver]:          "w-[11rem] sm:w-52 md:w-60      lg:w-[16rem] 2xl:w-[17rem]",
  [Tier.Bronze]:          "w-32      sm:w-40 md:w-[12rem] lg:w-[14rem] 2xl:w-[16rem]",
  [Tier.Rowdy_Partner]:   "w-[7rem]  sm:w-32 md:w-40      lg:w-[11rem] 2xl:w-[13rem]",
  [Tier.In_Kind_Partner]: "w-[6rem]  sm:w-[7rem] md:w-32  lg:w-40      2xl:w-52",
};


function PartnerCard(partner: Partner) {
  
  return (
    <Link
      href={partner.url}
      className={`p-3 sm:p-5 mx-auto my-auto opacity-100 sm:opacity-85  sm:hover:opacity-100 ${
        partner.tier > 4
          ? "hover:scale-[1.10] sm:hover:scale-[1.30]"
          : "hover:scale-[1.05] sm:hover:scale-[1.20]"
      }  transition-all duration-350 ease-in-out `}>
      <Image
        src={`/img/partner-logos/${partner.logo}`}
        width={0}
        height={0}
        quality={100}
        // Come back and add the md: to the styling
        alt={`${partner.name} logo`}
        className={`h-auto ${tierBorderMap[partner.tier]}`}
      />
    </Link>
  );
}

export default PartnerCard;
