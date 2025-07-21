'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCartIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

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

  return (
    <nav className="relative z-50 w-full shadow-md" style={{ backgroundColor: '#3E3E3E' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Mobile Menu Button (Left on mobile) */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-inset transition-colors duration-200"
              style={{ color: '#D9C3A3', '--tw-ring-color': '#D9C3A3' } as any}
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Abrir menú principal</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Logo (Center on mobile, Left on desktop) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:relative lg:left-0 lg:top-0 lg:translate-x-0 lg:translate-y-0">
            <Link href="/" className="flex flex-shrink-0 items-center">
              <Image
                className="h-10 w-auto transition-transform duration-300 hover:scale-105"
                src="/logo/logo-blanco.png"
                alt="Vinos Aura Logo"
                width={100}
                height={40}
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation (Center on desktop) */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-center lg:gap-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium leading-6 px-3 py-2 rounded-md transition-all duration-200 ease-in-out"
                style={{ color: '#D9C3A3' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#B31B1B';
                  e.currentTarget.style.backgroundColor = 'rgba(217, 195, 163, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#D9C3A3';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Shopping Cart Icon (Right on all devices) */}
          <div className="flex items-center">
            <Link
              href="/cart"
              className="relative p-2 rounded-md transition-all duration-200 ease-in-out flex items-center justify-center"
              style={{ backgroundColor: '#B31B1B', color: '#D9C3A3' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(179, 27, 27, 0.8)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#B31B1B')}
            >
              <span className="sr-only">Ver carrito de compras</span>
              <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel (Full-screen overlay) */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[100] flex flex-col transition-opacity duration-300"
          style={{ backgroundColor: 'rgba(62, 62, 62, 0.95)' }}
        >
          <div className="w-full px-6 py-6">
            <div className="flex items-center justify-between">
              {/* Logo in mobile menu */}
              <Link href="/" className="p-1.5" onClick={() => setMobileMenuOpen(false)}>
                <span className="sr-only">Vinos Aura</span>
                <Image
                  className="h-8 w-auto"
                  src="/logo/logo-blanco.png"
                  alt="Vinos Aura Logo"
                  width={80}
                  height={32}
                  priority
                />
              </Link>
              {/* Close button */}
              <button
                type="button"
                className="rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-inset transition-colors duration-200"
                style={{ color: '#D9C3A3', '--tw-ring-color': '#D9C3A3' } as any}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Cerrar menú</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            {/* Menu links */}
            <div className="mt-6">
              <div className="space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block rounded-lg px-4 py-3 text-base font-medium transition-all duration-200 ease-in-out"
                    style={{ color: '#D9C3A3' }}
                    onClick={() => setMobileMenuOpen(false)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#B31B1B';
                      e.currentTarget.style.color = '#3E3E3E';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#D9C3A3';
                    }}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}