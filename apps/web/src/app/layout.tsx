import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { cookies } from "next/headers";
import { Analytics } from "@vercel/analytics/react";
import { defaultTheme } from "config";
import { Racing_Sans_One } from "next/font/google";
import "@/components/shadcn/Hyperspeed.css";

const racing = Racing_Sans_One({
	subsets: ["latin"],
	weight: "400",
	variable: "--font-racing",
});

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const theme = cookies().get("hk_theme")?.value || defaultTheme;
	return (
		<ClerkProvider>
			<html lang="en">
				<body
					className={`${racing.variable} ${
						theme === "dark" ? "dark" : ""
					}`}
				>
					{children}
					<Analytics />
				</body>
			</html>
		</ClerkProvider>
	);
}

export const runtime = "edge";
