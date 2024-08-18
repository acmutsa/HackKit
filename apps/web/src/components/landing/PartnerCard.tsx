import React from "react";
import Link from "next/link";
import Image from "next/image";


type Partner = {
  name: string;
  logo: string;
  url: string;
  tier: string;
};

type colorMap = {
  key:string,
  value:string
}

// const tierBorderMap = {
//   [Tier.Title]:           "w-[15rem]      sm:w-72           md:w-72       lg:w-80       2xl:w-[19rem]",
//   [Tier.Gold]:            "w-[12.75rem]   sm:w-[14.75rem]   md:w-[16rem]  lg:w-72       2xl:w-[19rem]",
//   [Tier.Silver]:          "w-[11rem]      sm:w-52           md:w-60       lg:w-[16rem]  2xl:w-[17rem] ",
//   [Tier.Bronze]:          "w-32           sm:w-40           md:w-[12rem]  lg:w-[14rem]  2xl:w-[16rem]",
//   [Tier.Rowdy_Partner]:   "w-[7rem]       sm:w-32           md:w-40       lg:w-[11rem]  2xl:w-[13rem]",
//   [Tier.In_Kind_Partner]: "w-[6rem]       sm:w-[7rem]       md:w-32       lg:w-40       2xl:w-52",
// };



const tierColorMap:{[key:string]:string} =  {
  ["Title Sponsor"]: "text-purple-500",
 [ "Gold Sponsor"]: "text-yellow-600",
  ["Silver Sponsor"]: "text-gray-400",
  ["Bronze Sponsor"]: "text-amber-800",
  ["Rowdy Partner"]: "text-blue-500",
  ["Rowdy In-Kind"]: "text-red-500",
};


function PartnerCard({partner,is_title}:{partner:Partner,is_title:boolean}) {

  const text: string = is_title
    ? "text-2xl sm:text-3xl xl:text-4xl 2xl:text-[3rem]"
    : "text-md sm:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl";

  const height: string = is_title
    ? "h-[15rem] sm:h-[15rem] md:h-[16rem] lg:h-[20rem] xl:h-[20rem] 2xl:h-[22rem]"
    : "h-[9rem] sm:h-[11rem] md:h-[11rem] lg:h-[12rem] xl:h-[14rem] 2xl:h-[17rem]";
  const image: string = is_title
    ? "w-[17rem] sm:w-[17rem] md:w-[18rem] xl:w-[20rem] 2xl:w-[24rem]"
    : "w-[8rem] sm:w-[10rem] md:w-[14rem] lg:w-48 xl:w-[16rem]";

  return (
    <Link
      href={partner?.url}
      target="_blank"
      className={`group opacity-100 font-semibold hover:-translate-y-8 transition duration-350 ease-in-out  ${text} ${
        tierColorMap[partner?.tier]
      }`}>
      <div
        className={`flex items-center justify-center w-full ${height} shadow-none bg-[#d2b48c] bg-opacity-45 rounded-lg p-3`}>
        <Image
          src={`/img/partner-logos/${partner?.logo}`}
          width={300}
          height={300}
          quality={100}
          priority={true}
          alt={`${partner?.name} logo`}
          className={`h-auto  ${image}`}
        />
      </div>
      <h2
        className={`transition duration-300 ease-in-out delay-100  w-full text-center ${
          is_title ? "pb-8" : "pb-4"
        } invisible group-hover:visible group-hover:translate-y-4 `}>
        {partner?.name}
      </h2>
      <h2 className="transition duration-300 ease-in-out delay-75 w-full text-center pb-4 invisible group-hover:visible group-hover:translate-y-4  ">
        {partner?.tier}
      </h2>
    </Link>
  );
}

export default PartnerCard;
