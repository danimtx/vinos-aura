// src/components/ToastWrapper.tsx
'use client'; // ¡Esto es crucial para que useCart funcione!

import { useCart } from '@/context/CartContext';
import Toast from './Toast';
import React from 'react'; // Importar React

export default function ToastWrapper({ children }: { children: React.ReactNode }) {
  // Consumimos el estado de la notificación del CartContext
  const { showNotification, notificationMessage, notificationType } = useCart();

  return (
    <>
      {children}
      {/* Renderizamos el componente Toast, pasándole los estados del carrito */}
      <Toast
        message={notificationMessage}
        type={notificationType}
        isVisible={showNotification}
      />
    </>
  );
}