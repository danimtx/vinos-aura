// src/app/vinos/[id]/page.tsx
'use client';

import { useState, useEffect, useContext } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { CartContext } from '../../../context/CartContext';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import Bottle3D from '@/components/Bottle3D';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  sku: string;
  img: string;
  alt: string;
  enabled: boolean;
  info?: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const { addToCart, cart } = useContext(CartContext)!;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingToCartFlag, setIsAddingToCartFlag] = useState(false);

  const [showProductInfo, setShowProductInfo] = useState(true);
  const [showReturnPolicy, setShowReturnPolicy] = useState(false);
  const [showShippingInfo, setShowShippingInfo] = useState(false);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      setError("ID de producto no proporcionado.");
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        if (!db) {
          setError("Configuración de base de datos faltante.");
          setLoading(false);
          return;
        }
        const productRef = doc(db, 'products', productId);
        const docSnap = await getDoc(productRef);

        if (docSnap.exists() && docSnap.data().enabled) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        } else {
          setError("Producto no encontrado o no disponible.");
        }
      } catch (err) {
        console.error("Error al cargar el producto:", err);
        setError("Error al cargar los detalles del producto.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product || isAddingToCartFlag) return;
    setIsAddingToCartFlag(true);

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      img: product.img,
      quantity: 1,
    });

    setTimeout(() => {
      setIsAddingToCartFlag(false);
    }, 300);
  };

  const handleRealizarCompra = () => {
    if (!product || isAddingToCartFlag) return;
    setIsAddingToCartFlag(true);

    const itemInCart = cart.find(item => item.id === product.id);

    if (!itemInCart) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        img: product.img,
        quantity: 1,
      });
    }

    setTimeout(() => {
      setIsAddingToCartFlag(false);
      router.push('/cart');
    }, 300);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center opacity-70">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary border-r-2 border-r-transparent mb-4"></div>
        <p className="font-sans font-light tracking-widest uppercase text-xs text-muted">Cargando detalles...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-serif text-accent mb-6">{error || "Vino no encontrado."}</h2>
        <Link href="/vinos" passHref>
          <button className="px-6 py-3 rounded-sm font-sans tracking-widest uppercase text-xs text-white bg-accent hover:bg-[#8B1313] transition-colors duration-300">
            Volver a la Colección
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground min-h-screen pt-32 pb-24 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-sans tracking-widest uppercase text-muted mb-8 flex items-center gap-2"
        >
          <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/vinos" className="hover:text-primary transition-colors">Colección</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-16 relative">
          
          {/* Botón Volver (Móvil) */}
          <div className="md:hidden mb-4">
            <button
              onClick={() => router.back()}
              className="text-xs font-sans tracking-widest uppercase text-muted hover:text-primary transition-colors"
            >
              ← Volver
            </button>
          </div>

          {/* Columna de la Imagen 3D */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/2"
          >
            <div className="sticky top-32 w-full aspect-[3/4] bg-gradient-to-b from-[#151515] to-[#0A0A0A] rounded-sm border border-white/5 flex items-center justify-center p-0 md:p-8 overflow-hidden group">
              <Bottle3D textureUrl={product.img || '/placeholder-wine.png'} />
              <div className="absolute inset-0 border border-primary/20 m-6 pointer-events-none transition-all duration-700 group-hover:m-4 opacity-50 z-0"></div>
            </div>
          </motion.div>

          {/* Columna de Información */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full md:w-1/2 flex flex-col justify-start"
          >
            {/* Botón Volver (Desktop) */}
            <div className="hidden md:flex justify-end mb-6">
              <button
                onClick={() => router.back()}
                className="text-xs font-sans tracking-widest uppercase text-muted hover:text-primary transition-colors flex items-center gap-2"
              >
                <span>←</span> Volver
              </button>
            </div>

            <span className="text-primary tracking-[0.3em] uppercase text-xs font-sans block mb-3">
              {product.sku}
            </span>
            <h1 className="text-5xl md:text-6xl font-serif font-light mb-6 text-[#F5F5F0] leading-tight">
              {product.name}
            </h1>
            
            <div className="w-12 h-[1px] bg-primary/50 mb-6"></div>

            <p className="text-4xl font-serif text-primary italic mb-8">
              ${product.price.toFixed(2)}
            </p>

            <p className="font-sans font-light text-muted text-lg leading-relaxed mb-10">
              {product.description}
            </p>

            {/* Acciones */}
            <div className="flex flex-col gap-4 mb-16">
              <button
                onClick={handleAddToCart}
                className="w-full py-4 bg-accent hover:bg-[#8B1313] text-white tracking-widest uppercase text-xs font-bold transition-all duration-300 rounded-sm disabled:opacity-50"
                disabled={isAddingToCartFlag}
              >
                {isAddingToCartFlag ? 'Actualizando...' : 'Agregar a la Bodega'}
              </button>
              <button
                onClick={handleRealizarCompra}
                className="w-full py-4 bg-transparent border border-white/20 hover:border-primary text-foreground hover:text-primary tracking-widest uppercase text-xs transition-all duration-300 rounded-sm disabled:opacity-50"
                disabled={isAddingToCartFlag}
              >
                Proceder al Checkout
              </button>
            </div>

            {/* Acordeones */}
            <div className="space-y-2 border-t border-white/10 pt-8">
              {/* Información */}
              <div className="border-b border-white/10 py-4">
                <button
                  className="flex justify-between items-center w-full text-left font-serif text-xl font-light text-foreground hover:text-primary transition-colors"
                  onClick={() => setShowProductInfo(!showProductInfo)}
                >
                  Notas de Cata & Detalles
                  {showProductInfo ? <ChevronUpIcon className="h-5 w-5 text-primary" /> : <ChevronDownIcon className="h-5 w-5 text-muted" />}
                </button>
                <AnimatePresence>
                  {showProductInfo && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="font-sans font-light text-muted text-sm leading-relaxed mt-4 pb-2">
                        {product.info || "Notas de frutos rojos oscuros, taninos sedosos y un final prolongado. Ideal para acompañar carnes rojas y quesos maduros."}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Envíos */}
              <div className="border-b border-white/10 py-4">
                <button
                  className="flex justify-between items-center w-full text-left font-serif text-xl font-light text-foreground hover:text-primary transition-colors"
                  onClick={() => setShowShippingInfo(!showShippingInfo)}
                >
                  Envío & Manipulación
                  {showShippingInfo ? <ChevronUpIcon className="h-5 w-5 text-primary" /> : <ChevronDownIcon className="h-5 w-5 text-muted" />}
                </button>
                <AnimatePresence>
                  {showShippingInfo && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="font-sans font-light text-muted text-sm leading-relaxed mt-4 pb-2">
                        Envío refrigerado especializado. Los pedidos se procesan en 24h. Entrega estándar en 3-5 días hábiles. Embalaje premium diseñado para proteger cada botella de impactos y cambios térmicos.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Devoluciones */}
              <div className="border-b border-white/10 py-4">
                <button
                  className="flex justify-between items-center w-full text-left font-serif text-xl font-light text-foreground hover:text-primary transition-colors"
                  onClick={() => setShowReturnPolicy(!showReturnPolicy)}
                >
                  Garantía Vinos Aura
                  {showReturnPolicy ? <ChevronUpIcon className="h-5 w-5 text-primary" /> : <ChevronDownIcon className="h-5 w-5 text-muted" />}
                </button>
                <AnimatePresence>
                  {showReturnPolicy && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="font-sans font-light text-muted text-sm leading-relaxed mt-4 pb-2">
                        Si la botella presenta algún defecto (como corcho dañado o alteraciones por temperatura), garantizamos su reemplazo inmediato dentro de los 7 días posteriores a la entrega. Escríbenos a concierge@vinosaura.com.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}