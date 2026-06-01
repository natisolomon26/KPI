// app/layout.tsx (updated)
import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: {
    default: "EvaSUE - Evangelical Students' and Graduates' Union of Ethiopia",
    template: "%s | EvaSUE",
  },
  description: "A platform that empowers graduates to grow spiritually, connect professionally, and serve meaningfully beyond campus life.",
  keywords: ["EvaSUE", "alumni network", "graduates", "Ethiopia", "Christian professionals", "Kingdom impact"],
  authors: [{ name: "EvaSUE" }],
  creator: "EvaSUE",
  publisher: "EvaSUE",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: "EvaSUE - Evangelical Students' and Graduates' Union of Ethiopia",
    description: "Join our global alumni network for Kingdom impact. Connect, grow, and serve beyond campus life.",
    url: "https://evasue.org",
    siteName: "EvaSUE",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EvaSUE - Kingdom Impact Alumni Network",
    description: "Join our global alumni network for Kingdom impact. Connect, grow, and serve beyond campus life.",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}>
      <body className="min-h-full flex flex-col bg-white">
        <QueryProvider>
          <ToastProvider />
          <AuthInitializer />
          
          <main className="flex-1">
            {children}
          </main>
        </QueryProvider>
      </body>
    </html>
  );
}