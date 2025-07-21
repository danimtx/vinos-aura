import type { Metadata } from "next";
//import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { EB_Garamond } from 'next/font/google'
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  variable: '--font-eb-garamond',
  weight: ['400', '700'],
  display: 'swap',
})

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Vinos Aura",
  description: "somos una empresa dedicada a la venta de vinos de alta calidad, ofreciendo una experiencia única para los amantes del vino.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={ebGaramond.variable}>
      <body
        //className={`${geistSans.variable} ${geistMono.variable} antialiased`}

      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
