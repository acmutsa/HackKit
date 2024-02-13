import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle } from "../shadcn/ui/card";


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

const tierBorderMap = {
  [Tier.Title]:           "w-[15rem]      sm:w-72           md:w-72       lg:w-80       2xl:w-[19rem]",
  [Tier.Gold]:            "w-[12.75rem]   sm:w-[14.75rem]   md:w-[16rem]  lg:w-72       2xl:w-[19rem]",
  [Tier.Silver]:          "w-[11rem]      sm:w-52           md:w-60       lg:w-[16rem]  2xl:w-[17rem] ",
  [Tier.Bronze]:          "w-32           sm:w-40           md:w-[12rem]  lg:w-[14rem]  2xl:w-[16rem]",
  [Tier.Rowdy_Partner]:   "w-[7rem]       sm:w-32           md:w-40       lg:w-[11rem]  2xl:w-[13rem]",
  [Tier.In_Kind_Partner]: "w-[6rem]       sm:w-[7rem]       md:w-32       lg:w-40       2xl:w-52",
};

const tierColorMap = {
  [Tier.Title]: "border-[3px] border-purple-700",
  [Tier.Gold]: "border-green-700",
  [Tier.Silver]: "border-gray-950",
  [Tier.Bronze]: "border-amber-800",
  [Tier.Rowdy_Partner]: "border-blue-500",
  [Tier.In_Kind_Partner]: "border-red-500",
};


// NOTE: Make responsive!!!
function PartnerCard(partner: Partner) {
  // rounded-xl bg-white bg-opacity-30
  return (
    <Link
      href={partner?.url}
      target="_blank"
      className={` p-3 sm:p-5 opacity-100 my-auto mx-auto hover:scale-[1.05] sm:hover:scale-[1.20] transition-all duration-350 ease-in-out`}>
      <Card
        className={`flex flex-col w-auto min-h-[25rem] shadow-none bg-[#d2b48c] bg-opacity-30 border-2 ${tierColorMap[partner?.tier]}`}>
        <CardHeader className="items-center">
          <CardTitle>{partner?.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex w-full h-full flex-col justify-center items-center my-auto">
          <Image
            src={`/img/partner-logos/${partner?.logo}`}
            width={0}
            height={0}
            quality={100}
            alt={`${partner?.name} logo`}
            className={`h-auto w-[11rem]      sm:w-52           md:w-60       lg:w-[16rem]  2xl:w-[17rem]`}
          />
        </CardContent>
      </Card>
    </Link>
  );
}

export default PartnerCard;
