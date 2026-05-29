// src/app/vinos/page.tsx
'use client';

import { useState, useContext, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CartContext } from '../../context/CartContext';
import { EyeIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

// Importaciones de Firebase
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';

// Definición de la interfaz para un producto
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
  createdAt?: any;
  updatedAt?: any;
}

export default function Vinos() {
  const context = useContext(CartContext);
  if (!context) {
    console.error('CartContext no está disponible. Asegúrate de que CartProvider envuelva la aplicación.');
    return <div className="text-red-500 text-center py-20 font-sans">Error: Contexto del carrito no encontrado.</div>;
  }
  const { addToCart } = context;

  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Efecto para cargar los productos desde Firestore
  useEffect(() => {
    setProductsLoading(true);
    setProductsError(null);

    if (!db) {
      console.warn("Base de datos no inicializada. Faltan variables de entorno de Firebase.");
      setProductsError("El catálogo no está disponible en este momento. Por favor, configura Firebase.");
      setProductsLoading(false);
      return;
    }

    const q = query(collection(db, 'products'), where('enabled', '==', true));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(productsData);
      setProductsLoading(false);
    }, (error) => {
      console.error("Error al escuchar productos desde Firestore:", error);
      setProductsError("Error al cargar los vinos. Por favor, inténtalo de nuevo más tarde.");
      setProductsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleQuickViewClick = (product: Product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleAddToCartSimple = (product: Product) => {
    addToCart({ 
      id: product.id, 
      name: product.name, 
      price: product.price, 
      img: product.img, 
      quantity: 1 
    });
  };

  const handleAddToCartFromQuickView = () => {
    if (selectedProduct) {
      addToCart({ 
        id: selectedProduct.id, 
        name: selectedProduct.name, 
        price: selectedProduct.price, 
        img: selectedProduct.img, 
        quantity: 1 
      });
      setIsQuickViewOpen(false);
    }
  };

  return (
    <div className="bg-background text-foreground min-h-screen pt-32 pb-24 relative z-10">
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <span className="text-primary tracking-[0.3em] uppercase text-xs font-sans block mb-4">
            Cosecha Exclusiva
          </span>
          <h2 className="text-5xl md:text-7xl font-serif font-light text-[#F5F5F0]">
            Nuestra <span className="italic text-primary">Colección</span>
          </h2>
        </motion.div>

        {productsLoading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-70">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary border-r-2 border-r-transparent mb-4"></div>
            <p className="font-sans font-light tracking-widest uppercase text-xs">Descubriendo vinos...</p>
          </div>
        ) : productsError ? (
          <div className="text-center py-20 text-accent font-sans">
            <p>{productsError}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-muted font-sans font-light">
            <p>La bodega está siendo preparada. Vuelve pronto.</p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.15 }
              }
            }}
          >
            {products.map((product) => (
              <motion.div
                key={product.id}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
                }}
                className="group relative flex flex-col items-center"
              >
                {/* Image Container */}
                <div className="relative w-full aspect-[3/4] bg-gradient-to-b from-[#151515] to-[#0A0A0A] overflow-hidden rounded-sm border border-white/5 group-hover:border-primary/30 transition-colors duration-500 flex items-center justify-center p-8 mb-6">
                  <Image
                    src={product.img || '/placeholder-wine.png'}
                    alt={product.alt || product.name}
                    width={320}
                    height={320}
                    className="object-contain w-full h-full transition-transform duration-700 ease-in-out group-hover:scale-110"
                    priority
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-wine.png';
                    }}
                  />
                  {/* Overlay Hover Actions */}
                  <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-sm">
                    <button
                      onClick={() => handleQuickViewClick(product)}
                      className="w-12 h-12 bg-white/10 hover:bg-primary border border-white/20 hover:border-primary rounded-full flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110"
                      aria-label="Vista rápida"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleAddToCartSimple(product)}
                      className="w-12 h-12 bg-accent/80 hover:bg-accent border border-accent/20 rounded-full flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110"
                      aria-label="Agregar al carrito"
                    >
                      <ShoppingCartIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="text-center w-full px-2">
                  <h3 className="font-serif text-2xl font-light mb-2 text-foreground tracking-wide group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <div className="w-8 h-[1px] bg-primary/50 mx-auto mb-3"></div>
                  <p className="font-sans text-lg font-light text-muted">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* Modal de Vista Rápida */}
      <AnimatePresence>
        {isQuickViewOpen && selectedProduct && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-background/80 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative bg-[#111] border border-white/10 shadow-2xl p-8 max-w-4xl w-full flex flex-col md:flex-row gap-12"
            >
              {/* Botón de cerrar */}
              <button
                onClick={() => setIsQuickViewOpen(false)}
                className="absolute top-6 right-6 text-muted hover:text-primary transition-colors z-10"
              >
                <span className="text-3xl font-light">×</span>
              </button>

              {/* Imagen */}
              <div className="w-full md:w-1/2 flex items-center justify-center bg-gradient-to-b from-[#1a1a1a] to-[#0A0A0A] border border-white/5 rounded-sm p-8">
                <div className="relative w-full aspect-[3/4]">
                  <Image
                    src={selectedProduct.img || '/placeholder-wine.png'}
                    alt={selectedProduct.alt || selectedProduct.name}
                    fill
                    className="object-contain drop-shadow-2xl"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-wine.png';
                    }}
                  />
                </div>
              </div>

              {/* Información */}
              <div className="w-full md:w-1/2 flex flex-col justify-center text-left py-4">
                <span className="text-primary text-xs uppercase tracking-widest font-sans mb-3">
                  {selectedProduct.sku}
                </span>
                <h2 className="text-4xl font-serif font-light mb-4 text-foreground leading-tight">
                  {selectedProduct.name}
                </h2>
                <p className="text-3xl font-serif text-primary italic mb-6">
                  ${selectedProduct.price.toFixed(2)}
                </p>
                <p className="text-sm font-sans font-light text-muted mb-10 leading-relaxed">
                  {selectedProduct.description}
                </p>

                <div className="flex flex-col gap-4 mt-auto">
                  <button
                    onClick={handleAddToCartFromQuickView}
                    className="w-full py-4 bg-accent hover:bg-[#8B1313] text-white tracking-widest uppercase text-xs font-bold transition-all duration-300 rounded-sm"
                  >
                    Agregar a la Bodega
                  </button>
                  <Link href={`/vinos/${selectedProduct.id}`} passHref className="w-full">
                    <button
                      onClick={() => setIsQuickViewOpen(false)}
                      className="w-full py-4 bg-transparent border border-white/20 hover:border-primary text-foreground hover:text-primary tracking-widest uppercase text-xs transition-all duration-300 rounded-sm"
                    >
                      Descubrir Detalles
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}