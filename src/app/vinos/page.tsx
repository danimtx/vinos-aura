// src/app/vinos/page.tsx
'use client';

import { useState, useContext, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CartContext } from '../../context/CartContext';
import { EyeIcon } from '@heroicons/react/24/outline';

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
    return <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>Error: Contexto del carrito no encontrado. Por favor, recarga la página o contacta al soporte.</div>;
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

    const q = query(collection(db, 'products'), where('enabled', '==', true));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(productsData);
      setProductsLoading(false);
      console.log("Productos cargados desde Firestore:", productsData);
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
    // Siempre agrega solo 1 unidad
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

  const colors = {
    crimson: '#B31B1B',
    warmBeige: '#D9C3A3',
    darkGray: '#3E3E3E',
    lightGrayBg: '#F5F5F5',
    white: '#FFFFFF',
    darkText: '#3E3E3E',
    golden: '#C5A55B',
  };

  return (
    <div className="font-['EB_Garamond']" style={{ backgroundColor: colors.lightGrayBg, color: colors.darkText }}>
      <section className="py-16 px-4 sm:px-6 lg:px-8 text-center bg-white">
        <h2
          className="text-4xl font-bold mb-12 uppercase"
          style={{ color: colors.crimson }}
        >
          NUESTROS VINOS
        </h2>

        {productsLoading ? (
          <div className="text-center py-10">
            <p className="text-xl font-medium" style={{ color: colors.darkText }}>Cargando vinos...</p>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mt-4" style={{ borderColor: colors.crimson }}></div>
          </div>
        ) : productsError ? (
          <div className="text-center py-10">
            <p className="text-xl font-medium text-red-600">{productsError}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl font-medium" style={{ color: colors.darkText }}>No hay vinos disponibles en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {products.map((product) => (
              <div
                key={product.id}
                className="relative p-0 rounded-lg text-center overflow-hidden group shadow-md hover:shadow-xl transition-all duration-300 ease-in-out"
                style={{ backgroundColor: colors.white }}
              >
                {/* Contenedor de la Imagen */}
                <div className="relative w-full h-80 bg-gray-100 overflow-hidden">
                  <Image
                    src={product.img || '/placeholder-wine.png'}
                    alt={product.alt || product.name}
                    width={320}
                    height={320}
                    className="object-contain w-full h-full"
                    priority
                    onError={(e) => {
                      console.error(`Error al cargar la imagen: ${product.img}`);
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-wine.png';
                    }}
                  />
                </div>

                {/* Contenido de la tarjeta */}
                <div className="p-4 pt-6">
                  <h3
                    className="text-lg font-bold mb-1 uppercase"
                    style={{ color: colors.darkText }}
                  >
                    {product.name}
                  </h3>
                  <p
                    className="text-xl font-bold mb-6"
                    style={{ color: colors.crimson }}
                  >
                    ${product.price.toFixed(2)}
                  </p>

                  {/* Botones de acción */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCartSimple(product)}
                      className="flex-1 px-4 py-2 rounded-md font-bold text-white transition-all duration-300"
                      style={{ backgroundColor: colors.crimson }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#8B1313')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.crimson)}
                    >
                      Agregar al Carrito
                    </button>
                    <button
                      onClick={() => handleQuickViewClick(product)}
                      className="px-4 py-2 rounded-md font-bold border-2 transition-all duration-300 flex items-center justify-center"
                      style={{ 
                        backgroundColor: 'transparent', 
                        color: colors.darkGray, 
                        borderColor: colors.darkGray 
                      }}
                      onMouseEnter={(e) => { 
                        e.currentTarget.style.backgroundColor = colors.darkGray; 
                        e.currentTarget.style.color = colors.white; 
                      }}
                      onMouseLeave={(e) => { 
                        e.currentTarget.style.backgroundColor = 'transparent'; 
                        e.currentTarget.style.color = colors.darkGray; 
                      }}
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modal de Vista Rápida */}
      {isQuickViewOpen && selectedProduct && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-transparent backdrop-blur-sm transition-all duration-300">
          <div
            className="relative bg-white rounded-lg shadow-2xl p-8 max-w-4xl w-full mx-4 flex flex-col md:flex-row gap-8"
            style={{ color: colors.darkText }}
          >
            {/* Botón de cerrar modal */}
            <button
              onClick={() => setIsQuickViewOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors z-10 text-2xl font-bold"
            >
              ×
            </button>

            {/* Columna de la Imagen */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-4">
              <div className="relative w-full max-w-md aspect-square">
                <Image
                  src={selectedProduct.img || '/placeholder-wine.png'}
                  alt={selectedProduct.alt || selectedProduct.name}
                  width={400}
                  height={400}
                  className="object-contain w-full h-full rounded-lg"
                  onError={(e) => {
                    console.error(`Error al cargar la imagen en QuickView: ${selectedProduct.img}`);
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-wine.png';
                  }}
                />
              </div>
            </div>

            {/* Columna de la Información del Producto */}
            <div className="w-full md:w-1/2 flex flex-col justify-center text-left">
              <h2 className="text-3xl font-bold mb-2" style={{ color: colors.darkText }}>
                {selectedProduct.name}
              </h2>
              <p className="text-sm text-gray-600 mb-2">{selectedProduct.sku}</p>
              <p className="text-2xl font-bold mb-4" style={{ color: colors.crimson }}>
                ${selectedProduct.price.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">{selectedProduct.description}</p>

              {/* Botones de acción del Modal */}
              <button
                onClick={handleAddToCartFromQuickView}
                className="w-full px-6 py-3 rounded-md font-bold text-white mb-3 transition-all duration-300 ease-in-out shadow-md"
                style={{ backgroundColor: colors.crimson }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#8B1313')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.crimson)}
              >
                Agregar al carrito
              </button>

              <Link href={`/vinos/${selectedProduct.id}`} passHref>
                <button
                  onClick={() => setIsQuickViewOpen(false)}
                  className="w-full px-6 py-3 rounded-md font-bold text-center transition-all duration-300 ease-in-out border-2"
                  style={{ backgroundColor: 'transparent', color: colors.crimson, borderColor: colors.crimson }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.crimson; e.currentTarget.style.color = colors.white; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = colors.crimson; }}
                >
                  Ver más detalles
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}