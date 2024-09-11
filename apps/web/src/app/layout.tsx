import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { cookies } from "next/headers";
import { Analytics } from "@vercel/analytics/react";
import { defaultTheme } from "config";
import localFont from "next/font/local";
import { Metadata } from "next";

const bttf = localFont({
	src: "../../public/fonts/BTTF.ttf",
	variable: "--font-bttf",
});

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const theme = cookies().get("hk_theme")?.value || defaultTheme;
	return (
		<ClerkProvider>
			<html lang="en" className={bttf.variable}>
				<body className={theme === "dark" ? "dark" : ""}>
					{children}
					<Analytics />
				</body>
			</html>
		</ClerkProvider>
	);
}

export const runtime = "edge";
export const metadata: Metadata = {
	title: "Rowdyhacks X",
	description:
		"RowdyHacks is a free, weekend-long, overnight hackathon hosted by UTSA! Students can join us to network, code, collaborate, and compete. We welcome hackers from all disciplines, backgrounds, & technical levels!",
};
