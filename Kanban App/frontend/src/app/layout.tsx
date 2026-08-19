import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Glassmorphic Kanban Board",
  description: "A premium, client-rendered Kanban board MVP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
