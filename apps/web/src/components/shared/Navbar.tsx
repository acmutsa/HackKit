import Link from "next/link";
import Image from "next/image";
import c from "config";
import { Button } from "../shadcn/ui/button";
import ProfileButton from "../dash/shared/ProfileButton";
import { auth, currentUser } from "@clerk/nextjs";
import NavBarLinksGrouper from "./NavBarLinksGrouper";



export default async function Navbar() {
	const user = await currentUser();


	return (
    <div className="fixed top-0 w-screen h-16 bg-nav z-50 border-b-border border-b">
      <div className="w-full h-full mx-auto max-w-7xl lg:max-w-full px-5 grid grid-cols-3">
        <div className="flex items-center justify-start gap-x-5 col-span-2">
          <Link href={"/"} className="flex items-center gap-x-2 mr-5">
            <Image
              src={c.icon.svg}
              alt={c.hackathonName + " Logo"}
              width={32}
              height={32}
            />
            {/* <div className="bg-muted-foreground h-[45%] rotate-[25deg] w-[2px]" /> */}
            <h2 className="font-bold tracking-tight">{c.hackathonName}</h2>
          </Link>

          {/* In it's own div as this needs to dissapear at medium in order to render on smaller screen properly */}
          <div className="hidden md:flex items-center justify-start gap-x-5 col-span-2">
            <NavBarLinksGrouper />
          </div>
        </div>
        <div className="items-center justify-end flex space-x-3">
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
                    variant={
                      user.publicMetadata.registrationComplete
                        ? "outline"
                        : "default"
                    }
                    className={
                      user.publicMetadata.registrationComplete
                        ? "bg-nav hover:bg-background"
                        : ""
                    }>
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
          <ProfileButton />
        </div>
      </div>
    </div>
  );
}

export const runtime = "edge";
