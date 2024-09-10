import Image from "next/image";
import Link from "next/link";
import { Instagram, Facebook, Twitter, Github } from "lucide-react";
import c from "config";
import { camelCaseToWords } from "@/lib/utils/shared/camelCaseToWords";
import FooterLinks from "./FooterLinks";

export default function Footer() {
  return (
    <section className="w-full items-center justify-center min-h-[25vh] border-t-2 bg-white border-muted-foreground sm:p-8 p-1 py-8 md:px-10">
      <div className="grid sm:grid-cols-4 lg:grid-cols-5 grid-cols-2 gap-y-8 md:justify-items-center lg:justify-items-start">
        <div className="sm:row-span-3 flex items-center lg:row-span-1 font-black col-span-2 row-span-1 lg:justify-self-start justify-self-center">
          <Image
            className="w-20 sm:w-28"
            src="/img/logo/rhbttf.svg"
            alt="RowdyHacks Logo"
            width={100}
            height={50}
          />
          <h1 className="font-bttf pl-0 pr-2 sm:text-4xl text-3xl bg-gradient-to-b from-orange-600 via-yellow-300 text-transparent bg-clip-text to-orange-600">
            HACK&lt;
            <br></br>&future&gt;
          </h1>
        </div>
        {Object.entries(c.footerLinkItems).map(([title, data], idx) => (
          <FooterLinks title={camelCaseToWords(title)} data={data} key={idx} />
        ))}
        <div className="col-span-2 lg:col-span-1 justify-self-center">
          <Link href="https://vercel.com">
            <Image
              className="select-none"
              src="/img/powered-by-vercel.svg"
              alt="Powered by Vercel"
              width={200}
              height={10}
            />
          </Link>
        </div>
        <div className="w-[200px] bg-black h-[41px] rounded-lg col-span-2 lg:col-span-1 flex gap-2 px-2 lg:col-start-5 justify-between items-center justify-self-center">
          <Link href="https://twitter.com/rowdyhacks/">
            <Twitter className="invert dark:invert-0" />
          </Link>
          <Link href="https://www.instagram.com/rowdyhacks/">
            <Instagram className="invert dark:invert-0" />
          </Link>
          <Link href="https://www.facebook.com/UTSA.ACM">
            <Facebook className="invert dark:invert-0" />
          </Link>
          <Link href="https://github.com/acmutsa/RowdyHacksX">
            <Github className="invert dark:invert-0" />
          </Link>
          <Link href="https://go.rowdyhacks.org/discord">
            <Image
              className="select-none"
              src="/img/landing/discord_icon.svg"
              alt="Discord logo"
              width={20}
              height={20}
            />
          </Link>
        </div>
        <p className="text-center md:py-0 text-xs sm:col-start-2 self-center lg:row-start-2 lg:w-11/12 justify-self-center col-span-2 text-orange-500 lg:col-start-2 lg:col-span-3 font-mono">
          Made with &lt;/&gt; &amp; ♥ @ RowdyHacks
          <br />© RowdyHacks &amp; Association of Computing Machinery at
          UTSA2024. All Rights Reserved.
        </p>
      </div>
    </section>
  );
}
