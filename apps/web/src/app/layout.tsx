import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { cookies } from "next/headers";
import { defaultTheme, themeTokens } from "config";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const theme = cookies().get("hk_theme")?.value || defaultTheme;

	const buildVars = (map: Record<string, string>) =>
		Object.entries(map)
			.map(([k, v]) => `--${k}: ${v};`)
			.join("\n");

	const cssVars = `:root {\n${buildVars(themeTokens.light)}\n}\n.dark {\n${buildVars(
		themeTokens.dark as Record<string, string>,
	)}\n}`;
	return (
		<ClerkProvider>
			<html lang="en">
				<body className={theme === "dark" ? "dark" : ""}>
					<style dangerouslySetInnerHTML={{ __html: cssVars }} />
					{children}
				</body>
			</html>
		</ClerkProvider>
	);
}

export const runtime = "edge";
