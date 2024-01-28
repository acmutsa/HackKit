import React from "react";
import Link from "next/link";
import Image from "next/image";

type Partner = {
  name: string;
  logo: string;
  url: string;
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
