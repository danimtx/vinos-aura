// src/app/cart/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { PlusIcon, MinusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

export default function CartPage() {
  const { cart, total, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-background text-foreground min-h-screen pt-32 pb-24 relative z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-primary tracking-[0.3em] uppercase text-xs font-sans block mb-4">
            Tu Selección
          </span>
          <h1 className="text-5xl md:text-6xl font-serif font-light text-[#F5F5F0]">
            Bodega <span className="italic text-primary">Personal</span>
          </h1>
        </motion.div>

        {cart.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-[#111] border border-white/5 rounded-sm"
          >
            <p className="font-sans font-light text-muted text-lg mb-8">Tu bodega está vacía en este momento.</p>
            <Link href="/vinos" passHref>
              <button className="px-8 py-4 rounded-sm font-sans tracking-widest uppercase text-xs text-white bg-accent hover:bg-[#8B1313] transition-colors duration-300">
                Explorar la Colección
              </button>
            </Link>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Encabezados de la tabla */}
            <div className="hidden md:grid grid-cols-5 gap-4 pb-4 border-b border-white/10 font-sans text-xs uppercase tracking-widest text-muted">
              <div className="col-span-2">Cosecha</div>
              <div className="text-center">Valor</div>
              <div className="text-center">Cantidad</div>
              <div className="text-right">Subtotal</div>
            </div>

            {/* Ítems del carrito */}
            <div className="space-y-6 md:space-y-0 mt-6 md:mt-0">
              {cart.map((item, index) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  key={item.id} 
                  className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-4 items-center py-6 border-b border-white/5 bg-[#111] md:bg-transparent p-4 md:p-0 rounded-sm md:rounded-none"
                >
                  {/* Producto Info */}
                  <div className="col-span-2 flex items-center">
                    <div className="w-20 h-24 relative bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] border border-white/5 rounded-sm p-2 flex-shrink-0 mr-6">
                      <Image
                        src={item.img || '/placeholder-wine.png'}
                        alt={item.name}
                        fill
                        className="object-contain p-2"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-wine.png'; }}
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-serif text-[#F5F5F0] mb-1">{item.name}</h3>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-xs font-sans text-muted hover:text-accent transition-colors flex items-center gap-1 uppercase tracking-widest mt-2"
                      >
                        <TrashIcon className="h-3 w-3" /> Retirar
                      </button>
                    </div>
                  </div>

                  {/* Precio Unitario */}
                  <div className="text-center font-sans font-light text-muted md:block flex justify-between">
                    <span className="md:hidden uppercase text-xs tracking-widest">Valor:</span>
                    ${item.price.toFixed(2)}
                  </div>

                  {/* Control de Cantidad */}
                  <div className="flex items-center justify-center space-x-4">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="p-1 rounded-full border border-white/10 hover:border-primary hover:text-primary text-muted transition-colors"
                    >
                      <MinusIcon className="h-4 w-4" />
                    </button>
                    <span className="text-lg font-serif text-[#F5F5F0] w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className="p-1 rounded-full border border-white/10 hover:border-primary hover:text-primary text-muted transition-colors"
                    >
                      <PlusIcon className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Total por Producto */}
                  <div className="text-right font-serif text-xl text-primary md:block flex justify-between">
                    <span className="md:hidden font-sans uppercase text-xs tracking-widest text-muted">Subtotal:</span>
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Resumen del Total */}
            <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex gap-4">
                <Link href="/vinos" passHref>
                  <button className="text-xs font-sans tracking-widest uppercase text-muted hover:text-primary transition-colors border-b border-transparent hover:border-primary pb-1">
                    Continuar Explorando
                  </button>
                </Link>
              </div>
              <div className="flex items-end gap-6">
                <span className="text-sm font-sans tracking-widest uppercase text-muted mb-1">Inversión Total:</span>
                <span className="text-4xl font-serif italic text-primary">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Botón de Comprar */}
            <div className="mt-12 flex justify-end">
              {isAuthenticated ? (
                <Link href="/checkout" passHref className="w-full md:w-auto">
                  <button className="w-full md:w-auto px-12 py-4 bg-accent hover:bg-[#8B1313] text-white tracking-widest uppercase text-xs font-bold transition-all duration-300 rounded-sm">
                    Finalizar Adquisición
                  </button>
                </Link>
              ) : (
                <div className="flex flex-col items-end gap-4 w-full md:w-auto">
                  <p className="text-sm text-muted font-sans italic">Debes iniciar sesión para completar la adquisición.</p>
                  <Link href="/login" passHref className="w-full md:w-auto">
                    <button className="w-full md:w-auto px-12 py-4 bg-transparent border border-white/20 hover:border-primary text-foreground hover:text-primary tracking-widest uppercase text-xs transition-all duration-300 rounded-sm">
                      Identificarse
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}