import Link from "next/link";
import Image from "next/image";
import c from "config";
import { Button } from "../shadcn/ui/button";
import ProfileButton from "./ProfileButton";
import { auth, currentUser } from "@clerk/nextjs";
import NavBarLinksGrouper from "./NavBarLinksGrouper";
import { Oswald } from "next/font/google";
import { cn } from "@/lib/utils/client/cn";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

interface NavbarProps {
  className?: string;
}

export default async function Navbar({ className }: NavbarProps) {
  const user = await currentUser();
  return (
    <div className="w-screen z-50">
      <div
        className={cn(
          `top-0 w-screen h-16 bg-nav relative z-50 border-b-border border-b ${oswald.variable}`,
          className
        )}>
        <div className="w-full h-full mx-auto max-w-7xl lg:max-w-full px-2 sm:px-6 lg:px-8  grid grid-flow-col grid-cols-2">
          <div className="flex items-center justify-start gap-x-5 col-span-2">
            <Link href={"/"} className="flex items-center gap-x-2 mr-5">
              <Image
                src={c.icon.svg}
                alt={c.hackathonName + " Logo"}
                width={32}
                height={32}
              />
              {/* <div className="bg-muted-foreground h-[45%] rotate-[25deg] w-[2px]" /> */}
              <h2 className="font-bold font-bold text-lg dark:text-[#FEF2E6] text-[#A7866A]">
                {c.hackathonName}
              </h2>
            </Link>
            <div className="hidden md:flex items-center justify-start gap-x-5 col-span-2">
              <NavBarLinksGrouper />
            </div>
          </div>

          <div className="items-center justify-between md:justify-center flex space-x-2">
            <div className="gap-x-4 md:flex hidden">
              {user ? (
                <>
                  <Link
                    href={
                      user.publicMetadata.registrationComplete
                        ? "/dash"
                        : "/register"
                    }>
                    <Button
                      variant={"outline"}
                      className="bg-nav hover:bg-background">
                      {user.publicMetadata.registrationComplete
                        ? "Dashboard"
                        : "Complete Registration"}
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href={"/sign-in"}>
                    <Button
                      variant={"outline"}
                      className="bg-nav hover:bg-background">
                      Sign In
                    </Button>
                  </Link>
                  <Link href={"/register"}>
                    <Button>Register</Button>
                  </Link>
                </>
              )}
            </div>
              <ProfileButton/>
          </div>
        </div>
      </div>
    </div>
  );
}

export const runtime = "edge";
