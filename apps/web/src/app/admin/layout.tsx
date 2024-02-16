import c from "config";
import Image from "next/image";
import { db } from "db";
import { auth } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/shadcn/ui/button";
import DashNavItem from "@/components/dash/shared/DashNavItem";
import { eq } from "db/drizzle";
import { users } from "db/schema";
import FullScreenMessage from "@/components/shared/FullScreenMessage";
import ProfileButton from "@/components/dash/shared/ProfileButton";
import { Suspense } from "react";
import ClientToast from "@/components/shared/ClientToast";
import { redirect } from "next/navigation";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const { userId } = auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.clerkID, userId),
  });

  if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
    console.log("Denying admin access to user", user);
    return (
      <FullScreenMessage
        title="Access Denied"
        message="You are not an admin. If you belive this is a mistake, please contact a administrator."
      />
    );
  }

  return (
    <>
      <ClientToast />
      <div className="w-full h-16 px-5 grid grid-cols-2 bg-nav fixed z-20">
        <div className="flex items-center gap-x-4">
          <Image
            src={c.icon.svg}
            alt={c.hackathonName + " Logo"}
            width={32}
            height={32}
          />
          <div className="bg-muted-foreground h-[45%] rotate-[25deg] w-[2px]" />
          <h2 className="font-bold tracking-tight">Admin</h2>
        </div>
        <div className="items-center justify-end gap-x-4 md:flex hidden">
          <Link href={"/"}>
            <Button variant={"outline"} className="bg-nav hover:bg-background">
              Home
            </Button>
          </Link>
          <Link href={"/guide"}>
            <Button variant={"outline"} className="bg-nav hover:bg-background">
              Survival Guide
            </Button>
          </Link>
          <Link href={c.links.discord}>
            <Button variant={"outline"} className="bg-nav hover:bg-background">
              Discord
            </Button>
          </Link>
          <ProfileButton />
        </div>
        <div className="items-center justify-end gap-x-4 md:hidden flex"></div>
      </div>
      <div className="w-full h-12 px-5 flex bg-nav border-b-border border-b fixed mt-16 z-20">
        {Object.entries(c.dashPaths.admin).map(([name, path]) => (
          <DashNavItem key={name} name={name} path={path} />
        ))}
      </div>
      <Suspense fallback={<p>Loading...</p>}>{children}</Suspense>
    </>
  );
}

export const runtime = "edge";
