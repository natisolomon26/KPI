// app/layout.tsx (updated)
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EvaSUE - Evangelical Students' and Graduates' Union of Ethiopia",
  description: "A platform that empowers graduates to grow spiritually, connect professionally, and serve meaningfully beyond campus life.",
  keywords: "EvaSUE, alumni network, graduates, Ethiopia, Christian professionals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}>
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          
          <main className="flex-1">{children}</main>
        </QueryProvider>
      </body>
    </html>
  );
}