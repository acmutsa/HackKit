import "./src/env.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
	swcMinify: true,
	images: {
		domains: ["images.clerk.dev", "www.gravatar.com", "img.clerk.com", "api.dicebear.com"],
		remotePatterns: [
			{
				hostname: "**.blob.vercel-storage.com",
			},
		],
	},
};

export default nextConfig;
