import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { cookies } from 'next/headers';
import { Analytics } from '@vercel/analytics/react';
import { defaultTheme } from 'config';
import Script from 'next/script';
import { Alata } from 'next/font/google';


const font = Alata({
  subsets: ['latin'],
  weight: '400',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = cookies().get('hk_theme')?.value || defaultTheme;
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${theme === 'dark' ? 'dark' : ''} ${font.className}`}>
          {children}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const theme = cookies().get("hk_theme")?.value || defaultTheme;
	return (
		<ClerkProvider>
			<html lang="en">
				<body className={theme === "dark" ? "dark" : ""}>
					{children}
					<Analytics />
				</body>
			</html>
		</ClerkProvider>
	);

}

export const runtime = 'edge';
