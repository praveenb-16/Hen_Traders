import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Balamurugan Traders / பாலமுருகன் ட்ரேடர்ஸ்",
  description: "Poultry trading daily ledger",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}