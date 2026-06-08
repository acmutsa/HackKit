import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	if (pathname.startsWith("/@")) {
		const tag = pathname.slice(2);
		return NextResponse.rewrite(new URL(`/user/${tag}`, request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
