import { Card, CardHeader, CardContent, CardTitle } from "@/components/shadcn/ui/card";
import { db } from "db";
import { sql } from "db/drizzle";
import { users } from "db/schema";
import { Users, UserCheck, User2,MailCheck } from "lucide-react";

export default async function Page() {
	const totalUserCount = await db
		.select({ count: sql<number>`count(*)`.mapWith(Number) })
		.from(users);

	const totalTeamCount = 0;
	const totalRSVPCount = 0;
	const totalCheckinCount = 0;

	return (
    <div className="w-full max-w-7xl mx-auto h-16 pt-44">
      <div className="grid grid-cols-4 gap-x-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registrations</CardTitle>
            <User2 />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUserCount[0].count}</div>
            {/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teams</CardTitle>
            <Users />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTeamCount}</div>
            {/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">RSVPs</CardTitle>
            <MailCheck/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRSVPCount}</div>
            {/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Check-ins</CardTitle>
            <UserCheck />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCheckinCount}</div>
            {/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export const runtime = "edge";
export const revalidate = 90;
