import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nazmul Hasan | Business Analyst & Digital Strategist",
  description:
    "Professional portfolio of Nazmul Hasan Peeal — business analysis, digital strategy, and modern web solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full bg-[#07080d] text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
