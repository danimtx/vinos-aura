// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Cormorant_Garamond, Outfit } from 'next/font/google';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Chatbot from '../components/Chatbot';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['300', '400', '500'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Vinos Aura | Elegancia y Tradición",
  description: "Descubre la pasión detrás de cada botella en Vinos Aura.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${cormorant.variable} ${outfit.variable}`}>
      <body className="bg-background text-foreground antialiased relative">
        <div className="noise-overlay pointer-events-none"></div>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="relative z-10 flex-grow">
              {children}
            </main>
            <Footer />
            <Toaster
              position="bottom-right"
              reverseOrder={false}
              toastOptions={{
                duration: 3000,
                style: {
                  borderRadius: '0px',
                  background: '#1A1A1A',
                  color: '#F5F5F0',
                  border: '1px solid #333',
                  fontFamily: 'var(--font-outfit)',
                },
              }}
            />
            <Chatbot />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}