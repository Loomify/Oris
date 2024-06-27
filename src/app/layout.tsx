import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/front-page/Navbar";
import '@mantine/core/styles.css'
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Footer } from "@/components/front-page/Footer";

export const metadata: Metadata = {
  title: "Oris",
  description: "Oris is a open research platform for researchers, by researchers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>
          <Navbar />
          {children}
          <Footer />
        </MantineProvider>
      </body>
    </html>
  );
}
