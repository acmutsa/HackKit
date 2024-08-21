import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { cookies } from 'next/headers';
import { Analytics } from '@vercel/analytics/react';
import { defaultTheme } from 'config';
import Script from 'next/script';
import { Alata } from 'next/font/google';
import meta from '../../public/img/meta.png'

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
        <head>
          {/* HTML Meta Tags */}
          <title>sunhacks - September 2024</title>
          <meta name="description" content="Join us for sunhacks on September 28 at the SDFC, ASU Tempe!" />

          {/* Google / Search Engine Tags */}
          <meta itemProp="name" content="sunhacks - September 2024" />
          <meta itemProp="description" content="Join us for sunhacks on September 28 at the SDFC, ASU Tempe!" />
          <meta itemProp="image" content={meta.src} />

          {/* Facebook Meta Tags */}
          <meta property="og:url" content="https://sunhacks.io/" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="sunhacks - September 2024" />
          <meta property="og:description" content="Join us for sunhacks on September 28 at the SDFC, ASU Tempe!" />
          <meta property="og:image" content={meta.src} />

          {/* Twitter Meta Tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="sunhacks - September 2024" />
          <meta name="twitter:description" content="Join us for sunhacks on September 28 at the SDFC, ASU Tempe!" />
          <meta name="twitter:image" content={meta.src} />

          {/* Meta Tags Generated via https://heymeta.com */}
        </head>
        <body className={`${theme === 'dark' ? 'dark' : ''} ${font.className}`}>
          {children}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}

export const runtime = 'edge';
