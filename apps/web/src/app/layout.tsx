import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { cookies } from "next/headers";
import { Analytics } from "@vercel/analytics/react";
import { defaultTheme } from "config";
import localFont from "next/font/local";
import { Oswald } from "next/font/google";

const bttf = localFont({
	src: "../../public/fonts/BTTF.ttf",
	variable: "--font-bttf",
});

const oswald = Oswald({
	subsets: ["latin"],
	variable: "--font-oswald",
	display: "swap",
});

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const theme = cookies().get("hk_theme")?.value || defaultTheme;
	return (
		<ClerkProvider>
			<html lang="en" className={`${bttf.variable} ${oswald.variable}`}>
				<body className={theme === "dark" ? "dark" : ""}>
					{children}
					<Analytics />
				</body>
			</html>
		</ClerkProvider>
	);
}

export const runtime = "edge";
