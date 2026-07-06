import type * as React from "react";
import type { Metadata } from "next";
import { PublicSiteFooter } from "@hackkit/ui";
import { getPublicThemeStyle, publicSiteConfig } from "@/lib/public-site-config";
import "./globals.css";
import { AppBar } from "./app-bar";
import { Providers } from "./providers";

export const metadata: Metadata = {
	title: publicSiteConfig.brand.name,
	description: publicSiteConfig.brand.description,
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body style={getPublicThemeStyle()}>
				<Providers>
					<AppBar />
					{children}
					<PublicSiteFooter
						brandName={publicSiteConfig.brand.name}
						description={publicSiteConfig.brand.description}
						linkGroups={publicSiteConfig.footer.linkGroups}
						copyright={`${publicSiteConfig.event.name} · ${publicSiteConfig.event.dates} · ${publicSiteConfig.event.location}`}
					/>
				</Providers>
			</body>
		</html>
	);
}
