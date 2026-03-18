import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import PageTransition from "@/components/layout/PageTransition";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Zyphr — Empowering Dreams. Engineering Reality.",
    template: "%s | Zyphr",
  },
  description:
    "Zyphr is a modern software company delivering web, mobile, cloud, and AI solutions that empower businesses to thrive in the digital age.",
  metadataBase: new URL("https://zyphr.co.in"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Zyphr",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1 pt-[72px]">
          <PageTransition>{children}</PageTransition>
        </main>
      </body>
    </html>
  );
}
