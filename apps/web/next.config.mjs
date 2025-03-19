import { fileURLToPath } from "node:url";
import createJiti from "jiti";
import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";
const jiti = createJiti(fileURLToPath(import.meta.url));

jiti("./src/env");

/** @type {import('next').NextConfig} */
const nextConfig = {
	swcMinify: true,
	transpilePackages: ["db"],
	images: {
		domains: [
			"images.clerk.dev",
			"www.gravatar.com",
			"img.clerk.com",
			"api.dicebear.com",
			"cdn.discordapp.com",
		],
		remotePatterns: [
			{
				hostname: "**.blob.vercel-storage.com",
			},
		],
	},
	experimental: {
		serverActions: {
			allowedOrigins: ["localhost:3000"],
		},
	},
};

if (process.env.NODE_ENV === "development") {
	await setupDevPlatform();
}

export default nextConfig;
