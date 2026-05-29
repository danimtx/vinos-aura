// src/components/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShoppingCartIcon,
  Bars3Icon,
  XMarkIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';

import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const navigation = [
  { name: 'INICIO', href: '/' },
  { name: 'SOBRE NOSOTROS', href: '/about' },
  { name: 'VINOS', href: '/vinos' },
  { name: 'CONTACTO', href: '/contact' },
  { name: 'BLOG', href: '/blog' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [authMenuOpen, setAuthMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { cart, total, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-background/80 backdrop-blur-md shadow-lg border-b border-white/5' : 'bg-transparent pt-4'}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2.5 text-foreground hover:text-primary transition-colors"
              onClick={() => { setMobileMenuOpen(true); setCartOpen(false); setAuthMenuOpen(false); }}
            >
              <span className="sr-only">Abrir menú principal</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:relative lg:left-0 lg:top-0 lg:translate-x-0 lg:translate-y-0 flex items-center space-x-2">
            <Link href="/" className="flex flex-shrink-0 items-center group">
              <Image
                className="h-10 w-auto transition-transform duration-500 group-hover:scale-105"
                src="/logo/logo-blanco.png"
                alt="Vinos Aura Logo"
                width={120}
                height={48}
                priority
              />
              <span className="text-2xl font-serif hidden lg:inline text-foreground group-hover:text-primary transition-colors ml-2 font-light">
                <span className="italic">Vinos</span> Aura
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-center lg:gap-x-10">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-xs tracking-widest uppercase font-sans text-muted hover:text-primary transition-colors duration-300 relative group"
              >
                {item.name}
                <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Icons (Right) */}
          <div className="flex items-center space-x-4">
            {/* Account */}
            <div className="relative">
              <button
                onClick={() => { setAuthMenuOpen(!authMenuOpen); setCartOpen(false); setMobileMenuOpen(false); }}
                className="p-2 text-foreground hover:text-primary transition-colors"
              >
                <span className="sr-only">Menú de cuenta</span>
                <UserCircleIcon className="h-6 w-6" aria-hidden="true" strokeWidth={1} />
              </button>
              {authMenuOpen && (
                <div className="absolute right-0 mt-4 w-56 bg-[#111] border border-white/10 rounded-sm shadow-2xl p-2 z-50 text-foreground font-sans">
                  {isAuthenticated ? (
                    <>
                      <p className="block px-4 py-3 text-sm font-light border-b border-white/10 mb-2 truncate text-primary">
                        Bienvenido, {user?.name || 'Usuario'}
                      </p>
                      <Link href="/my-orders" passHref>
                        <button onClick={() => setAuthMenuOpen(false)} className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 rounded-sm flex items-center gap-3 transition-colors">
                          <ShoppingCartIcon className="h-4 w-4" /> Mis Pedidos
                        </button>
                      </Link>
                      <button onClick={() => { logout(); setAuthMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 rounded-sm flex items-center gap-3 transition-colors">
                        <ArrowRightOnRectangleIcon className="h-4 w-4" /> Cerrar Sesión
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" passHref>
                        <button onClick={() => setAuthMenuOpen(false)} className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 rounded-sm flex items-center gap-3 transition-colors">
                          <ArrowRightOnRectangleIcon className="h-4 w-4" /> Iniciar Sesión
                        </button>
                      </Link>
                      <Link href="/register" passHref>
                        <button onClick={() => setAuthMenuOpen(false)} className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 rounded-sm flex items-center gap-3 transition-colors">
                          <UserPlusIcon className="h-4 w-4" /> Crear Cuenta
                        </button>
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <div className="relative">
              <button
                onClick={() => { setCartOpen(!cartOpen); setMobileMenuOpen(false); setAuthMenuOpen(false); }}
                className="p-2 text-foreground hover:text-primary transition-colors relative"
              >
                <span className="sr-only">Ver carrito de compras</span>
                <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" strokeWidth={1} />
                {cart.length > 0 && (
                  <span className="absolute top-0 right-0 bg-accent text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                    {cart.reduce((totalQty, item) => totalQty + item.quantity, 0)}
                  </span>
                )}
              </button>
              {cartOpen && (
                <div className="absolute right-0 mt-4 w-80 bg-[#111] border border-white/10 rounded-sm shadow-2xl p-6 z-50 text-foreground font-sans">
                  <h4 className="text-lg font-serif italic mb-4 text-primary">Su Selección</h4>
                  {cart.length === 0 ? (
                    <p className="text-sm font-light text-muted">El carrito está vacío</p>
                  ) : (
                    <>
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center justify-between mb-4 pb-4 border-b border-white/10 last:border-b-0">
                          <div className="flex-1 min-w-0 pr-4">
                            <p className="text-sm tracking-wider uppercase mb-1 truncate">{item.name}</p>
                            <p className="text-xs text-primary font-serif">${item.price.toFixed(2)}</p>
                          </div>
                          <div className="flex items-center space-x-2 bg-black/50 p-1 rounded-sm border border-white/5">
                            <button onClick={() => decreaseQuantity(item.id)} className="p-1 text-muted hover:text-white transition-colors">
                              <MinusIcon className="h-3 w-3" />
                            </button>
                            <span className="text-xs w-4 text-center">{item.quantity}</span>
                            <button onClick={() => increaseQuantity(item.id)} className="p-1 text-muted hover:text-white transition-colors">
                              <PlusIcon className="h-3 w-3" />
                            </button>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="p-2 ml-2 text-muted hover:text-accent transition-colors">
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-sm font-serif">
                        <span className="text-muted">Total</span>
                        <span className="text-xl text-primary">${total.toFixed(2)}</span>
                      </div>
                      <Link href="/cart" passHref>
                        <button
                          onClick={() => setCartOpen(false)}
                          className="mt-6 w-full py-3 bg-accent/90 hover:bg-accent text-white uppercase tracking-widest text-xs transition-colors rounded-sm"
                        >
                          Ir al Checkout
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

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[100] flex flex-col bg-background/95 backdrop-blur-xl border-t border-white/10 pt-20 transition-all duration-300">
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-6 right-6 p-2 text-muted hover:text-primary transition-colors"
          >
            <XMarkIcon className="h-8 w-8" strokeWidth={1} />
          </button>
          <div className="flex flex-col px-8 py-8 space-y-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-2xl font-serif text-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}