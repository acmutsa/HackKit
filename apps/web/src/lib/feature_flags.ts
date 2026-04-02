export const featureFlags = {
	comingSoonMode: process.env.COMING_SOON_MODE === "true",
};

export const comingSoonRoutes = [
	"/faq",
	"/register",
] as const;

export function isComingSoonRoute(pathname: string) {
	return (
		featureFlags.comingSoonMode &&
		comingSoonRoutes.some(
			(route) => pathname === route || pathname.startsWith(`${route}/`),
		)
	);
}