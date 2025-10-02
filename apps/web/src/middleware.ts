import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { publicRoutes } from "config";
import { bannedUsers } from "db/schema";
import { db } from "db";
import { eq } from "db/drizzle";

const isPublicRoute = createRouteMatcher(publicRoutes);

export default clerkMiddleware(async (auth, req) => {
	if (req.nextUrl.pathname.startsWith("/@")) {
		return NextResponse.rewrite(
			new URL(`/user/${req.nextUrl.pathname.replace("/@", "")}`, req.url),
		);
	}
	if (req.nextUrl.pathname.startsWith("/~")) {
		return NextResponse.rewrite(
			new URL(`/team/${req.nextUrl.pathname.replace("/~", "")}`, req.url),
		);
	}

	if (!isPublicRoute(req)) {
		await auth.protect();

		const isBanned = !!(await db.query.bannedUsers.findFirst({
			where: eq(bannedUsers.userID, (await auth()).userId!),
		}));

		if (isBanned) {
			return NextResponse.rewrite(new URL("/suspended", req.url));
		}
	}

	return NextResponse.next();
});

export const config = {
	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
