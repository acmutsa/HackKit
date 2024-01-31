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

const tierBorderMap = {
  [Tier.Title]: "border-purple-900",
  [Tier.Gold]: "border-green-700",
  [Tier.Silver]: "border-gray-500",
  [Tier.Bronze]:'border-amber-700',
  [Tier.Rowdy_Partner]: 'border-blue-600'
};


function PartnerCard(partner: Partner) {
  return (
    // We will create a carousel that will be used for smaller screens
    // Also need to make it so that Marathon is held on it's own pedestal
    <Link href={partner.url} className={`p-2 sm:p-12 mx-auto my-auto border-blue opacity-50 hover:opacity-100 hover:scale-150 transition-all duration-350`}>
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
