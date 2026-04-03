import "./globals.css";
import { cookies } from "next/headers";
import { defaultTheme } from "config";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const theme = cookies().get("hk_theme")?.value || defaultTheme;
	return (
			<html lang="en">
				<body className={theme === "dark" ? "dark" : ""}>
					{children}
				</body>
			</html>
	);
}
