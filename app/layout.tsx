// app/layout.tsx

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import { QueryProvider } from "@/providers/QueryProvider";
import { AuthInitializer } from "@/components/AuthInitializer";
import { ToastProvider } from "@/components/providers/ToastProvider";

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://books.evasue.net"),

  title: {
    default: "EvaSUE Books",
    template: "%s | EvaSUE Books",
  },

  description:
    "Official landing page for EvaSUE Publishing and the first EvaSUE book launch.",

  keywords: [
    "EvaSUE",
    "EvaSUE Books",
    "EvaSUE Publishing",
    "Christian books",
    "Christian publishing",
    "Book launch",
    "Ethiopia",
  ],

  openGraph: {
    title: "EvaSUE Books",
    description:
      "Discover EvaSUE's first publication and learn about the official book launch.",
    url: "https://books.evasue.net",
    siteName: "EvaSUE Books",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/logo/logo.svg",
        width: 512,
        height: 512,
        alt: "EvaSUE Books",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "EvaSUE Books",
    description:
      "Discover EvaSUE's first publication and official launch event.",
    images: ["/logo/logo.svg"],
  },

  icons: {
    icon: "/logo/logo.svg",
    apple: "/logo/logo.svg",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white">
        <QueryProvider>
          <ToastProvider />
          <AuthInitializer />

          <main className="flex-1">{children}</main>
        </QueryProvider>
      </body>
    </html>
  );
}