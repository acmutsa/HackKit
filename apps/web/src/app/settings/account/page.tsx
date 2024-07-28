import AccountSettings from "@/components/settings/AccountSettings";
import { users } from "db/schema";
import { eq } from "db/drizzle";
import { auth } from "@clerk/nextjs";
import { db } from "db";
import { redirect } from "next/navigation";

export default async function Page() {
  const { userId } = auth();
  const user = await db.query.users.findFirst({
    with: { registrationData: true },
    where: eq(users.clerkID, userId!),
  });
  if (!user) return redirect("/sign-in");
  return <AccountSettings user={user} />;
}

export const runtime = "edge";
