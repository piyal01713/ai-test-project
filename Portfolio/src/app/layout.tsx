import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nazmul Hasan Peeal | Portfolio",
  description: "Business Analyst and Former Web Developer. Enterprise meets edgy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
