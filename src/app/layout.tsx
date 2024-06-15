import type { Metadata } from "next";
import { Jura } from "next/font/google";
import "./globals.css";
import Footer from "./lib/Footer";

const jura = Jura({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Async race",
  description: "Game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jura.className} flex h-screen w-screen flex-col justify-between`}>
        {children}
        <Footer></Footer>
      </body>
    </html>
  );
}
