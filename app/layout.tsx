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

  title: {
    default: "EvaSUE Graduates and Alumni",
    template: "%s | EvaSUE",
  },

  openGraph: {
    title: "EvaSUE Graduates and Alumni",
    description:
      "Evangelical Students Union of Ethiopia (EvaSUE).",
    url: "https://books.evasue.net",
    siteName: "EvaSUE Graduates",
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