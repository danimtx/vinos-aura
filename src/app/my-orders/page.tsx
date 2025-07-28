// src/app/my-orders/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext'; // Importar useAuth
import { db } from '@/lib/firebase'; // Importar la instancia de Firestore
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore'; // Importar funciones de Firestore
import toast from 'react-hot-toast'; // Para notificaciones

// Definición de la interfaz para un ítem del carrito guardado en el pedido
interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  img?: string;
}

// Definición de la interfaz para un pedido completo
interface Order {
  id: string;
  userId: string;
  cartItems: OrderItem[];
  totalAmount: number;
  status: string;
  timestamp: any; // Firebase Timestamp
  billingInfo: {
    fullName: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  cardInfo: {
    cardType: string;
    last4Digits: string;
    expirationDate: string;
  };
}

const colors = {
  crimson: '#B31B1B',
  warmBeige: '#D9C3A3',
  darkGray: '#3E3E3E',
  lightGrayBg: '#F5F5F5',
  white: '#FFFFFF',
  darkText: '#3E3E3E',
};

export default function MyOrdersPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  useEffect(() => {
    // Redirigir si no está autenticado una vez que la carga de auth ha terminado
    if (!authLoading && !isAuthenticated) {
      toast.error('Debes iniciar sesión para ver tus pedidos.');
      router.replace('/login');
      return;
    }

    // Si está autenticado y tenemos el user.uid, cargar los pedidos
    if (isAuthenticated && user?.uid) {
      setOrdersLoading(true);
      setOrdersError(null);

      // Consulta para obtener pedidos del usuario actual, ordenados por fecha descendente
      const ordersCollectionRef = collection(db, 'orders');
      const q = query(
        ordersCollectionRef,
        where('userId', '==', user.uid),
        orderBy('timestamp', 'desc') // Ordenar por fecha de creación descendente
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedOrders: Order[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data() as Omit<Order, 'id'> // Castear los datos
        }));
        setOrders(fetchedOrders);
        setOrdersLoading(false);
        console.log("Pedidos cargados para el usuario:", fetchedOrders);
      }, (error) => {
        console.error("Error al cargar los pedidos:", error);
        setOrdersError("Error al cargar tus pedidos. Por favor, inténtalo de nuevo.");
        setOrdersLoading(false);
      });

      // Limpiar el listener al desmontar el componente
      return () => unsubscribe();
    }
  }, [isAuthenticated, user, authLoading, router]); // Dependencias para re-ejecutar el efecto

  // Mostrar loading inicial de autenticación o de pedidos
  if (authLoading || (!isAuthenticated && !authLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.lightGrayBg, color: colors.darkText }}>
        <p className="text-xl font-bold">Cargando...</p>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mt-4" style={{ borderColor: colors.crimson }}></div>
      </div>
    );
  }

  return (
    <div className="font-['EB_Garamond'] py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: colors.lightGrayBg, color: colors.darkText }}>
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-4xl font-bold mb-8 text-center" style={{ color: colors.crimson }}>
          Mis Pedidos
        </h1>

        {ordersLoading ? (
          <div className="text-center py-10">
            <p className="text-lg mb-4">Cargando tus pedidos...</p>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mt-4" style={{ borderColor: colors.crimson }}></div>
          </div>
        ) : ordersError ? (
          <div className="text-center py-10">
            <p className="text-lg text-red-600 mb-4">{ordersError}</p>
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
        ) : orders.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-lg mb-4">Aún no tienes pedidos realizados.</p>
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
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order.id} className="border p-6 rounded-lg shadow-sm" style={{ borderColor: colors.warmBeige, backgroundColor: colors.lightGrayBg }}>
                <div className="flex justify-between items-center mb-4 pb-2 border-b" style={{ borderColor: colors.warmBeige }}>
                  <h2 className="text-xl font-bold" style={{ color: colors.darkText }}>
                    Pedido #{order.id.substring(0, 8).toUpperCase()} {/* Mostrar una parte del ID para referencia */}
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {order.status === 'completed' ? 'Completado' : 'Pendiente'}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  Fecha: {order.timestamp?.toDate().toLocaleDateString('es-ES', {
                    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </p>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2" style={{ color: colors.darkText }}>Productos:</h3>
                  {order.cartItems.map((item) => (
                    <div key={item.id} className="flex items-center mb-2">
                      {item.img && (
                        <Image
                          src={item.img || '/placeholder-wine.png'}
                          alt={item.name}
                          width={40}
                          height={60}
                          className="object-contain mr-3 rounded-md"
                          onError={(e) => {
                            //console.error(`Error al cargar imagen de pedido: ${item.img}`, e.target.src);
                            (e.target as HTMLImageElement).src = '/placeholder-wine.png';
                          }}
                        />
                      )}
                      <p className="text-sm" style={{ color: colors.darkText }}>
                        {item.name} x {item.quantity} - ${item.price.toFixed(2)} c/u
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2" style={{ color: colors.darkText }}>Dirección de Envío:</h3>
                  <p className="text-sm text-gray-700">
                    {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.zipCode}, {order.shippingAddress.country}
                  </p>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2" style={{ color: colors.darkText }}>Información de Pago:</h3>
                  <p className="text-sm text-gray-700">
                    Tarjeta: {order.cardInfo.cardType} **** {order.cardInfo.last4Digits} (Vence: {order.cardInfo.expirationDate})
                  </p>
                </div>

                <div className="flex justify-between items-center pt-4 border-t" style={{ borderColor: colors.warmBeige }}>
                  <p className="text-xl font-bold" style={{ color: colors.darkText }}>Total del Pedido:</p>
                  <p className="text-2xl font-extrabold" style={{ color: colors.crimson }}>${order.totalAmount.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}