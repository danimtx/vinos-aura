// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { EB_Garamond } from 'next/font/google';
import Navbar from '../components/Navbar'; // Tu componente Navbar
import Footer from '../components/Footer'; // Tu componente Footer
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';
import { Toaster } from 'react-hot-toast'; // Importar Toaster de react-hot-toast
import Chatbot from '../components/Chatbot';

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  variable: '--font-eb-garamond',
  weight: ['400', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Vinos Aura",
  description: "Página web de Vinos Aura",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={ebGaramond.variable}>
      <body>
        {/* AuthProvider debe envolver a CartProvider y el resto de la aplicación */}
        <AuthProvider>
          <CartProvider>
            <Navbar />
            {children}
            <Footer />
            {/* Renderizar el Toaster para las notificaciones globales */}
            <Toaster
              position="bottom-right" // Puedes cambiar la posición (top-left, top-center, etc.)
              reverseOrder={false} // Para que los nuevos toasts aparezcan debajo de los viejos
              toastOptions={{
                duration: 3000, // Duración por defecto de los toasts
                style: {
                  borderRadius: '10px',
                  background: '#333',
                  color: '#fff',
                },
              }}
            />
            {/* Renderizar el Chatbot */}
            <Chatbot />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}