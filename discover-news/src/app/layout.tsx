import type { Metadata } from 'next';
import './globals.css';
import Script from 'next/script';
import Header from '../app/components/Header';
import Footer from '../app/components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://YOUR-DOMAIN.com'),
  title: {
    default: 'Your News Site',
    template: '%s · Your News Site',
  },
  description: 'Fast, mobile-first explainers and news you can trust.',
  openGraph: {
    title: 'Your News Site',
    description: 'Fast, mobile-first explainers and news you can trust.',
    url: 'https://YOUR-DOMAIN.com',
    siteName: 'Your News Site',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
  other: { robots: 'max-image-preview:large' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google AdSense – replace with your real publisher id */}
        {/* Remove this block until you are approved by AdSense if needed */}
        <Script
          id="adsbygoogle-lib"
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen antialiased text-zinc-900">
        <Header />
        <main className="mx-auto max-w-3xl px-4 sm:px-6 py-6">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
