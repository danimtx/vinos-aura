// src/app/cart/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { PlusIcon, MinusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext'; // Importa el contexto de autenticación

const colors = {
  crimson: '#B31B1B',
  warmBeige: '#D9C3A3',
  darkGray: '#3E3E3E',
  lightGrayBg: '#F5F5F5',
  white: '#FFFFFF',
  darkText: '#3E3E3E',
};

export default function CartPage() {
  const { cart, total, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth(); // Usamos isAuthenticated para el botón de compra

  return (
    <div className="font-['EB_Garamond'] py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: colors.lightGrayBg, color: colors.darkText }}>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-4xl font-bold mb-8 text-center" style={{ color: colors.crimson }}>
          Mi Carrito de Compras
        </h1>

        {cart.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-lg mb-4">Tu carrito está vacío.</p>
            <Link href="/vinos" passHref>
              <button
                className="px-8 py-3 rounded-md font-bold text-white transition-all duration-300 ease-in-out"
                style={{ backgroundColor: colors.crimson }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#8B1313')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.crimson)}
              >
                Explorar Vinos
              </button>
            </Link>
          </div>
        ) : (
          <div>
            {/* Encabezados de la tabla */}
            <div className="hidden md:grid grid-cols-5 gap-4 py-3 border-b-2 font-bold uppercase" style={{ borderColor: colors.warmBeige, color: colors.darkGray }}>
              <div className="col-span-2">Producto</div>
              <div className="text-center">Precio</div>
              <div className="text-center">Cantidad</div>
              <div className="text-right">Total</div>
            </div>

            {/* Ítems del carrito */}
            {cart.map((item) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center py-4 border-b border-gray-200">
                {/* Producto Info */}
                <div className="col-span-2 flex items-center">
                  {item.img && (
                    <Image
                      src={item.img}
                      alt={item.name}
                      width={80}
                      height={120}
                      className="object-contain mr-4 rounded-md"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold" style={{ color: colors.darkText }}>{item.name}</h3>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-sm text-red-500 hover:text-red-700 mt-1 flex items-center gap-1"
                    >
                      <TrashIcon className="h-4 w-4" /> Eliminar
                    </button>
                  </div>
                </div>

                {/* Precio Unitario */}
                <div className="text-center font-medium" style={{ color: colors.darkText }}>
                  ${item.price.toFixed(2)}
                </div>

                {/* Control de Cantidad */}
                <div className="flex items-center justify-center space-x-2">
                  <button
                    onClick={() => decreaseQuantity(item.id)}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                  >
                    <MinusIcon className="h-5 w-5" />
                  </button>
                  <span className="text-lg font-medium w-8 text-center" style={{ color: colors.darkText }}>{item.quantity}</span>
                  <button
                    onClick={() => increaseQuantity(item.id)}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                  >
                    <PlusIcon className="h-5 w-5" />
                  </button>
                </div>

                {/* Total por Producto */}
                <div className="text-right font-bold text-lg" style={{ color: colors.crimson }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}

            {/* Resumen del Total */}
            <div className="mt-8 pt-4 border-t-2 border-dashed flex justify-between items-center" style={{ borderColor: colors.warmBeige }}>
              <h2 className="text-2xl font-bold" style={{ color: colors.darkText }}>Total:</h2>
              <span className="text-3xl font-extrabold" style={{ color: colors.crimson }}>${total.toFixed(2)}</span>
            </div>

            {/* Botón de Comprar */}
            <div className="mt-8 text-center">
              {isAuthenticated ? (
                <Link href="/checkout" passHref> {/* Asumiendo una página de checkout */}
                  <button
                    className="px-10 py-4 rounded-md font-bold text-white text-xl transition-all duration-300 ease-in-out"
                    style={{ backgroundColor: colors.crimson }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#8B1313')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.crimson)}
                  >
                    Proceder al Pago
                  </button>
                </Link>
              ) : (
                <Link href="/login" passHref> {/* Enlace a la página de login */}
                  <button
                    className="px-10 py-4 rounded-md font-bold text-white text-xl transition-all duration-300 ease-in-out"
                    style={{ backgroundColor: colors.darkGray }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2E2E2E')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.darkGray)}
                  >
                    Iniciar Sesión para Comprar
                  </button>
                </Link>
              )}
            </div>
            <div className="mt-4 text-center">
                <Link href="/vinos" passHref>
                    <button
                        className="text-sm font-semibold hover:underline"
                        style={{color: colors.darkText}}
                    >
                        Continuar Comprando
                    </button>
                </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}