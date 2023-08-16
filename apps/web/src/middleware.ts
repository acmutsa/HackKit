import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
	publicRoutes: ["/", /^\/schedule(\/.*)?$/, /^\/@/, /^\/user\//, "/404"],
	afterAuth: (auth, req, evt) => {
		if (req.nextUrl.pathname.startsWith("/@")) {
			return NextResponse.rewrite(
				new URL(`/user/${req.nextUrl.pathname.replace("/@", "")}`, req.url)
			);
		}
		if (req.nextUrl.pathname.startsWith("/~")) {
			return NextResponse.rewrite(
				new URL(`/team/${req.nextUrl.pathname.replace("/~", "")}`, req.url)
			);
		}
	},
});

export const config = {
	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
