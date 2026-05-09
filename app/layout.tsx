import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vitanova Marketing Center",
  description: "Internal bilingual brand library, claim safety, and prompt center for Vitanova marketing."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
