// src/app/register/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext'; // Importa useAuth

const colors = {
  crimson: '#B31B1B',
  warmBeige: '#D9C3A3',
  darkGray: '#3E3E3E',
  lightGrayBg: '#F5F5F5',
  white: '#FFFFFF',
  darkText: '#3E3E3E',
};

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [loading, setLoading] = useState(false); // Estado de carga
  const router = useRouter();
  const { register } = useAuth(); // Obtiene la función register del contexto

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');
    setLoading(true);

    if (password !== confirmPassword) {
      setMessage('Las contraseñas no coinciden.');
      setMessageType('error');
      setLoading(false);
      return;
    }

    const success = await register(email, password, name);
    setLoading(false);

    if (success) {
      setMessage('Cuenta creada con éxito. ¡Ya puedes iniciar sesión!');
      setMessageType('success');
      // Opcional: Redirigir al login después de un registro exitoso
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } else {
      setMessage('Error al crear la cuenta. Inténtalo de nuevo.'); // Mensaje de error genérico
      setMessageType('error');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-12" style={{ backgroundColor: colors.lightGrayBg }}>
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md" style={{ color: colors.darkText }}>
        <h2 className="text-3xl font-bold text-center mb-8" style={{ color: colors.crimson }}>Crear Cuenta</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Completo
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-crimson focus:border-crimson sm:text-sm"
              style={{ borderColor: colors.warmBeige }}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-crimson focus:border-crimson sm:text-sm"
              style={{ borderColor: colors.warmBeige }}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-crimson focus:border-crimson sm:text-sm"
              style={{ borderColor: colors.warmBeige }}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-crimson focus:border-crimson sm:text-sm"
              style={{ borderColor: colors.warmBeige }}
              required
            />
          </div>
          {message && (
            <p className={`text-sm mb-4 ${messageType === 'error' ? 'text-red-500' : 'text-green-600'}`}>
              {message}
            </p>
          )}
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-all duration-300 ease-in-out"
            style={{ backgroundColor: colors.crimson }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#8B1313')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.crimson)}
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm">
          ¿Ya tienes una cuenta?{' '}
          <Link href="/login" passHref>
            <span className="font-medium hover:underline cursor-pointer" style={{ color: colors.crimson }}>
              Inicia sesión aquí
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
}