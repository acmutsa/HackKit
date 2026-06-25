import { fileURLToPath } from "node:url";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import createJiti from "jiti";
const jiti = createJiti(fileURLToPath(import.meta.url));

jiti("./src/env");

/** @type {import('next').NextConfig} */
const nextConfig = {
	swcMinify: true,
	transpilePackages: ["db"],
	images: {
		remotePatterns: [
			{
				hostname: "**.blob.vercel-storage.com",
			},
			{ hostname: "images.clerk.dev" },
			{ hostname: "www.gravatar.com" },
			{ hostname: "img.clerk.com" },
			{ hostname: "api.dicebear.com" },
			{ hostname: "cdn.discordapp.com" },
		],
	},
	experimental: {
		serverActions: {
			allowedOrigins: ["localhost:3000"],
		},
	},
};

if (process.env.NODE_ENV === "development") {
	initOpenNextCloudflareForDev();
}

export default nextConfig;
