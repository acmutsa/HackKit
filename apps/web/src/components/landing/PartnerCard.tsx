import React from "react";
import Link from "next/link";
import Image from "next/image";

type Partner = {
    name: string;
    logo: string;
    url: string;
    tier: string;
};

const tierColorMap: { [key: string]: string } = {
    "Title Sponsor": "text-purple-500",
    "Gold Sponsor": "text-yellow-600",
    "Silver Sponsor": "text-gray-400",
    "Bronze Sponsor": "text-amber-800",
    "Rowdy Partner": "text-blue-500",
    "Rowdy In-Kind": "text-red-500",
};

function PartnerCard({ partner, is_title }: { partner: Partner; is_title: boolean }) {
    const text: string = is_title
        ? "text-2xl sm:text-3xl xl:text-4xl 2xl:text-[3rem]"
        : "text-md sm:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl";

    const height: string = is_title
        ? "h-[18rem] sm:h-[20rem] md:h-[22rem] lg:h-[24rem] xl:h-[26rem] 2xl:h-[28rem]"
        : "h-[12rem] sm:h-[14rem] md:h-[16rem] lg:h-[18rem] xl:h-[20rem] 2xl:h-[22rem]";

    const image: string = is_title
        ? "w-[20rem] sm:w-[22rem] md:w-[24rem] lg:w-[26rem] xl:w-[28rem] 2xl:w-[30rem]"
        : "w-[12rem] sm:w-[14rem] md:w-[16rem] lg:w-[18rem] xl:w-[20rem] 2xl:w-[22rem]";

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
                    className={`h-auto ${image}`}
                />
            </div>
            <h2
                className={`transition duration-300 ease-in-out delay-100 w-full text-center ${
                    is_title ? "pb-8" : "pb-4"
                } invisible group-hover:visible group-hover:translate-y-4`}>
                {partner?.name}
            </h2>
            <h2 className="transition duration-300 ease-in-out delay-75 w-full text-center pb-4 invisible group-hover:visible group-hover:translate-y-4">
                {partner?.tier}
            </h2>
        </Link>
    );
}

export default PartnerCard;
