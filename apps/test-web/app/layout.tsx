import type * as React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { AppBar } from "./app-bar";
import { Providers } from "./providers";

export const metadata: Metadata = {
	title: "HackKit UI Test App",
	description: "A small app for exercising HackKit Core and HackKit UI.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>
				<Providers>
					<AppBar />
					{children}
				</Providers>
			</body>
		</html>
	);
}
