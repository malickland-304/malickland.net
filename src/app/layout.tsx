import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MalickLand | WV Real Estate Agency",
    template: "%s | MalickLand",
  },
  description:
    "MalickLand is a West Virginia real estate agency serving the Eastern Panhandle — Berkeley, Jefferson, Morgan, Hampshire & Hardy counties. Licensed agent Phil Malick.",
  keywords: [
    "West Virginia real estate",
    "WV homes for sale",
    "Eastern Panhandle real estate",
    "Romney WV realtor",
    "Berkeley County homes",
    "Jefferson County WV",
    "Phil Malick realtor",
    "MalickLand",
  ],
  authors: [{ name: "Phil Malick" }],
  creator: "MalickLand",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://malickland.net",
    siteName: "MalickLand",
    title: "MalickLand | WV Real Estate Agency",
    description:
      "West Virginia real estate — Eastern Panhandle specialists. Buy, sell, or invest with Phil Malick.",
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
