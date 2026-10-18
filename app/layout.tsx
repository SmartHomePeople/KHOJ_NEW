import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { VisitorProvider } from "@/lib/visitor-store";
import NavigationBar from "@/components/NavigationBar";
import NamePrompt from "@/components/NamePrompt";

const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", weight: ["500", "600", "700"] });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["400", "500"] });

export const metadata: Metadata = {
  title: "KHOJ 2026 — Explore. Discover. Question.",
  description:
    "The digital layer over KHOJ, our triennial science fair. Explore the campus map, discover student projects, collect badges, and fill your KHOJ Passport.",
};

export const viewport: Viewport = {
  themeColor: "#0F1729",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <VisitorProvider>
	  render <NamePrompt />
          <div className="flex min-h-screen flex-col">
            <main className="flex-1 pb-20 md:pb-0">{children}</main>
            <NavigationBar />
          </div>
        </VisitorProvider>
      </body>
    </html>
  );
}
