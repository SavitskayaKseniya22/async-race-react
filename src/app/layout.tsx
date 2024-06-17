import type { Metadata } from "next";
import { Jura } from "next/font/google";
import "./globals.css";
import Footer from "./lib/Footer";
import Header from "./lib/Header";

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
      <body className={`${jura.className} flex h-svh w-svw flex-col justify-between`}>
        <Header></Header>
        {children}
        <Footer></Footer>
      </body>
    </html>
  );
}
