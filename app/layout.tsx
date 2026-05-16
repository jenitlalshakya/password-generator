import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteName = "Password Generator";
const siteDescription =
  "Free online password generator to create strong, secure, random passwords instantly. Customize length, symbols, numbers, and letters — no login required.";
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const isProduction =
  process.env.NEXT_PUBLIC_IS_PRODUCTION === "true";

const ogImage = `${siteUrl}/og-image.png`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: `${siteName} — Secure Random Passwords`,
    template: `%s | ${siteName}`,
  },

  description: siteDescription,
  applicationName: siteName,

  keywords: [
    "password generator",
    "secure password",
    "random password",
    "random password tool",
    "strong password",
    "password maker",
    "online password generator",
    "client-side password generator",
  ],

  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,

  robots: {
    index: isProduction,
    follow: isProduction,
    googleBot: {
      index: isProduction,
      follow: isProduction,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName,
    title: `${siteName} — Secure Random Passwords`,
    description: siteDescription,

    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Password Generator - Secure Random Password Tool",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: `${siteName} — Secure Random Passwords`,
    description: siteDescription,

    images: [ogImage],
  },

  alternates: {
    canonical: siteUrl,
  },

  category: "technology",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  colorScheme: "light dark",
};

const RootLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
