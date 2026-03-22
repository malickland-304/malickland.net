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
    "MalickLand — WV Real Estate Agency serving the Eastern Panhandle. Licensed agent Phil Malick helps buyers, sellers, and investors in Berkeley, Jefferson, Morgan, Hampshire, Hardy & Mineral counties.",
  keywords: [
    "West Virginia real estate agency",
    "WV real estate agency",
    "WVREA",
    "MalickLand",
    "WV homes for sale",
    "Eastern Panhandle real estate",
    "Romney WV realtor",
    "Berkeley County homes",
    "Jefferson County WV",
    "Hampshire County real estate",
    "Phil Malick realtor",
  ],
  authors: [{ name: "Phil Malick" }],
  creator: "MalickLand — WV Real Estate Agency",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://malickland.net",
    siteName: "MalickLand — WV Real Estate Agency",
    title: "MalickLand | WV Real Estate Agency",
    description:
      "MalickLand — WV Real Estate Agency. Eastern Panhandle specialists. Buy, sell, or invest with Phil Malick.",
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
