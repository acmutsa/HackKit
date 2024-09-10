import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { publicRoutes } from "config";

export default authMiddleware({
	publicRoutes,
	beforeAuth: (req) => {
		if (req.nextUrl.pathname.startsWith("/@")) {
			return NextResponse.rewrite(
				new URL(
					`/user/${req.nextUrl.pathname.replace("/@", "")}`,
					req.url,
				),
			);
		}
		if (req.nextUrl.pathname.startsWith("/~")) {
			return NextResponse.rewrite(
				new URL(
					`/team/${req.nextUrl.pathname.replace("/~", "")}`,
					req.url,
				),
			);
		}
		return NextResponse.next();
	},
});

export const config = {
	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
