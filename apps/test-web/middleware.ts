import { NextResponse, type NextRequest } from "next/server";

const AUTH_ROUTE_PATHS = new Set(["/sign-in", "/sign-up"]);
const PUBLIC_ROUTE_PATHS = new Set([
	"/",
	"/favicon.ico",
	"/registration-closed",
	"/suspended",
]);
const PUBLIC_ROUTE_PREFIXES = [
	"/api/",
	"/i/approval",
	"/schedule",
	"/user/",
];
const PROTECTED_ROUTE_PREFIXES = [
	"/admin",
	"/dashboard",
	"/invites",
	"/onboarding",
	"/pass",
	"/register",
	"/rsvp",
	"/settings",
	"/teams",
];

function hasAuthSessionCookie(request: NextRequest): boolean {
	return request.cookies
		.getAll()
		.some((cookie) => cookie.name.includes("better-auth.session_token"));
}

function isPublicRoute(pathname: string): boolean {
	return (
		PUBLIC_ROUTE_PATHS.has(pathname) ||
		AUTH_ROUTE_PATHS.has(pathname) ||
		PUBLIC_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix))
	);
}

function isProtectedRoute(pathname: string): boolean {
	return PROTECTED_ROUTE_PREFIXES.some(
		(prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
	);
}

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const hasSession = hasAuthSessionCookie(request);

	if (pathname.startsWith("/@")) {
		const tag = pathname.slice(2).split("/")[0];
		if (tag) {
			return NextResponse.rewrite(new URL(`/user/${tag}`, request.url));
		}
	}

	if (AUTH_ROUTE_PATHS.has(pathname) && hasSession) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	if (!hasSession && isProtectedRoute(pathname) && !isPublicRoute(pathname)) {
		const signInUrl = new URL("/sign-in", request.url);
		signInUrl.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
		return NextResponse.redirect(signInUrl);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
