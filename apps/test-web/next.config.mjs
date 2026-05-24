/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: [
		"@hackkit/core",
		"@hackkit/ui",
		"@hackkit/next",
		"@hackkit/auth-better-auth",
	],
};

export default nextConfig;
