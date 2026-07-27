import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";

const futura = Jost({
  subsets: ["latin"],
  variable: "--font-futura",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Tautin — Link in Bio",
  description: "Halaman link-in-bio Tautin",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={futura.variable}>
      <body>{children}</body>
    </html>
  );
}
