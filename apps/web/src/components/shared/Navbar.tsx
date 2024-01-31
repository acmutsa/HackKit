import Link from "next/link";
import Image from "next/image";
import c from "config";
import { Button } from "../shadcn/ui/button";
import ProfileButton from "../dash/shared/ProfileButton";
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
    <div className="fixed w-screen z-50">
      <div
        className={cn(
          `top-0 w-screen h-16 bg-nav relative z-50 border-b-border border-b ${oswald.variable}`,
          className
        )}
      >
        <div className="w-full h-full mx-auto max-w-7xl px-5 grid grid-cols-3">
          <div className="flex items-center justify-start gap-x-5 col-span-2">
            <Link href={"/"} className="flex items-center gap-x-2 mr-5">
              <Image
                src={c.icon.svg}
                alt={c.hackathonName + " Logo"}
                width={32}
                height={32}
              />
              {/* <div className="bg-muted-foreground h-[45%] rotate-[25deg] w-[2px]" /> */}
              <h2 className="font-bold font-oswald text-lg dark:text-[#FEF2E6] text-[#A7866A]">
                {c.hackathonName}
              </h2>
            </Link>

            <NavBarLinksGrouper />
          </div>
          <div className="items-center justify-end gap-x-4 md:flex hidden">
            {user ? (
              <>
                <Link
                  href={
                    user.publicMetadata.registrationComplete
                      ? "/dash"
                      : "/register"
                  }
                >
                  <Button
                    variant={"outline"}
                    className="bg-nav hover:bg-background"
                  >
                    {user.publicMetadata.registrationComplete
                      ? "Dashboard"
                      : "Complete Registration"}
                  </Button>
                </Link>
                <ProfileButton />
              </>
            ) : (
              <>
                <Link href={"/sign-in"}>
                  <Button
                    variant={"outline"}
                    className="bg-nav hover:bg-background"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href={"/register"}>
                  <Button>Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="w-full h-0 relative">
        <Link
          id="mlh-trust-badge"
          className="max-w-[100px] min-w-[60px] absolute w-[10%] right-5 top-0 z-[10000]"
          // style="display:block;max-width:100px;min-width:60px;position:fixed;right:50px;top:0;width:10%;z-index:10000"
          href="https://mlh.io/na?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=2024-season&utm_content=black"
          target="_blank"
        >
          <Image
            src="https://s3.amazonaws.com/logged-assets/trust-badge/2024/mlh-trust-badge-2024-black.svg"
            alt="Major League Hacking 2024 Hackathon Season"
            width={0}
            height={0}
            className="aspect-auto w-full h-auto"
            style={{ width: "100%" }}
          />
        </Link>
      </div>
    </div>
  );
}

export const runtime = "edge";
