import "./src/env.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
	swcMinify: true,
	transpilePackages: ["db"],
	images: {
		domains: ["images.clerk.dev", "www.gravatar.com", "img.clerk.com", "api.dicebear.com"],
		remotePatterns: [
			{
				hostname: "**.blob.vercel-storage.com",
			},
		],
	},
	experimental: {
		serverActions: {
			// If you are working with the QR scanner and using a proxy service, swap the hostname below with your proxy service hostname
			allowedOrigins: ["gh7xtpdz-3000.usw3.devtunnels.ms", "localhost:3000"],
		},
	},
};

export default nextConfig;
