import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Horizon | Product board",
  description: "A focused product planning board"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
