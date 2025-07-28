// src/components/Navbar.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShoppingCartIcon,
  Bars3Icon,
  XMarkIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
  UserCircleIcon, // Icono de cuenta
  ArrowRightOnRectangleIcon, // Icono de login
  UserPlusIcon // Icono de crear cuenta
} from '@heroicons/react/24/outline';

import { useCart } from '../context/CartContext'; // Importar useCart
import { useAuth } from '../context/AuthContext'; // Importar useAuth

const colors = {
  crimson: '#B31B1B',
  warmBeige: '#D9C3A3',
  darkGray: '#3E3E3E',
  golden: '#C5A55B',
};

const navigation = [
  { name: 'INICIO', href: '/' },
  { name: 'SOBRE NOSOTROS', href: '/about' },
  { name: 'VINOS', href: '/vinos' },
  { name: 'CONTACTO', href: '/contact' },
  { name: 'BLOG', href: '/blog' },
  { name: 'POLÍTICA DE PRIVACIDAD', href: '/privacy' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [authMenuOpen, setAuthMenuOpen] = useState(false); // Estado para el menú de autenticación

  const { cart, total, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();
  const { isAuthenticated, user, logout } = useAuth(); // Usar el contexto de autenticación

  return (
    <nav className="relative z-50 w-full shadow-md" style={{ backgroundColor: colors.darkGray }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Mobile Menu Button (Left on mobile) */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-inset transition-colors duration-200"
              style={{ color: colors.warmBeige, '--tw-ring-color': colors.warmBeige } as any}
              onClick={() => { setMobileMenuOpen(true); setCartOpen(false); setAuthMenuOpen(false); }}
            >
              <span className="sr-only">Abrir menú principal</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Logo and Text (Center on mobile, Left on desktop) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:relative lg:left-0 lg:top-0 lg:translate-x-0 lg:translate-y-0 flex items-center space-x-2">
            <Link href="/" className="flex flex-shrink-0 items-center">
              <Image
                className="h-12 w-auto transition-all duration-300 hover:scale-105 hover:rotate-3 hover:brightness-110"
                src="/logo/logo-blanco.png"
                alt="Vinos Aura Logo"
                width={120}
                height={48}
                priority
              />
              <span
                className="text-xl font-bold font-['EB_Garamond'] hidden lg:inline"
                style={{
                  color: colors.crimson,
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
                }}
              >
                Vinos Aura
              </span>
            </Link>
          </div>

          {/* Desktop Navigation (Center on desktop) */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-center lg:gap-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative text-sm font-medium leading-6 px-3 py-2 rounded-md transition-all duration-300 ease-in-out group"
                style={{ color: colors.warmBeige }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = colors.golden;
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = colors.warmBeige;
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {item.name}
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#C5A55B] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Icons (Right on all devices) */}
          <div className="flex items-center space-x-3">
            {/* Account Icon and Dropdown */}
            <div className="relative">
              <button
                onClick={() => { setAuthMenuOpen(!authMenuOpen); setCartOpen(false); setMobileMenuOpen(false); }}
                className="relative p-2 rounded-md transition-all duration-200 ease-in-out flex items-center justify-center"
                style={{ backgroundColor: colors.crimson, color: colors.warmBeige }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#8B1313')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.crimson)}
              >
                <span className="sr-only">Menú de cuenta</span>
                <UserCircleIcon className="h-6 w-6" aria-hidden="true" />
              </button>
              {authMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 p-2 z-50"
                  style={{ color: colors.darkGray }}
                >
                  {isAuthenticated ? (
                    <>
                      <p className="block px-4 py-2 text-sm text-gray-700 font-semibold truncate">
                        Hola, {user?.name || 'Usuario'}
                      </p>
                      <Link href="/my-orders" passHref> {/* Asumiendo una página de órdenes */}
                        <button
                          onClick={() => setAuthMenuOpen(false)}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-md flex items-center gap-2"
                        >
                          <ShoppingCartIcon className="h-4 w-4" /> Mis Pedidos
                        </button>
                      </Link>
                      <button
                        onClick={() => { logout(); setAuthMenuOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-md flex items-center gap-2"
                      >
                        <ArrowRightOnRectangleIcon className="h-4 w-4" /> Cerrar Sesión
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" passHref> {/* Página de Login */}
                        <button
                          onClick={() => setAuthMenuOpen(false)}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-md flex items-center gap-2"
                        >
                          <ArrowRightOnRectangleIcon className="h-4 w-4" /> Iniciar Sesión
                        </button>
                      </Link>
                      <Link href="/register" passHref> {/* Página de Registro */}
                        <button
                          onClick={() => setAuthMenuOpen(false)}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-md flex items-center gap-2"
                        >
                          <UserPlusIcon className="h-4 w-4" /> Crear Cuenta
                        </button>
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Shopping Cart Icon and Panel */}
            <div className="relative">
              <button
                onClick={() => { setCartOpen(!cartOpen); setMobileMenuOpen(false); setAuthMenuOpen(false); }}
                className="relative p-2 rounded-md transition-all duration-200 ease-in-out flex items-center justify-center"
                style={{ backgroundColor: colors.crimson, color: colors.warmBeige }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#8B1313')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.crimson)}
              >
                <span className="sr-only">Ver carrito de compras</span>
                <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
                {cart.length > 0 && (
                  <span
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                  >
                    {cart.reduce((totalQty, item) => totalQty + item.quantity, 0)}
                  </span>
                )}
              </button>
              {cartOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 p-4 z-50"
                  style={{ color: colors.darkGray }}
                >
                  <h4 className="text-lg font-bold mb-3" style={{ color: colors.crimson }}>Carrito</h4>
                  {cart.length === 0 ? (
                    <p className="text-sm">El carrito está vacío</p>
                  ) : (
                    <>
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200 last:border-b-0">
                          {item.img && (
                            <Image
                              src={item.img}
                              alt={item.name}
                              width={40}
                              height={60}
                              className="object-contain mr-2 rounded"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{item.name}</p>
                            <p className="text-xs text-gray-600">${item.price.toFixed(2)} c/u</p>
                          </div>
                          <div className="flex items-center space-x-1 ml-2">
                            <button
                              onClick={() => decreaseQuantity(item.id)}
                              className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
                            >
                              <MinusIcon className="h-4 w-4" />
                            </button>
                            <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => increaseQuantity(item.id)}
                              className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
                            >
                              <PlusIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-1 ml-2 text-red-500 hover:text-red-700"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                      <div className="mt-4 pt-2 border-t border-gray-300 text-right font-bold text-lg">
                        Total: ${total.toFixed(2)}
                      </div>
                      <Link href="/cart" passHref> {/* Enlace a la nueva página de carrito */}
                        <button
                          onClick={() => setCartOpen(false)} // Cierra el carrito al ir a la vista grande
                          className="mt-4 w-full px-4 py-2 rounded-md font-bold text-white transition-all duration-300 ease-in-out"
                          style={{ backgroundColor: colors.crimson }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#8B1313')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.crimson)}
                        >
                          Ver Carrito Completo
                        </button>
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel (Full-screen overlay) */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[100] flex flex-col transition-opacity duration-300"
          style={{ backgroundColor: `rgba(${parseInt(colors.darkGray.slice(1, 3), 16)}, ${parseInt(colors.darkGray.slice(3, 5), 16)}, ${parseInt(colors.darkGray.slice(5, 7), 16)}, 0.95)` }}
        >
          <div className="w-full px-6 py-6">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
                <Image
                  className="h-10 w-auto transition-all duration-300 hover:scale-105 hover:rotate-3 hover:brightness-110"
                  src="/logo/logo-blanco.png"
                  alt="Vinos Aura Logo"
                  width={100}
                  height={40}
                  priority
                />
                <span
                  className="text-lg font-bold font-['EB_Garamond']"
                  style={{
                    color: colors.crimson,
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  Vinos Aura
                </span>
              </Link>
              <button
                type="button"
                className="rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-inset transition-colors duration-200"
                style={{ color: colors.warmBeige, '--tw-ring-color': colors.warmBeige } as any}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Cerrar menú</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6">
              <div className="space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="relative block rounded-lg px-4 py-3 text-base font-medium transition-all duration-300 ease-in-out group"
                    style={{ color: 'white' }}
                    onClick={() => setMobileMenuOpen(false)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = colors.warmBeige;
                      e.currentTarget.style.backgroundColor = colors.crimson;
                      e.currentTarget.style.transform = 'scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    {item.name}
                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#C5A55B] transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                ))}
                {/* Opciones de autenticación en el menú móvil */}
                {isAuthenticated ? (
                    <>
                      <Link href="/my-orders" passHref>
                        <button
                          onClick={() => setMobileMenuOpen(false)}
                          className="w-full text-left px-4 py-2 text-base rounded-md flex items-center gap-2"
                          style={{ color: 'white', backgroundColor: 'transparent' }} // Ajusta el estilo
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = colors.warmBeige;
                            e.currentTarget.style.backgroundColor = colors.crimson;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = 'white';
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <ShoppingCartIcon className="h-5 w-5" /> Mis Pedidos
                        </button>
                      </Link>
                      <button
                        onClick={() => { logout(); setMobileMenuOpen(false); }}
                        className="w-full text-left px-4 py-2 text-base rounded-md flex items-center gap-2"
                        style={{ color: 'white', backgroundColor: 'transparent' }} // Ajusta el estilo
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = colors.warmBeige;
                          e.currentTarget.style.backgroundColor = colors.crimson;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'white';
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <ArrowRightOnRectangleIcon className="h-5 w-5" /> Cerrar Sesión
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" passHref>
                        <button
                          onClick={() => setMobileMenuOpen(false)}
                          className="w-full text-left px-4 py-2 text-base rounded-md flex items-center gap-2"
                          style={{ color: 'white', backgroundColor: 'transparent' }} // Ajusta el estilo
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = colors.warmBeige;
                            e.currentTarget.style.backgroundColor = colors.crimson;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = 'white';
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <ArrowRightOnRectangleIcon className="h-5 w-5" /> Iniciar Sesión
                        </button>
                      </Link>
                      <Link href="/register" passHref>
                        <button
                          onClick={() => setMobileMenuOpen(false)}
                          className="w-full text-left px-4 py-2 text-base rounded-md flex items-center gap-2"
                          style={{ color: 'white', backgroundColor: 'transparent' }} // Ajusta el estilo
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = colors.warmBeige;
                            e.currentTarget.style.backgroundColor = colors.crimson;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = 'white';
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <UserPlusIcon className="h-5 w-5" /> Crear Cuenta
                        </button>
                      </Link>
                    </>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}