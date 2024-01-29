import React from "react";
import Link from "next/link";
import Image from "next/image";

enum Tier {
  In_Kind =1,
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
    <Link href={partner.url} className="p-4 border border-dashed">
      <Image
        src={`/img/partner-logos/${partner.logo}`}
        width={600}
        height={455}
        alt={`${partner.name} logo`}
      />
    </Link>
  );
}

export default PartnerCard;
