// src/app/checkout/page.tsx
'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast'; // Para notificaciones
import visaLogo from '../../../public/visa.png';

const colors = {
  crimson: '#B31B1B',
  warmBeige: '#D9C3A3',
  darkGray: '#3E3E3E',
  lightGrayBg: '#F5F5F5',
  white: '#FFFFFF',
  darkText: '#3E3E3E',
};

// Función para detectar el tipo de tarjeta
const getCardType = (cardNumber: string): string => {
  const num = cardNumber.replace(/\s/g, ''); // Eliminar espacios
  if (/^4/.test(num)) return 'Visa';
  if (/^5[1-5]/.test(num)) return 'Mastercard';
  if (/^3[47]/.test(num)) return 'American Express';
  if (/^6(?:011|5[0-9]{2}|4[4-9][0-9]|22(?:12[6-9]|[1-9][0-9]{2}|[0-9]1[0-9]|2[0-5][0-9]))/.test(num)) return 'Discover';
  return 'Desconocida';
};

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const [billingInfo, setBillingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
  });
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expirationDate: '',
    cvv: '',
  });
  const [cardType, setCardType] = useState('Desconocida');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Nuevo estado para el modal de simulación de pago
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'loading' | 'success'>('loading');

  // Redirigir si el carrito está vacío o el usuario no está autenticado (una vez que AuthContext haya cargado)
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error('Debes iniciar sesión para proceder con la compra.');
      router.push('/login');
    } else if (!authLoading && isAuthenticated && cart.length === 0) {
      toast('Tu carrito está vacío. Agrega productos para comprar.');
      router.push('/vinos');
    }
  }, [cart, isAuthenticated, authLoading, router]);

  // Actualizar tipo de tarjeta al cambiar el número
  useEffect(() => {
    setCardType(getCardType(cardDetails.cardNumber));
  }, [cardDetails.cardNumber]);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    // Validación de Información de Facturación
    if (!billingInfo.fullName) errors.fullName = 'Nombre completo es requerido.';
    if (!billingInfo.email) errors.email = 'Correo electrónico es requerido.';
    else if (!/\S+@\S+\.\S+/.test(billingInfo.email)) errors.email = 'Correo electrónico inválido.';
    if (!billingInfo.phone) errors.phone = 'Teléfono es requerido.';

    // Validación de Dirección de Envío
    if (!shippingAddress.address) errors.address = 'Dirección es requerida.';
    if (!shippingAddress.city) errors.city = 'Ciudad es requerida.';
    if (!shippingAddress.state) errors.state = 'Estado/Provincia es requerido.';
    if (!shippingAddress.zipCode) errors.zipCode = 'Código postal es requerido.';
    if (!shippingAddress.country) errors.country = 'País es requerido.';

    // Validación de Detalles de Tarjeta
    if (!cardDetails.cardNumber) errors.cardNumber = 'Número de tarjeta es requerido.';
    else if (cardDetails.cardNumber.replace(/\s/g, '').length < 13 || cardDetails.cardNumber.replace(/\s/g, '').length > 19) errors.cardNumber = 'Número de tarjeta inválido.';
    if (cardType === 'Desconocida' && cardDetails.cardNumber.length > 0) errors.cardType = 'Tipo de tarjeta desconocido.';
    if (!cardDetails.expirationDate) errors.expirationDate = 'Fecha de vencimiento es requerida.';
    else {
      const [month, year] = cardDetails.expirationDate.split('/');
      const currentYear = new Date().getFullYear() % 100; // Últimos 2 dígitos del año actual
      const currentMonth = new Date().getMonth() + 1; // Mes actual (1-12)

      if (!month || !year || parseInt(month) < 1 || parseInt(month) > 12 || parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        errors.expirationDate = 'Fecha de vencimiento inválida o expirada.';
      }
    }
    if (!cardDetails.cvv) errors.cvv = 'CVV es requerido.';
    else if (cardDetails.cvv.length < 3 || cardDetails.cvv.length > 4) errors.cvv = 'CVV inválido.';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Solo dígitos
    value = value.replace(/(\d{4})(?=\d)/g, '$1 '); // Añadir espacio cada 4 dígitos
    setCardDetails({ ...cardDetails, cardNumber: value });
  };

  const handleExpirationDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Solo dígitos
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    setCardDetails({ ...cardDetails, expirationDate: value });
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Solo dígitos
    setCardDetails({ ...cardDetails, cvv: value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;

    if (!validateForm()) {
      toast.error('Por favor, corrige los errores en el formulario.');
      return;
    }

    setIsProcessing(true);
    setShowPaymentModal(true);
    setPaymentStep('loading');

    // Simula la animación de pago (2 segundos)
    setTimeout(async () => {
      setPaymentStep('success');
      try {
        if (!user?.uid) {
          throw new Error("Usuario no autenticado. Por favor, inicia sesión.");
        }

        const orderData = {
          userId: user.uid,
          cartItems: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            img: item.img || '',
          })),
          totalAmount: total,
          billingInfo,
          shippingAddress,
          cardInfo: {
            cardType,
            last4Digits: cardDetails.cardNumber.slice(-4),
            expirationDate: cardDetails.expirationDate,
          },
          status: 'completed',
          timestamp: serverTimestamp(),
        };

        await addDoc(collection(db, 'orders'), orderData);
        clearCart();
        // Espera 1.5s para mostrar el mensaje de éxito antes de redirigir
        setTimeout(() => {
          setShowPaymentModal(false);
          toast.success('¡Compra simulada con éxito! Redirigiendo a tus pedidos.');
          router.push('/vinos');
        }, 1500);
      } catch (error: any) {
        setShowPaymentModal(false);
        toast.error(`Error al procesar la compra: ${error.message || 'Inténtalo de nuevo.'}`);
      } finally {
        setIsProcessing(false);
      }
    }, 2000);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.lightGrayBg, color: colors.darkText }}>
        <p className="text-xl font-bold">Cargando autenticación...</p>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mt-4" style={{ borderColor: colors.crimson }}></div>
      </div>
    );
  }

  // Si no está autenticado o el carrito está vacío, el useEffect redirigirá.
  // Mientras tanto, podemos mostrar un mensaje simple.
  if (!isAuthenticated || cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.lightGrayBg, color: colors.darkText }}>
        <p className="text-xl font-bold">Redirigiendo...</p>
      </div>
    );
  }

  return (
    <>
      {/* Modal de simulación de pago */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-lg shadow-xl p-8 flex flex-col items-center min-w-[320px]">
            {paymentStep === 'loading' && (
              <>
                <div className="mb-4">
                  <Image src={visaLogo} alt="Visa" width={80} height={40} />
                </div>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-crimson mb-4" style={{ borderColor: colors.crimson }}></div>
                <p className="text-lg font-semibold mb-2" style={{ color: colors.crimson }}>Procesando pago con Visa...</p>
                <p className="text-gray-600">No cierres ni recargues la página.</p>
              </>
            )}
            {paymentStep === 'success' && (
              <>
                <div className="mb-4">
                  <Image src={visaLogo} alt="Visa" width={80} height={40} />
                </div>
                <div className="text-green-600 text-4xl mb-2">✔</div>
                <p className="text-xl font-bold mb-2" style={{ color: colors.crimson }}>¡Pago exitoso!</p>
                <p className="text-gray-700">Gracias por tu compra.</p>
              </>
            )}
          </div>
        </div>
      )}

      <div className="font-['EB_Garamond'] py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: colors.lightGrayBg, color: colors.darkText }}>
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-4xl font-bold mb-8 text-center" style={{ color: colors.crimson }}>
            Finalizar Compra
          </h1>

          <form onSubmit={handlePlaceOrder}>
            {/* Resumen del Pedido */}
            <section className="mb-8 p-6 rounded-lg" style={{ backgroundColor: colors.lightGrayBg }}>
              <h2 className="text-2xl font-bold mb-4" style={{ color: colors.darkText }}>Resumen del Pedido</h2>
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center mb-2 pb-2 border-b border-gray-300 last:border-b-0 last:pb-0">
                  <div className="flex items-center">
                    {item.img && (
                      <Image
                        src={item.img || '/placeholder-wine.png'}
                        alt={item.name}
                        width={50}
                        height={75}
                        className="object-contain mr-3 rounded-md"
                      />
                    )}
                    <p className="text-base font-medium" style={{ color: colors.darkText }}>{item.name} x {item.quantity}</p>
                  </div>
                  <p className="text-base font-semibold" style={{ color: colors.crimson }}>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <div className="flex justify-between items-center mt-4 pt-4 border-t-2" style={{ borderColor: colors.warmBeige }}>
                <p className="text-xl font-bold" style={{ color: colors.darkText }}>Total:</p>
                <p className="text-2xl font-extrabold" style={{ color: colors.crimson }}>${total.toFixed(2)}</p>
              </div>
            </section>

            {/* Información de Facturación */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{ color: colors.darkText }}>Información de Facturación</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    id="fullName"
                    value={billingInfo.fullName}
                    onChange={(e) => setBillingInfo({ ...billingInfo, fullName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-crimson focus:border-crimson"
                    style={{ borderColor: colors.warmBeige }}
                  />
                  {formErrors.fullName && <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    id="email"
                    value={billingInfo.email}
                    onChange={(e) => setBillingInfo({ ...billingInfo, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-crimson focus:border-crimson"
                    style={{ borderColor: colors.warmBeige }}
                  />
                  {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    id="phone"
                    value={billingInfo.phone}
                    onChange={(e) => setBillingInfo({ ...billingInfo, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-crimson focus:border-crimson"
                    style={{ borderColor: colors.warmBeige }}
                  />
                  {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                </div>
              </div>
            </section>

            {/* Dirección de Envío */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{ color: colors.darkText }}>Dirección de Envío</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                  <input
                    type="text"
                    id="address"
                    value={shippingAddress.address}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-crimson focus:border-crimson"
                    style={{ borderColor: colors.warmBeige }}
                  />
                  {formErrors.address && <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>}
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                  <input
                    type="text"
                    id="city"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-crimson focus:border-crimson"
                    style={{ borderColor: colors.warmBeige }}
                  />
                  {formErrors.city && <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>}
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">Estado / Provincia</label>
                  <input
                    type="text"
                    id="state"
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-crimson focus:border-crimson"
                    style={{ borderColor: colors.warmBeige }}
                  />
                  {formErrors.state && <p className="text-red-500 text-xs mt-1">{formErrors.state}</p>}
                </div>
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">Código Postal</label>
                  <input
                    type="text"
                    id="zipCode"
                    value={shippingAddress.zipCode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-crimson focus:border-crimson"
                    style={{ borderColor: colors.warmBeige }}
                  />
                  {formErrors.zipCode && <p className="text-red-500 text-xs mt-1">{formErrors.zipCode}</p>}
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">País</label>
                  <input
                    type="text"
                    id="country"
                    value={shippingAddress.country}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-crimson focus:border-crimson"
                    style={{ borderColor: colors.warmBeige }}
                  />
                  {formErrors.country && <p className="text-red-500 text-xs mt-1">{formErrors.country}</p>}
                </div>
              </div>
            </section>

            {/* Información de Pago */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{ color: colors.darkText }}>Información de Pago</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">Número de Tarjeta</label>
                  <input
                    type="text"
                    id="cardNumber"
                    value={cardDetails.cardNumber}
                    onChange={handleCardNumberChange}
                    inputMode="numeric"
                    pattern="[0-9\s]{13,19}"
                    maxLength={19} // Max length for formatted number (16 digits + 3 spaces)
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-crimson focus:border-crimson"
                    style={{ borderColor: colors.warmBeige }}
                  />
                  {formErrors.cardNumber && <p className="text-red-500 text-xs mt-1">{formErrors.cardNumber}</p>}
                  {cardDetails.cardNumber.length > 0 && cardType !== 'Desconocida' && (
                    <p className="text-sm text-gray-600 mt-1">Tipo de tarjeta: <span className="font-semibold">{cardType}</span></p>
                  )}
                  {formErrors.cardType && <p className="text-red-500 text-xs mt-1">{formErrors.cardType}</p>}
                </div>
                <div>
                  <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700 mb-1">Fecha de Vencimiento (MM/AA)</label>
                  <input
                    type="text"
                    id="expirationDate"
                    value={cardDetails.expirationDate}
                    onChange={handleExpirationDateChange}
                    inputMode="numeric"
                    pattern="\d{2}/\d{2}"
                    maxLength={5}
                    placeholder="MM/AA"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-crimson focus:border-crimson"
                    style={{ borderColor: colors.warmBeige }}
                  />
                  {formErrors.expirationDate && <p className="text-red-500 text-xs mt-1">{formErrors.expirationDate}</p>}
                </div>
                <div>
                  <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                  <input
                    type="text"
                    id="cvv"
                    value={cardDetails.cvv}
                    onChange={handleCvvChange}
                    inputMode="numeric"
                    pattern="\d{3,4}"
                    maxLength={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-crimson focus:border-crimson"
                    style={{ borderColor: colors.warmBeige }}
                  />
                  {formErrors.cvv && <p className="text-red-500 text-xs mt-1">{formErrors.cvv}</p>}
                </div>
              </div>
            </section>

            {/* Botón de Simular Pago */}
            <div className="text-center mt-8">
              <button
                type="submit"
                className="px-10 py-4 rounded-md font-bold text-white text-xl transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: colors.crimson }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#8B1313')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.crimson)}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Procesando Pago...
                  </div>
                ) : (
                  'Realizar Pago'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}