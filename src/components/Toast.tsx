// src/components/Toast.tsx
'use client'; // Asegúrate de que esta directiva esté presente

import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
}

const colors = {
  crimson: '#B31B1B',
  darkGray: '#3E3E3E',
  white: '#FFFFFF',
  successGreen: '#28A745', // Un verde más estándar para éxito
  errorRed: '#DC3545',     // Un rojo más estándar para error
  infoBlue: '#007BFF',     // Un azul estándar para información
};

export default function Toast({ message, type, isVisible }: ToastProps) {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    setShow(isVisible);
  }, [isVisible]);

  if (!show) return null;

  let bgColor = colors.infoBlue;
  let Icon = InformationCircleIcon;

  switch (type) {
    case 'success':
      bgColor = colors.successGreen;
      Icon = CheckCircleIcon;
      break;
    case 'error':
      bgColor = colors.errorRed;
      Icon = ExclamationCircleIcon;
      break;
    default:
      bgColor = colors.infoBlue;
      Icon = InformationCircleIcon;
  }

  return (
    <div
      className={`fixed bottom-8 right-8 z-[9999] flex items-center gap-3 px-6 py-3 rounded-lg shadow-lg text-white transition-all duration-300 ease-out transform
        ${show ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
      style={{ backgroundColor: bgColor }}
    >
      <Icon className="h-6 w-6" />
      <p className="font-medium">{message}</p>
    </div>
  );
}