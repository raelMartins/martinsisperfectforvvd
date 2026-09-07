import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Martins × vvd",
  description: "A Product Engineer introduction, iMessage style.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
