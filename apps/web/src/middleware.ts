import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { publicRoutes } from "config";
import { bannedUsers } from "db/schema";
import { db } from "db";
import { eq } from "db/drizzle";
import { isComingSoonRoute } from "@/lib/feature_flags";

const isPublicRoute = createRouteMatcher(publicRoutes);

export default clerkMiddleware(async (auth, req) => {
	const pathname = req.nextUrl.pathname;

	if (pathname.startsWith("/@")) {
		return NextResponse.rewrite(
			new URL(`/user/${pathname.replace("/@", "")}`, req.url),
		);
	}

	if (pathname.startsWith("/~")) {
		return NextResponse.rewrite(
			new URL(`/team/${pathname.replace("/~", "")}`, req.url),
		);
	}

	if (pathname === "/coming-soon") {
		return NextResponse.next();
	}

	// rewrite selected routes to the coming soon page before auth runs
	if (isComingSoonRoute(pathname)) {
		return NextResponse.rewrite(new URL("/coming-soon", req.url));
	}

	if (!isPublicRoute(req)) {
		await auth.protect();

		const authData = await auth();

		const isBanned = !!(await db.query.bannedUsers.findFirst({
			where: eq(bannedUsers.userID, authData.userId!),
		}));

		if (isBanned) {
			return NextResponse.rewrite(new URL("/suspended", req.url));
		}
	}

	return NextResponse.next();
});

export const config = {
	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api)(.*)"],
};