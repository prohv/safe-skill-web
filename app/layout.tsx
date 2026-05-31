import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const clashDisplay = localFont({
  src: "./fonts/ClashDisplay-Variable.woff2",
  variable: "--font-clash",
  weight: "500",
  display: "swap",
});

const satoshi = localFont({
  src: "./fonts/Satoshi-Variable.woff2",
  variable: "--font-satoshi",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SafeSkill — Safe MCP Skill Scanner",
  description:
    "Discover, scan, and deploy safe MCP skills. Security intelligence layer for your AI toolkit.",
  icons: {
    icon: "/safeskill-logo.svg",
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
      className={`${clashDisplay.variable} ${satoshi.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
