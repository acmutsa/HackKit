import { authMiddleware } from "@clerk/nextjs";

const privateRoutes = "/dash/(.*)";

export default authMiddleware({
	publicRoutes: ["/"],
});

export const config = {
	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api)(.*)"],
	//   matcher: ["/dash/:path*"],
};
