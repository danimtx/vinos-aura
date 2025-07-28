// src/app/vinos/[id]/page.tsx
'use client';

import { useState, useEffect, useContext } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/firebase'; // Asegúrate de que esta ruta sea correcta
import { doc, getDoc } from 'firebase/firestore';
import { CartContext } from '../../../context/CartContext'; // Ruta al CartContext
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'; // Iconos para desplegar/contraer

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
  info?: string; // Campo para información adicional del producto
}

const colors = {
  crimson: '#B31B1B',
  warmBeige: '#D9C3A3',
  darkGray: '#3E3E3E',
  lightGrayBg: '#F5F5F5',
  white: '#FFFFFF',
  darkText: '#3E3E3E',
  golden: '#C5A55B',
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string; // Obtener el ID del producto de la URL

  const { addToCart, cart } = useContext(CartContext)!; // Acceder a addToCart y cart

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingToCartFlag, setIsAddingToCartFlag] = useState(false); // Flag para evitar dobles clics

  // Estados para las secciones desplegables
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
        const productRef = doc(db, 'products', productId);
        const docSnap = await getDoc(productRef);

        if (docSnap.exists() && docSnap.data().enabled) { // Solo cargar si está habilitado
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
  }, [productId]); // Se ejecuta cuando el ID del producto cambia

  const handleAddToCart = () => {
    if (!product || isAddingToCartFlag) return;

    setIsAddingToCartFlag(true); // Deshabilita el botón temporalmente

    // Siempre agrega 1 unidad al carrito
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      img: product.img,
      quantity: 1, // Siempre agrega 1 unidad
    });

    setTimeout(() => {
      setIsAddingToCartFlag(false); // Habilita el botón después de un breve retraso
    }, 300); // Pequeño retraso para evitar dobles clics en desarrollo
  };

  const handleRealizarCompra = () => {
    if (!product || isAddingToCartFlag) return;

    setIsAddingToCartFlag(true); // Deshabilita el botón temporalmente

    const itemInCart = cart.find(item => item.id === product.id);

    if (!itemInCart) {
      // Si el producto NO está en el carrito, agrégalo con cantidad 1
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        img: product.img,
        quantity: 1,
      });
    }
    // Si ya está en el carrito, no se agrega nada, simplemente se redirige.

    // Redirigir al carrito después de un breve retraso para que la acción se registre
    setTimeout(() => {
      setIsAddingToCartFlag(false); // Habilita el botón
      router.push('/cart');
    }, 300);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: colors.lightGrayBg, color: colors.darkText }}>
        <p className="text-xl font-bold">Cargando detalles del vino...</p>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mt-4" style={{ borderColor: colors.crimson }}></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8" style={{ backgroundColor: colors.lightGrayBg, color: colors.darkText }}>
        <h2 className="text-2xl font-bold text-red-600 mb-4">{error || "Vino no encontrado."}</h2>
        <Link href="/vinos" passHref>
          <button
            className="px-6 py-3 rounded-md font-bold text-white transition-all duration-300 ease-in-out shadow-md"
            style={{ backgroundColor: colors.crimson }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#8B1313')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.crimson)}
          >
            Volver a la lista de Vinos
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="font-['EB_Garamond'] py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: colors.lightGrayBg, color: colors.darkText }}>
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl p-8 relative">
        {/* Breadcrumbs */}
        <div className="absolute top-4 left-4 text-sm text-gray-600">
          <Link href="/" className="hover:underline">Inicio</Link> /
          <Link href="/vinos" className="hover:underline ml-1">Vinos</Link> /
          <span className="ml-1 font-semibold">{product.name}</span>
        </div>

        {/* Botón Volver Atrás */}
        <div className="absolute top-4 right-4">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 rounded-md font-bold text-sm transition-all duration-300 ease-in-out"
            style={{ backgroundColor: colors.warmBeige, color: colors.darkText }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.golden)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.warmBeige)}
          >
            Volver Atrás
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-12 mt-8"> {/* Añadido mt-8 para separar del breadcrumb */}
          {/* Columna de la Imagen */}
          <div className="w-full md:w-1/2 flex items-center justify-center p-4">
            <div className="relative w-full max-w-md aspect-square">
              <Image
                src={product.img || '/placeholder-wine.png'}
                alt={product.alt || product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain w-full h-full rounded-lg"
                priority
                onError={(e) => {
                  //console.error(`Error al cargar la imagen del producto: ${product.img}`, e.target.src);
                  (e.target as HTMLImageElement).src = '/placeholder-wine.png';
                }}
              />
            </div>
          </div>

          {/* Columna de la Información del Producto y Acciones */}
          <div className="w-full md:w-1/2 flex flex-col justify-center text-left">
            <h1 className="text-4xl font-bold mb-2" style={{ color: colors.darkText }}>
              {product.name}
            </h1>
            <p className="text-sm text-gray-600 mb-2">{product.sku}</p>
            <p className="text-3xl font-bold mb-6" style={{ color: colors.crimson }}>
              ${product.price.toFixed(2)}
            </p>

            {/* Botón de Agregar al Carrito */}
            <button
              onClick={handleAddToCart}
              className="w-full px-6 py-3 rounded-md font-bold text-white mb-3 transition-all duration-300 ease-in-out shadow-md"
              style={{ backgroundColor: colors.crimson }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#8B1313')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.crimson)}
              disabled={isAddingToCartFlag}
            >
              {isAddingToCartFlag ? 'Agregando...' : 'Agregar al Carrito'}
            </button>

            {/* Botón de Realizar Compra */}
            <button
              onClick={handleRealizarCompra}
              className="w-full px-6 py-3 rounded-md font-bold text-center transition-all duration-300 ease-in-out border-2"
              style={{ backgroundColor: colors.darkGray, color: colors.white, borderColor: colors.darkGray }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.white; e.currentTarget.style.color = colors.darkGray; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.darkGray; e.currentTarget.style.color = colors.white; }}
              disabled={isAddingToCartFlag}
            >
              Realizar Compra
            </button>

            {/* Secciones Desplegables */}
            <div className="mt-8">
              {/* Información del Producto */}
              <div className="border-b py-4" style={{ borderColor: colors.warmBeige }}>
                <button
                  className="flex justify-between items-center w-full text-xl font-bold"
                  onClick={() => setShowProductInfo(!showProductInfo)}
                  style={{ color: colors.darkText }}
                >
                  INFORMACIÓN DEL PRODUCTO
                  {showProductInfo ? <ChevronUpIcon className="h-6 w-6" /> : <ChevronDownIcon className="h-6 w-6" />}
                </button>
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showProductInfo ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-sm text-gray-700 leading-relaxed mt-3">
                    {product.info || "Sin información. Este es un espacio para agregar detalles sobre tu producto como su tamaño, materiales, instrucciones de uso y mantenimiento."}
                  </p>
                </div>
              </div>

              {/* Política de Devolución y Reembolso */}
              <div className="border-b py-4" style={{ borderColor: colors.warmBeige }}>
                <button
                  className="flex justify-between items-center w-full text-xl font-bold"
                  onClick={() => setShowReturnPolicy(!showReturnPolicy)}
                  style={{ color: colors.darkText }}
                >
                  POLÍTICA DE DEVOLUCIÓN Y REEMBOLSO
                  {showReturnPolicy ? <ChevronUpIcon className="h-6 w-6" /> : <ChevronDownIcon className="h-6 w-6" />}
                </button>
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showReturnPolicy ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-sm text-gray-700 leading-relaxed mt-3">
                    En Vinos Aura, tu satisfacción es nuestra prioridad. Si no estás completamente satisfecho con tu compra, puedes devolver el producto en su estado original dentro de los 30 días posteriores a la entrega para un reembolso completo o un cambio. Por favor, asegúrate de que el producto no haya sido abierto ni dañado. Para iniciar una devolución, contáctanos a <a href="mailto:soporte@vinosaura.com" className="text-crimson hover:underline">soporte@vinosaura.com</a> con tu número de pedido.
                  </p>
                </div>
              </div>

              {/* Información de Envío */}
              <div className="py-4">
                <button
                  className="flex justify-between items-center w-full text-xl font-bold"
                  onClick={() => setShowShippingInfo(!showShippingInfo)}
                  style={{ color: colors.darkText }}
                >
                  INFORMACIÓN DE ENVÍO
                  {showShippingInfo ? <ChevronUpIcon className="h-6 w-6" /> : <ChevronDownIcon className="h-6 w-6" />}
                </button>
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showShippingInfo ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-sm text-gray-700 leading-relaxed mt-3">
                    Ofrecemos envío estándar gratuito en todos los pedidos superiores a $50. Los pedidos se procesan en 1-2 días hábiles y el tiempo de entrega estimado es de 3-7 días hábiles. Utilizamos empaques especiales para garantizar que tus vinos lleguen en perfectas condiciones. Para envíos urgentes, ofrecemos opciones de envío express con costo adicional.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}