import Image from "next/image";
import Link from "next/link";
import { Button } from "../shadcn/ui/button";

export default function Hero() {
	
	return (
    <section className="grid grid-cols-1 w-full overflow-hidden">
      <div className="min-h-screen w-full flex flex-col items-center justify-center relative">
        <div className="absolute top-[-30vh] left-[20%] -translate-x-5 h-[110vh] w-[225px] bg-white blur-3xl opacity-20 -rotate-[50deg]"></div>
        <div className="relative">
          <div className="absolute bg-hackathon blur-3xl opacity-10 w-full h-full rounded-3xl"></div>
          <div className="grid grid-cols-2 h-min z-10">
            <div className="relative">
              <Image
                src="/img/logo/hackkit-md.png"
                alt="HackKit Logo"
                fill
                className="object-contain"
              />
            </div>
            <div className="flex py-5 z-10">
              <h1 className="font-black text-8xl md:text-8xl text-hackathon dark:text-transparent dark:bg-gradient-to-tl dark:from-hackathon/80 dark:to-white dark:bg-clip-text">
                Hack
                <br />
                Kit
              </h1>
            </div>
          </div>
          <p className="text-md text-center text-muted-foreground font-bold pl-5 pt-10">
            Feature-packed Hackathon managment software <u>that just works</u>.
          </p>
        </div>
      </div>
      <div className="absolute top-[80vh] items-center justify-center flex flex-wrap w-full gap-x-2 gap-y-4">
        <Link href={"https://github.com/acmutsa/hackkit"}>
          <Button variant={"outline"} size={"lg"}>
            GitHub
          </Button>
        </Link>
        <Link href={"https://github.com/acmutsa/hackkit"}>
          <Button variant={"outline"} size={"lg"}>
            Docs
          </Button>
        </Link>
        <Link href={"https://github.com/acmutsa/hackkit"}>
          <Button variant={"outline"} size={"lg"}>
            Channel Log
          </Button>
        </Link>
        <div className="h-0 basis-full" />
        <div className="max-h-[50px] overflow-hidden">
          <Link
            href={"https://vercel.com/?utm_source=ACM%20UTSA&utm_campaign=oss"}>
            <img
              src="/img/powered-by-vercel.svg"
              alt="Powered by Vercel"
              className="border-[#5D5D5D] border rounded-lg overflow-hidden bg-black"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
