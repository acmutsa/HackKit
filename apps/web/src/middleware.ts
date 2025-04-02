import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { publicRoutes } from "config";

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
	}

	return NextResponse.next();
});

export const config = {
	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
