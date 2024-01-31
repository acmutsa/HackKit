import React from "react";
import Link from "next/link";
import Image from "next/image";

enum Tier {
  In_Kind_Partner = 1,
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

function PartnerCard(partner: Partner) {
  return (
    // Change border colors to adapt to tier
    // border-2 rounded-full border-blue-300

    // We will create a carousel that will be used for smaller screens
    <Link href={partner.url} className="p-4  mx-auto my-auto ">
      <Image
        src={`/img/partner-logos/${partner.logo}`}
        width={200}
        height={300}
        quality={100}
        alt={`${partner.name} logo`}
      />
    </Link>
  );
}

export default PartnerCard;
