import "./src/env.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: ["images.clerk.dev", "www.gravatar.com"],
	},
};

export default nextConfig;
